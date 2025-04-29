import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Message, Option, SavedUserInfo, LiveGamesNotification } from '../types';
import { generateUniqueId } from '../utils/formatter';
import { BOT_RESPONSES } from '../botResponses';

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

export const useChat = () => {
  const { data: session } = useSession();
  // Inicializar messages com a mensagem de boas-vindas estática
  const [messages, setMessages] = useState<Message[]>(() => [{
    ...WELCOME_MESSAGE,
    timestamp: new Date() // Timestamp adicionado no cliente durante a inicialização do estado
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentInputAction, setCurrentInputAction] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [displayName, setDisplayName] = useState(session?.user?.name || 'Visitante');
  const [displayEmail, setDisplayEmail] = useState(session?.user?.email || '');
  const [customCpf, setCustomCpf] = useState('');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [savedUserInfo, setSavedUserInfo] = useState<SavedUserInfo | null>(null);
  const [savedNotification, setSavedNotification] = useState<LiveGamesNotification | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
    setMessages([{
      ...WELCOME_MESSAGE,
      timestamp: new Date() // Nova timestamp para a mensagem reiniciada
    }]);
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