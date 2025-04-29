'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { MdVerified } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BOT_RESPONSES, Message, Option } from './botResponses';

// Função para gerar IDs únicos
const generateUniqueId = (baseId: string) => {
  return `${baseId}-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;
};

// Função para mascarar e-mail
const maskEmail = (email: string) => {
  if (!email) return '';
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;
  
  const maskedUsername = username.charAt(0) + 
    '*'.repeat(Math.max(1, username.length - 2)) + 
    (username.length > 1 ? username.charAt(username.length - 1) : '');
  
  return `${maskedUsername}@${domain}`;
};

// Função para mascarar CPF
const maskCpf = (cpf: string) => {
  if (!cpf || cpf.length !== 11) return 'Não informado';
  return cpf.substring(0, 3) + '.XXX.XXX-' + cpf.substring(9, 11);
};

// Função para formatar CPF completo (exibição)
const formatCpf = (cpf: string) => {
  if (!cpf || cpf.length !== 11) return cpf;
  return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`;
};

// Interface para as informações salvas do usuário
interface SavedUserInfo {
  name: string;
  email: string;
  cpf: string;
  timestamp: Date;
}

// Interface para as notificações de jogos ao vivo
interface LiveGamesNotification {
  channel: string | null;
  contactInfo: string | null;
  teams: string[];
  timestamp?: Date;
}

// Função para gerar descrição de contato baseado no LiveGamesNotification
const getContactDescription = (notification: LiveGamesNotification): { 
  contactType: string;
  contactValue: string;
  contactDescription: string;
} => {
  const { channel, contactInfo } = notification;
  
  let contactType = '';
  let contactDescription = '';
  
  switch (channel) {
    case 'WhatsApp':
      contactType = 'número de WhatsApp';
      contactDescription = `no WhatsApp através do número ${contactInfo}`;
      break;
    case 'Telegram':
      contactType = 'usuário do Telegram';
      contactDescription = `no Telegram através do usuário ${contactInfo}`;
      break;
    case 'Discord':
      contactType = 'usuário do Discord';
      contactDescription = `no Discord através do usuário ${contactInfo}`;
      break;
    case 'E-mail':
      contactType = 'endereço de e-mail';
      contactDescription = `por E-mail no endereço ${contactInfo}`;
      break;
    default:
      contactType = `contato ${channel}`;
      contactDescription = `através de ${channel}: ${contactInfo}`;
  }

  return { 
    contactType, 
    contactValue: contactInfo || '', 
    contactDescription 
  };
};

// Função para gerar texto de confirmação mais simples
const generateConfirmationText = (notification: LiveGamesNotification): string => {
  const { contactType, contactValue } = getContactDescription(notification);
  
  return `Seu ${contactType} (${contactValue}) foi registrado com sucesso! ✅

Você poderá alterar esta configuração a qualquer momento em seu perfil.`;
};

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [customCpf, setCustomCpf] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [currentInputAction, setCurrentInputAction] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState(session?.user?.name || "Usuário");
  const [displayEmail, setDisplayEmail] = useState(session?.user?.email || "");
  const [showResetModal, setShowResetModal] = useState(false);
  const [savedInitialInformations, setSavedInitialInformations] = useState<SavedUserInfo | null>(null);
  // Estado para armazenar informações de notificação de jogos ao vivo
  const [liveGamesNotification, setLiveGamesNotification] = useState<LiveGamesNotification>({
    channel: null,
    contactInfo: null,
    teams: []
  });

  console.log(savedInitialInformations, liveGamesNotification);

  // Estado temporário para rastrear equipes selecionadas durante o fluxo
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  // Estado para rastrear o canal de notificação selecionado
  const [selectedNotificationChannel, setSelectedNotificationChannel] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Função para adicionar mensagem do bot
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
  
  // Função para lidar com a seleção de opção
  const handleOptionSelect = (option: Option, message: Message) => {
    // Se a mensagem não estiver ativa, mostrar o modal de confirmação
    if (message.isActive === false) {
      setShowResetModal(true);
      return;
    }
    
    // Adicionar a mensagem do usuário primeiro
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: generateUniqueId('user'),
        text: option.text,
        sender: 'user',
        type: 'text',
        timestamp: new Date(),
        isActive: false  // As mensagens do usuário não precisam estar ativas
      }
    ]);
    
    // Verificar ações especiais
    if (option.nextMessageId === 'confirm-name') {
      // Usar o nome do perfil
      const userName = session?.user?.name || "Usuário";
      setDisplayName(userName);
      // Após confirmar o nome, ir direto para o e-mail
      const emailText = 'Precisamos também do seu e-mail para enviar informações importantes. 📧 Deseja usar seu e-mail atual?';
      
      // Adicionar o e-mail como dado personalizado
      const customData = session?.user?.email 
        ? { email: session.user.email, showEmail: false, userName }
        : { userName };
      
      addBotMessage('ask-email', emailText, customData);
    } else if (option.nextMessageId === 'confirm-email') {
      // Verificar se o e-mail da sessão existe
      if (session?.user?.email) {
        setDisplayEmail(session.user.email);
        // Atualizar os dados personalizados com o e-mail
        const userEmail = session.user.email;
        // Ir para a pergunta sobre CPF
        addBotMessage('ask-cpf', undefined, { 
          ...message.customData,
          email: userEmail, 
          showEmail: false 
        });
      } else {
        // Se não tiver e-mail na sessão, pedir para digitar
        addBotMessage('custom-email-input');
      }
    } else if (option.id.includes('toggle-email') && message.customData?.email) {
      // Alternar a visibilidade do e-mail
      const updatedMessages = messages.map(msg => {
        if (msg.id === message.id) {
          return {
            ...msg,
            customData: {
              ...msg.customData,
              showEmail: !msg.customData?.showEmail
            }
          };
        }
        return msg;
      });
      setMessages(updatedMessages);
    } else if (option.id.includes('toggle-cpf') && message.customData?.cpf) {
      // Alternar a visibilidade do CPF
      const updatedMessages = messages.map(msg => {
        if (msg.id === message.id) {
          return {
            ...msg,
            customData: {
              ...msg.customData,
              showCpf: !msg.customData?.showCpf
            }
          };
        }
        return msg;
      });
      setMessages(updatedMessages);
    } else if (option.nextMessageId === 'show-profile-summary') {
      // Reunir as informações para o resumo
      const summaryData = {
        userName: displayName,
        email: displayEmail,
        cpf: customCpf || 'Não informado',
        showEmail: false,
        showCpf: false
      };
      
      addBotMessage('show-profile-summary', undefined, summaryData);
    } else if (option.nextMessageId === 'menu-after-cpf' && message.id.includes('show-profile-summary')) {
      // Salvar as informações do usuário quando confirmar
      setSavedInitialInformations({
        name: message.customData?.userName || displayName,
        email: message.customData?.email || displayEmail,
        cpf: message.customData?.cpf || 'Não informado',
        timestamp: new Date()
      });
      
      // Log para debug (pode ser removido posteriormente)
      console.log('Informações salvas:', {
        name: message.customData?.userName || displayName,
        email: message.customData?.email || displayEmail,
        cpf: message.customData?.cpf || 'Não informado',
        timestamp: new Date()
      });
      
      // Continuar com o fluxo normal
      addBotMessage(option.nextMessageId);
    } 
    // Iniciar o fluxo de notificação de jogos ao vivo
    else if (option.nextMessageId === 'live-games-notification-channel') {
      // Resetar o estado de equipes selecionadas
      setSelectedTeams([]);
      // Ir para a seleção de canal de notificação
      addBotMessage('live-games-notification-channel');
    }
    // Processar seleção do canal de notificação
    else if (option.nextMessageId === 'ask-contact-info') {
      // Armazenar o canal selecionado
      const channelMap: Record<string, string> = {
        'whatsapp': 'WhatsApp',
        'telegram': 'Telegram',
        'discord': 'Discord',
        'email': 'E-mail'
      };
      
      const channelText = channelMap[option.id] || '';
      setSelectedNotificationChannel(channelText);
      
      // Texto personalizado com base no canal
      let promptText = '';
      let inputLabelText = '';
      let inputMode: 'text' | 'numeric' | 'tel' | 'email' = 'text';
      
      switch (channelText) {
        case 'WhatsApp':
          promptText = 'Por favor, digite seu número de WhatsApp (apenas números, incluindo DDD): 📱';
          inputLabelText = 'Número de WhatsApp';
          inputMode = 'tel';
          break;
        case 'Telegram':
          promptText = 'Por favor, digite seu nome de usuário do Telegram (com @ no início): 📨';
          inputLabelText = 'Usuário do Telegram';
          break;
        case 'Discord':
          promptText = 'Por favor, digite seu nome de usuário do Discord: 🎮';
          inputLabelText = 'Usuário do Discord';
          break;
        case 'E-mail':
          promptText = 'Por favor, digite seu endereço de e-mail: 📧';
          inputLabelText = 'E-mail';
          inputMode = 'email';
          break;
        default:
          promptText = 'Por favor, digite sua informação de contato:';
          inputLabelText = 'Contato';
      }
      
      // Adicionar mensagem com input personalizado
      const customInputMessage = {
        ...BOT_RESPONSES['ask-contact-info'],
        text: promptText,
        inputLabel: inputLabelText,
        customData: {
          inputMode: inputMode,
          notificationChannel: channelText
        }
      };
      
      setMessages(prevMessages => [
        ...prevMessages,
        {
          ...customInputMessage,
          id: generateUniqueId(customInputMessage.id),
          timestamp: new Date()
        } as Message
      ]);
      
      setCurrentInputAction('submit-contact-info');
    }
    // Processar seleção e deselecão de equipes
    else if (option.nextMessageId === 'team-selection-toggle') {
      const teamMap: Record<string, string> = {
        'cs-team': 'CS:GO',
        'valorant-team': 'VALORANT',
        'r6-team': 'RAINBOW SIX',
        'rocket-team': 'ROCKET LEAGUE',
        'kings-team': 'KINGS LEAGUE',
        'lol-team': 'LEAGUE OF LEGENDS'
      };
      
      const teamName = teamMap[option.id.replace(/-[a-z0-9-]+$/, '')] || '';
      
      // Toggle da seleção da equipe
      if (selectedTeams.includes(teamName)) {
        // Se a equipe já está selecionada, remover
        setSelectedTeams(prev => prev.filter(team => team !== teamName));
      } else {
        // Se a equipe não está selecionada, adicionar
        setSelectedTeams(prev => [...prev, teamName]);
      }
      
      // Atualizar a mensagem atual em vez de adicionar uma nova
      const updatedMessages = [...messages];
      const currentMessageIndex = updatedMessages.findIndex(msg => msg.isActive);
      
      if (currentMessageIndex !== -1) {
        const currentMessage = updatedMessages[currentMessageIndex];
        const teamTemplate = BOT_RESPONSES['select-teams'];
        
        // Atualizar o texto com feedback da seleção atual
        const currentSelectionText = selectedTeams.length > 0
          ? `Equipes selecionadas: ${selectedTeams.join(', ')}.\nSelecione usando os switches e confirme quando terminar:`
          : 'Quais equipes da FURIA você gostaria de acompanhar? ⚔️\nSelecione usando os switches e confirme quando terminar:';
        
        // Atualizar as opções mostrando quais estão selecionadas
        const updatedOptions = teamTemplate.options?.map(opt => {
          // Extrair o ID base sem a parte única gerada
          const baseId = opt.id.replace(/-[a-z0-9-]+$/, '');
          const team = teamMap[baseId];
          
          // Manter o botão de confirmação inalterado
          if (opt.id === 'confirm-teams') {
            return {
              ...opt,
              id: generateUniqueId('confirm-teams') // Gerar ID único para garantir que o React atualize
            };
          }
          
          // Manter o botão de voltar inalterado
          if (opt.id.includes('return-to-main')) {
            return {
              ...opt,
              id: generateUniqueId('return-to-main')
            };
          }
          
          // Atualizar os botões das equipes
          if (team && selectedTeams.includes(team)) {
            return {
              ...opt,
              id: generateUniqueId(baseId), // Gerar ID único
              text: `${opt.text.replace(' ✓', '')} ✓`, // Adicionar marca de seleção
              nextMessageId: 'team-selection-toggle'
            };
          }
          return {
            ...opt,
            id: generateUniqueId(baseId), // Gerar ID único
            text: opt.text.replace(' ✓', ''), // Remover marca de seleção se existir
            nextMessageId: 'team-selection-toggle'
          };
        });
        
        // Atualizar a mensagem
        updatedMessages[currentMessageIndex] = {
          ...currentMessage,
          text: currentSelectionText,
          options: updatedOptions,
          customData: {
            ...currentMessage.customData,
            selectedTeams: [...selectedTeams]
          }
        };
        
        setMessages(updatedMessages);
      }
    }
    // Processar confirmação da seleção de equipes
    else if (option.nextMessageId === 'notification-confirmed') {
      // Encontrar a mensagem ativa para obter as equipes selecionadas
      const activeMessage = messages.find(msg => msg.isActive);
      const teamsFromMessage = activeMessage?.customData?.selectedTeams || [];
      
      // Usar as equipes da mensagem ativa ou do estado se disponível
      const finalSelectedTeams = teamsFromMessage.length > 0 ? teamsFromMessage : selectedTeams;
      
      // Verificar se pelo menos uma equipe foi selecionada
      if (finalSelectedTeams.length === 0) {
        // Se nenhuma equipe foi selecionada, mostrar mensagem de erro
        const errorMessage = {
          ...BOT_RESPONSES['select-teams'],
          text: 'Por favor, selecione pelo menos uma equipe para receber notificações. 🙏\nUtilize os switches para ativar as equipes desejadas.',
          options: BOT_RESPONSES['select-teams'].options?.map(opt => ({
            ...opt,
            id: generateUniqueId(opt.id)
          })) || []
        };
        
        setMessages(prevMessages => [
          ...prevMessages,
          {
            ...errorMessage,
            id: generateUniqueId(errorMessage.id),
            timestamp: new Date()
          } as Message
        ]);
      } else {
        // Salvar as informações de notificação
        const notificationInfo: LiveGamesNotification = {
          channel: selectedNotificationChannel,
          contactInfo: inputValue, // O contato deve ter sido armazenado pelo input anterior
          teams: [...finalSelectedTeams]
        };
        
        setLiveGamesNotification(notificationInfo);
        
        // Log para debug
        console.log('Notificação de jogos ao vivo configurada:', notificationInfo);
        
        // Texto personalizado com a lista de equipes selecionadas
        const confirmationText = `Inscrição confirmada com sucesso! 🎉\n\nVocê receberá notificações sobre os jogos das seguintes equipes:\n${finalSelectedTeams.join('\n• ')}\n\nAs notificações serão enviadas para ${selectedNotificationChannel}: ${inputValue}.\n\nFique ligado e não perca nenhuma partida! 🏆`;
        
        addBotMessage('notification-confirmed', confirmationText);
      }
    }
    // Processar seleção do canal de notificação para ir direto para confirmação
    else if (option.nextMessageId === 'direct-notification-confirmed') {
      // Armazenar o canal selecionado
      const channelMap: Record<string, string> = {
        'whatsapp': 'WhatsApp',
        'telegram': 'Telegram',
        'discord': 'Discord',
        'email': 'E-mail'
      };
      
      const channelText = channelMap[option.id] || '';
      setSelectedNotificationChannel(channelText);
      
      // Registrar a escolha do canal para uso posterior (sem informar contato ainda)
      const notificationInfo: LiveGamesNotification = {
        channel: channelText,
        contactInfo: null,
        teams: ['Todos os times'] // Indicar que receberá notificações de todos os times
      };
      
      setLiveGamesNotification(notificationInfo);
      
      // Texto personalizado com informações específicas para cada canal
      let pendingNotificationText = '';
      switch (channelText) {
        case 'WhatsApp':
          pendingNotificationText = `Você selecionou o WhatsApp como canal de notificação. Por favor, informe seu número de WhatsApp para completar o cadastro.`;
          break;
        case 'Telegram':
          pendingNotificationText = `Você selecionou o Telegram como canal de notificação. Por favor, informe seu nome de usuário do Telegram para completar o cadastro.`;
          break;
        case 'Discord':
          pendingNotificationText = `Você selecionou o Discord como canal de notificação. Por favor, informe seu nome de usuário do Discord para completar o cadastro.`;
          break;
        case 'E-mail':
          pendingNotificationText = `Você selecionou o E-mail como canal de notificação. Por favor, informe seu endereço de e-mail para completar o cadastro.`;
          break;
        default:
          pendingNotificationText = `Você selecionou ${channelText} como canal de notificação. Por favor, complete seu cadastro.`;
      }
      
      // Log para debug
      console.log('Canal selecionado:', notificationInfo.channel);
      
      // Solicitar o contato para o canal selecionado
      addBotMessage('ask-contact-info', pendingNotificationText, {
        notificationChannel: channelText
      });
    }
    else if (option.nextMessageId === 'in-development') {
      // Para todas as opções, manter o fluxo de "em desenvolvimento"
      addBotMessage(option.nextMessageId);
    } else {
      // Processar outros fluxos normalmente
      addBotMessage(option.nextMessageId);
    }
  };
  
  // Função para reiniciar a conversa
  const handleResetConversation = () => {
    // Limpar todas as mensagens e redefinir o estado
    setMessages([]);
    // Não precisamos mudar isInitialized, já que ele já foi setado como true anteriormente
    setShowResetModal(false);
    setInputValue('');
    setCurrentInputAction(null);
    
    // Mostrar indicador de digitação para parecer mais natural
    setIsTyping(true);
    
    // Reiniciar a conversa após um breve delay
    setTimeout(() => {
      setIsTyping(false);
      // Adicionar a mensagem de boas-vindas diretamente
      const welcomeMsg = BOT_RESPONSES['welcome'];
      const messageWithUniqueOptions = {
        ...welcomeMsg,
        options: welcomeMsg.options ? welcomeMsg.options.map(opt => ({
          ...opt,
          id: generateUniqueId(opt.id)
        })) : undefined,
        isActive: true
      };
      
      setMessages([{
        ...messageWithUniqueOptions,
        id: generateUniqueId(welcomeMsg.id),
        timestamp: new Date()
      } as Message]);
    }, 300);
  };
  
  // Função para lidar com a submissão de input
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || !currentInputAction) return;
    
    // Adicionar a mensagem do usuário com o input fornecido
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: generateUniqueId('user'),
        text: currentInputAction === 'submit-cpf' ? formatCpf(inputValue.replace(/\D/g, '')) : inputValue,
        sender: 'user',
        type: 'text',
        timestamp: new Date(),
        isActive: false
      }
    ]);
    
    // Processar a ação com base no input
    if (currentInputAction === 'submit-custom-name') {
      const nameToUse = inputValue.trim();
      setDisplayName(nameToUse);
      // Após confirmar o nome personalizado, ir direto para o e-mail
      const emailText = 'Precisamos também do seu e-mail para enviar informações importantes. 📧 Deseja usar seu e-mail atual?';
      
      // Adicionar o e-mail como dado personalizado
      const customData = session?.user?.email 
        ? { email: session.user.email, showEmail: false, userName: nameToUse }
        : { userName: nameToUse };
      
      addBotMessage('ask-email', emailText, customData);
    } else if (currentInputAction === 'submit-custom-email') {
      const emailToUse = inputValue.trim();
      // Validar o formato do e-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (emailRegex.test(emailToUse)) {
        setDisplayEmail(emailToUse);
        // Ir para a pergunta sobre CPF
        addBotMessage('ask-cpf', undefined, { 
          ...messages[messages.length - 2].customData, // Pegar os dados da mensagem do bot anterior
          email: emailToUse,
          showEmail: false
        });
      } else {
        // Se o e-mail for inválido, pedir novamente
        addBotMessage('custom-email-input', 'O formato do e-mail parece inválido. Por favor, digite um e-mail válido:');
      }
    } else if (currentInputAction === 'submit-cpf') {
      const cpfToUse = inputValue.trim().replace(/\D/g, ''); // Remover caracteres não numéricos
      
      // Validar CPF (implementação simples - apenas verifica se tem 11 dígitos)
      if (cpfToUse.length === 11) {
        setCustomCpf(cpfToUse);
        // Atualizar os dados personalizados com o CPF
        addBotMessage('cpf-confirmed', undefined, {
          ...messages[messages.length - 2].customData, // Pegar os dados da mensagem do bot anterior
          cpf: cpfToUse,
          showCpf: false
        });
      } else {
        // Se o CPF for inválido, pedir novamente
        addBotMessage('input-cpf', 'O CPF deve conter 11 dígitos. Por favor, digite novamente (apenas números):');
      }
    } else if (currentInputAction === 'submit-contact-info') {
      // Validar e processar a informação de contato
      let isValidContact = true;
      let errorMessage = '';
      
      // Encontrar a mensagem ativa que contém o tipo de canal
      const activeMessage = messages.find(msg => msg.isActive);
      const channelType = activeMessage?.customData?.notificationChannel || selectedNotificationChannel;
      
      // Validações específicas por canal
      if (channelType === 'WhatsApp') {
        // Validação de número de WhatsApp (apenas números)
        if (!/^\d{10,15}$/.test(inputValue)) {
          isValidContact = false;
          errorMessage = 'O número de WhatsApp deve conter apenas números (10-15 dígitos incluindo DDD e código do país). Por favor, digite novamente:';
        }
      } else if (channelType === 'Telegram') {
        // Validação de @ no início
        if (!inputValue.startsWith('@') || inputValue.length < 2) {
          isValidContact = false;
          errorMessage = 'O nome de usuário do Telegram deve começar com @. Por favor, digite novamente:';
        }
      } else if (channelType === 'Discord') {
        // Discord agora usa apenas o nome de usuário sem o #
        if (inputValue.length < 2) {
          isValidContact = false;
          errorMessage = 'O nome de usuário do Discord é muito curto. Por favor, digite novamente:';
        }
      } else if (channelType === 'E-mail') {
        // Validação de e-mail
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)) {
          isValidContact = false;
          errorMessage = 'O formato do e-mail não parece válido. Por favor, digite novamente:';
        }
      }
      
      if (isValidContact) {
        // Pular a seleção de times e ir direto para confirmação final
        // Salvar as informações de notificação
        const notificationInfo: LiveGamesNotification = {
          channel: channelType,
          contactInfo: inputValue,
          teams: ['Todos os times'] // Default para todos os times
        };
        
        // Salvar no estado para uso posterior
        setLiveGamesNotification(notificationInfo);
        
        // Usar a função utilitária para gerar o texto de confirmação
        const confirmationText = generateConfirmationText(notificationInfo);
        
        // Adicionar mensagem de confirmação direta com o botão de confirmação
        addBotMessage('direct-notification-confirmed', confirmationText);
        
        // Log para debug de informações de contato
        console.log('Notificação configurada:', notificationInfo);
      } else {
        // Mostrar erro e pedir novamente
        const customInputMessage = {
          ...BOT_RESPONSES['ask-contact-info'],
          text: errorMessage,
          inputLabel: `${channelType} (correto)`,
          customData: {
            inputMode: activeMessage?.customData?.inputMode || 'text',
            notificationChannel: channelType
          }
        };
        
        setMessages(prevMessages => [
          ...prevMessages,
          {
            ...customInputMessage,
            id: generateUniqueId(customInputMessage.id),
            timestamp: new Date()
          } as Message
        ]);
        
        // Manter o mesmo inputAction
        setCurrentInputAction('submit-contact-info');
      }
    }
    
    // Limpar o input e a ação atual
    setInputValue('');
    setCurrentInputAction(null);
  };
  
  // Função para lidar com mudanças no input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Encontrar a mensagem ativa atual
    const activeMessage = messages.find(msg => msg.isActive);
    
    // Se for input de CPF, permitir apenas números e aplicar formatação
    if (currentInputAction === 'submit-cpf') {
      const numbersOnly = value.replace(/\D/g, '');
      
      // Limitar a 11 dígitos
      if (numbersOnly.length <= 11) {
        // Aplicar máscara de CPF durante a digitação
        let formattedValue = '';
        
        if (numbersOnly.length <= 3) {
          formattedValue = numbersOnly;
        } else if (numbersOnly.length <= 6) {
          formattedValue = `${numbersOnly.substring(0, 3)}.${numbersOnly.substring(3)}`;
        } else if (numbersOnly.length <= 9) {
          formattedValue = `${numbersOnly.substring(0, 3)}.${numbersOnly.substring(3, 6)}.${numbersOnly.substring(6)}`;
        } else {
          formattedValue = `${numbersOnly.substring(0, 3)}.${numbersOnly.substring(3, 6)}.${numbersOnly.substring(6, 9)}-${numbersOnly.substring(9)}`;
        }
        
        setInputValue(formattedValue);
      }
    } 
    // Validação específica para cada tipo de contato
    else if (currentInputAction === 'submit-contact-info' && activeMessage?.customData?.notificationChannel) {
      const channelType = activeMessage.customData.notificationChannel;
      
      switch(channelType) {
        case 'WhatsApp':
          // Permitir apenas números para WhatsApp
          const numbersOnly = value.replace(/\D/g, '');
          setInputValue(numbersOnly);
          break;
        case 'Telegram':
          // Para Telegram, garantir que comece com @
          if (value === '@') {
            setInputValue(value);
          } else if (value.startsWith('@') || value === '') {
            setInputValue(value);
          } else {
            setInputValue('@' + value);
          }
          break;
        case 'Discord':
          // Discord usa apenas o nome de usuário
          setInputValue(value);
          break;
        case 'E-mail':
          // E-mail sem validação especial na digitação
          setInputValue(value);
          break;
        default:
          // Para outros tipos de input, manter comportamento normal
          setInputValue(value);
      }
    } else {
      // Para outros tipos de input, manter comportamento normal
      setInputValue(value);
    }
  };
  
  // Inicializar o chat quando o componente montar
  useEffect(() => {
    if (!isInitialized) {
      addBotMessage('welcome');
      setIsInitialized(true);
    }
  }, [isInitialized]);
  
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
  
  return (
    <div className="flex justify-center items-center py-6 px-4">
      <div className="max-w-7xl w-full bg-background border rounded-xl shadow-lg h-[calc(100vh-150px)] flex flex-col">
        {/* Cabeçalho do chat */}
        <div className="flex items-center p-4 border-b">
          <Avatar className="h-10 w-10 mr-3 border border-primary/30 p-0.5 rounded-full">
            <AvatarImage src="https://res.cloudinary.com/dnuayiowd/image/upload/v1745531725/LOGO-MAIN_linrk0.png" alt="FURIA" />
            <AvatarFallback>F</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <h2 className="font-semibold">FURIA</h2>
              <MdVerified className="ml-1 text-amber-500" size={16} />
            </div>
            <p className="text-sm text-muted-foreground">Assistente Virtual</p>
          </div>
        </div>
        
        {/* Área das mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start max-w-[80%]">
                {/* Avatar (mostrado apenas para mensagens do bot) */}
                {message.sender === 'bot' && (
                  <Avatar className="h-8 w-8 mr-2 mt-1 border border-primary/30 p-0.5 rounded-full">
                    <AvatarImage src="https://res.cloudinary.com/dnuayiowd/image/upload/v1745531725/LOGO-MAIN_linrk0.png" alt="FURIA" />
                    <AvatarFallback>F</AvatarFallback>
                  </Avatar>
                )}
                
                <div>
                  {/* Nome do remetente */}
                  <div className="text-xs text-muted-foreground mb-1 flex items-center">
                    {message.sender === 'bot' ? (
                      <>
                        FURIA
                        <MdVerified className="ml-1 text-amber-500" size={12} />
                      </>
                    ) : displayName}
                  </div>
                  
                  {/* Conteúdo da mensagem */}
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-secondary/80 text-secondary-foreground border border-border'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {message.id.includes('welcome') ? (
                      <div>
                        <p>Olá! Boas-vindas ao chat da FURIA Connect! Aqui você pode obter informações sobre nosso time, jogadores, próximos eventos e muito mais. Para continuar, você precisa aceitar nossos termos de uso.</p>
                        <p className="mt-2">
                          Os termos podem ser encontrados em:{' '}
                          <a 
                            href="https://terms.furia.gg" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary underline hover:text-primary/80"
                          >
                            https://terms.furia.gg
                          </a>
                        </p>
                      </div>
                    ) : message.id.includes('show-profile-summary') ? (
                      <div>
                        <p>{message.text}</p>
                        
                        {/* Resumo do perfil */}
                        <div className="mt-4 bg-background/80 p-3 rounded-md">
                          <div className="space-y-3">
                            <div>
                              <span className="text-xs text-muted-foreground">Nome:</span>
                              <p className="font-medium">{message.customData?.userName || displayName}</p>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">E-mail:</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs h-6 px-2"
                                  onClick={() => handleOptionSelect({
                                    id: `toggle-email-${message.id}`,
                                    text: message.customData?.showEmail ? 'Esconder e-mail' : 'Mostrar e-mail',
                                    nextMessageId: ''
                                  }, message)}
                                >
                                  {message.customData?.showEmail ? 'Esconder' : 'Mostrar'}
                                </Button>
                              </div>
                              <p className="font-mono">
                                {message.customData?.email 
                                  ? (message.customData?.showEmail 
                                    ? message.customData.email 
                                    : maskEmail(message.customData.email))
                                  : 'Não informado'}
                              </p>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">CPF:</span>
                                {message.customData?.cpf && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs h-6 px-2"
                                    onClick={() => handleOptionSelect({
                                      id: `toggle-cpf-${message.id}`,
                                      text: message.customData?.showCpf ? 'Esconder CPF' : 'Mostrar CPF',
                                      nextMessageId: ''
                                    }, message)}
                                  >
                                    {message.customData?.showCpf ? 'Esconder' : 'Mostrar'}
                                  </Button>
                                )}
                              </div>
                              <p className="font-mono">
                                {message.customData?.cpf 
                                  ? (message.customData?.showCpf 
                                    ? message.customData.cpf 
                                    : maskCpf(message.customData.cpf))
                                  : 'Não informado'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p>{message.text}</p>
                        
                        {/* Mostrar botão e e-mail para mensagens com customData.email */}
                        {message.customData?.email && !message.id.includes('show-profile-summary') && !message.id.includes('ask-cpf') && !message.id.includes('input-cpf') && !message.id.includes('cpf-declined') && (
                          <div className="mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => handleOptionSelect({
                                id: `toggle-email-${message.id}`,
                                text: message.customData?.showEmail ? 'Esconder e-mail' : 'Mostrar e-mail',
                                nextMessageId: ''
                              }, message)}
                            >
                              {message.customData?.showEmail ? 'Esconder e-mail' : 'Mostrar e-mail'}
                            </Button>
                            
                            {message.customData?.showEmail && (
                              <div className="mt-1 px-3 py-2 bg-muted rounded text-sm font-mono">
                                {message.customData.email}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Opções de resposta (quando aplicável) */}
                    {message.type === 'options' && message.options && (
                      <div className="mt-3 space-y-2">
                        {message.options.map((option) => (
                          message.id.includes('select-teams') && option.id !== 'confirm-teams' && !option.id.includes('return-to-main') ? (
                            // Renderizar switches para seleção de times
                            <div 
                              key={option.id}
                              className="flex items-center justify-between p-3 rounded-md bg-background hover:bg-muted border border-muted-foreground/20 cursor-pointer transition-all duration-200 ease-in-out"
                              onClick={() => handleOptionSelect(option, message)}
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-base">{option.text.replace(' ✓', '')}</span>
                                {option.text.includes('✓') && (
                                  <span className="text-sm text-primary">Selecionado</span>
                                )}
                              </div>
                              <div className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${option.text.includes('✓') ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${option.text.includes('✓') ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white'}`} />
                              </div>
                            </div>
                          ) : (
                            // Botão padrão para outras opções
                            <Button
                              key={option.id}
                              variant="outline"
                              className={`w-full justify-start text-left bg-background hover:bg-muted border-muted-foreground/20 ${message.isActive === false ? 'opacity-70' : ''}`}
                              onClick={() => handleOptionSelect(option, message)}
                            >
                              {option.text}
                            </Button>
                          )
                        ))}
                      </div>
                    )}
                    
                    {/* Campo de entrada para mensagens do tipo input */}
                    {message.type === 'input' && message.showInput && message.isActive !== false && (
                      <form onSubmit={handleInputSubmit} className="mt-3">
                        <div className="flex flex-col space-y-2">
                          <Input
                            type={message.customData?.inputMode === 'email' ? 'email' : 'text'}
                            placeholder={message.inputLabel || "Digite sua resposta"}
                            value={inputValue}
                            onChange={handleInputChange}
                            className="bg-background"
                            autoFocus
                            inputMode={message.customData?.inputMode || (currentInputAction === 'submit-cpf' ? 'numeric' : 'text')}
                          />
                          <Button type="submit" disabled={!inputValue.trim()}>
                            Enviar
                          </Button>
                        </div>
                      </form>
                    )}
                    
                    {/* Horário da mensagem */}
                    <div className="text-[10px] opacity-70 text-right mt-1">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
                
                {/* Avatar (mostrado apenas para mensagens do usuário) */}
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8 ml-2 mt-1">
                    {session?.user?.image ? (
                      <AvatarImage src={session.user.image} alt={displayName} />
                    ) : (
                      <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          
          {/* Indicador de digitação */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start">
                <Avatar className="h-8 w-8 mr-2 mt-1 border border-primary/30 p-0.5 rounded-full">
                  <AvatarImage src="https://res.cloudinary.com/dnuayiowd/image/upload/v1745531725/LOGO-MAIN_linrk0.png" alt="FURIA" />
                  <AvatarFallback>F</AvatarFallback>
                </Avatar>
                
    <div>
                  <div className="text-xs text-muted-foreground mb-1 flex items-center">
                    FURIA
                    <MdVerified className="ml-1 text-amber-500" size={12} />
                  </div>
                  <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Rodapé do chat (desativado, pois não há input de texto) */}
        <div className="p-4 border-t bg-muted/50">
          <div className="flex items-center justify-center text-muted-foreground text-sm">
            <p>Chat automático do FURIA Connect - Use os botões acima para navegar</p>
          </div>
        </div>
      </div>
      
      {/* Modal de confirmação para reiniciar a conversa */}
      <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reiniciar conversa?</DialogTitle>
            <DialogDescription>
              Você está tentando interagir com uma mensagem anterior. Deseja reiniciar a conversa do início?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowResetModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleResetConversation} variant="default">
              Reiniciar conversa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
