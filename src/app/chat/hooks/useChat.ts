import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Message, SavedUserInfo, LiveGamesNotification } from '../types';
import { generateUniqueId } from '../utils/formatter';
import { BOT_RESPONSES } from '../botResponses';
import { getContactInfos } from './getContactInfos';

// Mensagem estática de boas-vindas - sem elementos dinâmicos como new Date()
const WELCOME_MESSAGE: Omit<Message, 'timestamp'> = {
  id: 'welcome-static',
  text: 'Olá! 👋 Boas-vindas ao chat da FURIA Connect! Aqui você pode obter informações sobre nosso time, jogadores, próximos eventos e muito mais. Para continuar, você precisa aceitar nossos termos de uso. Os termos podem ser encontrados em: https://terms.furia.gg',
  sender: 'bot',
  type: 'options',
  options: [
    {
      id: 'accept-terms',
      text: 'Aceitar Termos ✅',
      nextMessageId: 'ask-name'
    }
  ],
  isActive: true
};

// Mensagem do menu inicial
const MENU_MESSAGE: Omit<Message, 'timestamp'> = {
  ...BOT_RESPONSES['menu-after-cpf'],
  isActive: true
};

export const useChat = () => {
  const { data: session, status } = useSession();
  // Estado inicial com loading
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(true); // Começar com estado de digitação
  const [currentInputAction, setCurrentInputAction] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [displayName, setDisplayName] = useState(session?.user?.name || 'Visitante');
  const [displayEmail, setDisplayEmail] = useState(session?.user?.email || '');
  const [customCpf, setCustomCpf] = useState('');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [savedUserInfo, setSavedUserInfo] = useState<SavedUserInfo | null>(null);
  const [savedNotification, setSavedNotification] = useState<LiveGamesNotification | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Verificar se o usuário já tem cadastro ao carregar
  useEffect(() => {
    if (status === 'loading') {
      return; // Aguardar a sessão ser carregada
    }
    
    if (session?.user && !isInitialized) {
      checkExistingUser();
    } else if (status === 'unauthenticated' && !isInitialized) {
      // Se não tem sessão, mostrar a mensagem de boas-vindas normal
      setIsTyping(false);
      setMessages([{
        ...WELCOME_MESSAGE,
        timestamp: new Date()
      }]);
      setIsInitialized(true);
    }
  }, [session, status]);
  
  // Função para verificar se o usuário já tem cadastro
  const checkExistingUser = async () => {
    try {
      setIsTyping(true);
      
      const result = await getContactInfos();
      
      if (result.exists && result.data) {
        // Usuário já tem cadastro, ir direto para o menu
        setDisplayName(result.data.name || session?.user?.name || 'Visitante');
        setDisplayEmail(result.data.email || session?.user?.email || '');
        if (result.data.cpf) {
          setCustomCpf(result.data.cpf);
        }
        
        // Definir informações salvas
        setSavedUserInfo({
          name: result.data.name || session?.user?.name || 'Visitante',
          email: result.data.email || session?.user?.email || '',
          cpf: result.data.cpf || 'Não informado',
          timestamp: new Date()
        });
        
        // Mostrar mensagem de boas-vindas de retorno
        setTimeout(() => {
          setIsTyping(false);
          setMessages([{
            ...MENU_MESSAGE,
            id: `menu-${Date.now()}`,
            timestamp: new Date()
          }]);
        }, 1000);
      } else {
        // Usuário não tem cadastro, mostrar fluxo normal
        setIsTyping(false);
        setMessages([{
          ...WELCOME_MESSAGE,
          timestamp: new Date()
        }]);
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      // Em caso de erro, mostrar a mensagem de boas-vindas normal
      setIsTyping(false);
      setMessages([{
        ...WELCOME_MESSAGE,
        timestamp: new Date()
      }]);
      setIsInitialized(true);
    }
  };
  
  // Função para adicionar mensagem do bot (implementação original)
  const addBotMessage = (messageId: string, customText?: string, customData?: Message['customData']) => {
    const botResponse = BOT_RESPONSES[messageId];
    
    if (botResponse) {
      // Mostrar indicador de digitação
      setIsTyping(true);
      
      // Desativar todas as mensagens anteriores
      setMessages(prevMessages => 
        prevMessages.map(msg => ({
          ...msg,
          isActive: false
        }))
      );
      
      // Pequeno delay para simular digitação do bot
      setTimeout(() => {
        setIsTyping(false);
        
        // Criar cópia da mensagem para garantir que as opções tenham IDs únicos
        const messageWithUniqueOptions = {
          ...botResponse,
          options: botResponse.options ? botResponse.options.map(opt => ({
            ...opt,
            id: generateUniqueId(opt.id)
          })) : undefined,
          isActive: true,  // Definir a nova mensagem como ativa
          customData: customData // Adicionar dados personalizados, se fornecidos
        };
        
        // Substituir o texto se foi fornecido um personalizado
        if (customText) {
          messageWithUniqueOptions.text = customText;
        }
        
        // Se for uma mensagem de input, configurar a ação atual
        if (messageWithUniqueOptions.type === 'input' && messageWithUniqueOptions.inputAction) {
          setCurrentInputAction(messageWithUniqueOptions.inputAction);
        } else {
          setCurrentInputAction(null);
        }
        
        setMessages(prevMessages => [
          ...prevMessages,
          {
            ...messageWithUniqueOptions,
            id: generateUniqueId(botResponse.id),
            timestamp: new Date()
          } as Message
        ]);
      }, 1000); // Delay de 1 segundo para parecer mais natural
    }
  };
  
  // Reiniciar conversa
  const handleResetConversation = () => {
    // Limpar todas as mensagens e redefinir o estado
    setIsTyping(true);
    
    // Verificar se o usuário tem cadastro novamente
    if (session?.user) {
      checkExistingUser();
    } else {
      setMessages([{
        ...WELCOME_MESSAGE,
        timestamp: new Date() // Nova timestamp para a mensagem reiniciada
      }]);
      setIsTyping(false);
    }
    
    setInputValue('');
    setCurrentInputAction(null);
    setShowResetModal(false);
  };
  
  // Rolar para a última mensagem quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  // Formatação da data/hora para as mensagens
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isTyping,
    setIsTyping,
    currentInputAction,
    setCurrentInputAction,
    showResetModal,
    setShowResetModal,
    displayName,
    setDisplayName,
    displayEmail, 
    setDisplayEmail,
    customCpf,
    setCustomCpf,
    selectedTeams,
    setSelectedTeams,
    savedUserInfo,
    setSavedUserInfo,
    savedNotification,
    setSavedNotification,
    messagesEndRef,
    addBotMessage,
    handleResetConversation,
    formatTime,
    sessionUserImage: session?.user?.image
  };
}; 