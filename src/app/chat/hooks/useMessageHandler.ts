import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Message, Option, LiveGamesNotification, SavedUserInfo, ContactDescription } from '../types';
import { useChat } from './useChat';
import { formatCpf } from '../utils/formatter';
import { BOT_RESPONSES } from '../botResponses';
import { createContactInfos } from './createContactInfos';
import { editContactInfos } from './editContactInfos';
import { getContactInfos } from './getContactInfos';

// Interface para armazenar informações de contato
interface ContactInfo {
  channel: string | null;
  contact: string | null;
}

export const useMessageHandler = () => {
  const { data: session } = useSession();
  const {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isTyping,
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
    setSavedUserInfo,
    setSavedNotification,
    messagesEndRef,
    addBotMessage,
    handleResetConversation,
    sessionUserImage
  } = useChat();

  // Estado para o canal de notificação selecionado
  const [selectedNotificationChannel, setSelectedNotificationChannel] = useState<string | null>(null);
  
  // Novo estado para armazenar informações de contato
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    channel: null,
    contact: null
  });

  // Lista de times padrão
  const allTeams = ["VALORANT", "CS2", "RAINBOW 6", "ROCKET LEAGUE", "KINGS LEAGUE", "LEAGUE OF LEGENDS", "PUBG"];

  // Efeito para logar sempre que as informações de contato forem alteradas
  useEffect(() => {
    if (contactInfo.channel || contactInfo.contact) {
      // Remover log de debug
    }
  }, [contactInfo]);

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
        id: `user-${Date.now()}`,
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
      
      // Se o usuário tiver declinado fornecer o CPF, salvar a informação no banco de dados
      if (message.id.includes('cpf-declined')) {
        const userName = displayName;
        const userEmail = displayEmail;
        const userCpf = 'Não informado';
        
        // Salvar no banco de dados
        createContactInfos(userName, userEmail, userCpf)
          .then(result => {
            // Remover log de debug
            
            // Verificar se houve cooldown
            if (result.cooldown) {
              // Mostrar mensagem de cooldown para o usuário
              const cooldownMessage = {
                id: `cooldown-message-${Date.now()}`,
                text: `${result.message} Por favor, tente novamente mais tarde.`,
                sender: 'bot',
                type: 'text',
                timestamp: new Date(),
                isActive: false
              };
              
              setMessages(prevMessages => [...prevMessages, cooldownMessage as Message]);
              return;
            }
          })
          .catch(error => {
            console.error('Erro ao salvar dados no banco (sem CPF):', error);
          });
      }
      
      addBotMessage('show-profile-summary', undefined, summaryData);
    } else if (option.nextMessageId === 'menu-after-cpf' && message.id.includes('show-profile-summary')) {
      // Obter os dados para salvar
      const userName = message.customData?.userName || displayName;
      const userEmail = message.customData?.email || displayEmail;
      const userCpf = message.customData?.cpf || 'Não informado';
      
      // Salvar as informações do usuário quando confirmar
      setSavedUserInfo({
        name: userName,
        email: userEmail,
        cpf: userCpf,
        timestamp: new Date()
      });
      
      // Salvar no banco de dados usando a função createContactInfos
      createContactInfos(userName, userEmail, userCpf)
        .then(result => {
          // Remover log de debug
          
          // Verificar se houve cooldown
          if (result.cooldown) {
            // Mostrar mensagem de cooldown para o usuário
            const cooldownMessage = {
              id: `cooldown-message-${Date.now()}`,
              text: `${result.message} Por favor, tente novamente mais tarde.`,
              sender: 'bot',
              type: 'text',
              timestamp: new Date(),
              isActive: false
            };
            
            setMessages(prevMessages => [...prevMessages, cooldownMessage as Message]);
            return;
          }
        })
        .catch(error => {
          console.error('Erro ao salvar dados no banco:', error);
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
      // Extrair o nome do canal diretamente do ID do botão
      // O formato do ID é tipicamente algo como 'whatsapp-1234567890'
      const rawId = option.id;
      // Extraímos a parte antes do primeiro hífen
      const channelId = rawId.split('-')[0] || '';
      
      // Remover log de debug
      
      // Mapeamento para nomes amigáveis de canais
      const channelMap: Record<string, string> = {
        'whatsapp': 'WhatsApp',
        'telegram': 'Telegram',
        'discord': 'Discord',
        'email': 'E-mail'
      };
      
      // Obtém o nome amigável ou usa o ID original se não for mapeado
      const channelText = channelMap[channelId] || channelId;
      setSelectedNotificationChannel(channelText);
      
      // Atualizar o estado de contactInfo com o canal selecionado
      setContactInfo(prev => ({
        ...prev,
        channel: channelText
      }));
      
      // Verificar se o usuário já possui informações de contato registradas
      getContactInfos().then(result => {
        if (result.exists && result.data && result.data.mediaName && result.data.mediaContact) {
          // Usuário já tem informações de mídia social registradas
          const contactInfoText = BOT_RESPONSES['contact-info-exists'].text
            .replace('{mediaName}', result.data.mediaName)
            .replace('{mediaContact}', result.data.mediaContact);
          
          const contactInfoMessage = {
            ...BOT_RESPONSES['contact-info-exists'],
            id: `contact-info-exists-${Date.now()}`,
            text: contactInfoText,
            timestamp: new Date(),
            isActive: true,
            options: BOT_RESPONSES['contact-info-exists'].options?.map(opt => ({
              ...opt,
              id: `${opt.id}-${Date.now()}`
            }))
          };
          
          setMessages(prevMessages => [
            ...prevMessages.map(msg => ({ ...msg, isActive: false })),
            contactInfoMessage as Message
          ]);
        } else {
          // Usuário não tem informações de mídia social registradas, continuar com o fluxo normal
          // Registrar a escolha do canal para uso posterior (sem informar contato ainda)
          const notificationInfo: LiveGamesNotification = {
            channel: channelText,
            contactInfo: null,
            teams: allTeams // Usar a lista de todos os times
          };
          
          setSavedNotification(notificationInfo);
          
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
              id: `ask-contact-info-${Date.now()}`,
              timestamp: new Date()
            } as Message
          ]);
          
          setCurrentInputAction('submit-contact-info');
        }
      }).catch(error => {
        console.error('Erro ao verificar informações de contato:', error);
        // Em caso de erro, prosseguir com o fluxo normal
        // Registrar a escolha do canal para uso posterior (sem informar contato ainda)
        const notificationInfo: LiveGamesNotification = {
          channel: channelText,
          contactInfo: null,
          teams: allTeams // Usar a lista de todos os times
        };
        
        setSavedNotification(notificationInfo);
        
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
            id: `ask-contact-info-${Date.now()}`,
            timestamp: new Date()
          } as Message
        ]);
        
        setCurrentInputAction('submit-contact-info');
      });
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
        const updatedOptions = teamTemplate.options?.map((opt: Option) => {
          // Extrair o ID base sem a parte única gerada
          const baseId = opt.id.replace(/-[a-z0-9-]+$/, '');
          const team = teamMap[baseId];
          
          // Manter o botão de confirmação inalterado
          if (opt.id === 'confirm-teams') {
            return {
              ...opt,
              id: `confirm-teams-${Date.now()}` // Gerar ID único para garantir que o React atualize
            };
          }
          
          // Manter o botão de voltar inalterado
          if (opt.id.includes('return-to-main')) {
            return {
              ...opt,
              id: `return-to-main-${Date.now()}`
            };
          }
          
          // Atualizar os botões das equipes
          if (team && selectedTeams.includes(team)) {
            return {
              ...opt,
              id: `${baseId}-${Date.now()}`, // Gerar ID único
              text: `${opt.text.replace(' ✓', '')} ✓`, // Adicionar marca de seleção
              nextMessageId: 'team-selection-toggle'
            };
          }
          return {
            ...opt,
            id: `${baseId}-${Date.now()}`, // Gerar ID único
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
          options: BOT_RESPONSES['select-teams'].options?.map((opt: Option) => ({
            ...opt,
            id: `${opt.id}-${Date.now()}`
          })) || []
        };
        
        setMessages(prevMessages => [
          ...prevMessages,
          {
            ...errorMessage,
            id: `error-message-${Date.now()}`,
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
        
        setSavedNotification(notificationInfo);
        
        // Atualizar o estado de contactInfo
        setContactInfo({
          channel: selectedNotificationChannel,
          contact: inputValue
        });
        
        // Atualizar as informações de contato de mídia no banco de dados
        if (selectedNotificationChannel && inputValue) {
          // Verificar se o usuário já possui informações de contato registradas
          getContactInfos().then(result => {
            if (result.exists && result.data && result.data.mediaName && result.data.mediaContact) {
              // Usuário já tem informações de mídia social registradas
              const contactInfoText = BOT_RESPONSES['contact-info-exists'].text
                .replace('{mediaName}', result.data.mediaName)
                .replace('{mediaContact}', result.data.mediaContact);
              
              const contactInfoMessage = {
                ...BOT_RESPONSES['contact-info-exists'],
                id: `contact-info-exists-${Date.now()}`,
                text: contactInfoText,
                timestamp: new Date(),
                isActive: true,
                options: BOT_RESPONSES['contact-info-exists'].options?.map(opt => ({
                  ...opt,
                  id: `${opt.id}-${Date.now()}`
                }))
              };
              
              setMessages(prevMessages => [
                ...prevMessages.map(msg => ({ ...msg, isActive: false })),
                contactInfoMessage as Message
              ]);
            } else {
              // Prosseguir com a atualização
              editContactInfos(selectedNotificationChannel, inputValue)
                .then(result => {
                  // Remover log de debug
                  
                  // Verificar se houve cooldown
                  if (result.cooldown) {
                    // Mostrar mensagem de cooldown para o usuário
                    const cooldownMessage = {
                      id: `cooldown-message-${Date.now()}`,
                      text: `${result.message} Por favor, tente novamente mais tarde.`,
                      sender: 'bot',
                      type: 'text',
                      timestamp: new Date(),
                      isActive: false
                    };
                    
                    setMessages(prevMessages => [...prevMessages, cooldownMessage as Message]);
                    return;
                  }
                })
                .catch(error => {
                  console.error('Erro ao atualizar informações de contato de mídia (confirmação de equipes):', error);
                });
            }
          }).catch(error => {
            console.error('Erro ao verificar informações de contato:', error);
            // Em caso de erro, prosseguir com a atualização normal
            editContactInfos(selectedNotificationChannel, inputValue)
              .then(result => {
                // Remover log de debug
                
                // Verificar se houve cooldown
                if (result.cooldown) {
                  // Mostrar mensagem de cooldown para o usuário
                  const cooldownMessage = {
                    id: `cooldown-message-${Date.now()}`,
                    text: `${result.message} Por favor, tente novamente mais tarde.`,
                    sender: 'bot',
                    type: 'text',
                    timestamp: new Date(),
                    isActive: false
                  };
                  
                  setMessages(prevMessages => [...prevMessages, cooldownMessage as Message]);
                  return;
                }
              })
              .catch(error => {
                console.error('Erro ao atualizar informações de contato de mídia (confirmação de equipes):', error);
              });
          });
        }
        
        // Texto simplificado sem detalhes específicos
        const confirmationText = `Inscrição confirmada com sucesso! 🎉

Você receberá notificações sobre os jogos das equipes selecionadas.

Fique ligado e não perca nenhuma partida! 🏆`;
        
        addBotMessage('notification-confirmed', confirmationText);
      }
    }
    // Processar seleção do canal de notificação para ir direto para confirmação
    else if (option.nextMessageId === 'direct-notification-confirmed') {
      // Extrair o nome do canal diretamente do ID do botão
      const rawId = option.id;
      const channelId = rawId.split('-')[0] || '';
      
      // Remover log de debug
      
      // Mapeamento para nomes amigáveis de canais
      const channelMap: Record<string, string> = {
        'whatsapp': 'WhatsApp',
        'telegram': 'Telegram',
        'discord': 'Discord',
        'email': 'E-mail'
      };
      
      // Obtém o nome amigável ou usa o ID original se não for mapeado
      const channelText = channelMap[channelId] || channelId;
      setSelectedNotificationChannel(channelText);
      
      // Atualizar o estado de contactInfo com o canal selecionado
      setContactInfo(prev => ({
        ...prev,
        channel: channelText
      }));
      
      // Registrar a escolha do canal para uso posterior (sem informar contato ainda)
      const notificationInfo: LiveGamesNotification = {
        channel: channelText,
        contactInfo: null,
        teams: allTeams // Usar a lista de todos os times
      };
      
      setSavedNotification(notificationInfo);
      
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
      
      // Solicitar o contato para o canal selecionado
      addBotMessage('ask-contact-info', pendingNotificationText, {
        notificationChannel: channelText
      });
    }
    else if (option.nextMessageId === 'in-development') {
      // Para todas as opções, manter o fluxo de "em desenvolvimento"
      addBotMessage(option.nextMessageId);
    } else if (option.nextMessageId === 'go-to-settings') {
      // Redirecionar para a página de configurações
      window.location.href = '/settings';
    } else {
      // Processar outros fluxos normalmente
      addBotMessage(option.nextMessageId);
    }
  };

  // Função para lidar com a submissão de input
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || !currentInputAction) return;
    
    // Adicionar a mensagem do usuário com o input fornecido
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: `user-${Date.now()}`,
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
      
      // Remover log de debug
      
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
        // Atualizar o estado de contactInfo com o contato informado
        setContactInfo({
          channel: channelType,
          contact: inputValue
        });
        
        // Pular a seleção de times e ir direto para confirmação final
        // Salvar as informações de notificação
        const notificationInfo: LiveGamesNotification = {
          channel: channelType,
          contactInfo: inputValue,
          teams: allTeams // Usar a lista de todos os times
        };
        
        // Salvar no estado para uso posterior
        setSavedNotification(notificationInfo);
        
        // Atualizar as informações de contato de mídia no banco de dados
        if (channelType && inputValue) {
          // Verificar se o usuário já possui informações de contato registradas
          getContactInfos().then(result => {
            if (result.exists && result.data && result.data.mediaName && result.data.mediaContact) {
              // Usuário já tem informações de mídia social registradas
              const contactInfoText = BOT_RESPONSES['contact-info-exists'].text
                .replace('{mediaName}', result.data.mediaName)
                .replace('{mediaContact}', result.data.mediaContact);
              
              const contactInfoMessage = {
                ...BOT_RESPONSES['contact-info-exists'],
                id: `contact-info-exists-${Date.now()}`,
                text: contactInfoText,
                timestamp: new Date(),
                isActive: true,
                options: BOT_RESPONSES['contact-info-exists'].options?.map(opt => ({
                  ...opt,
                  id: `${opt.id}-${Date.now()}`
                }))
              };
              
              setMessages(prevMessages => [
                ...prevMessages.map(msg => ({ ...msg, isActive: false })),
                contactInfoMessage as Message
              ]);
            } else {
              // Prosseguir com a atualização
              editContactInfos(channelType, inputValue)
                .then(result => {
                  // Remover log de debug
                  
                  // Verificar se houve cooldown
                  if (result.cooldown) {
                    // Mostrar mensagem de cooldown para o usuário
                    const cooldownMessage = {
                      id: `cooldown-message-${Date.now()}`,
                      text: `${result.message} Por favor, tente novamente mais tarde.`,
                      sender: 'bot',
                      type: 'text',
                      timestamp: new Date(),
                      isActive: false
                    };
                    
                    setMessages(prevMessages => [...prevMessages, cooldownMessage as Message]);
                    return;
                  }
                })
                .catch(error => {
                  console.error('Erro ao atualizar informações de contato de mídia (input direto):', error);
                });
            }
          }).catch(error => {
            console.error('Erro ao verificar informações de contato:', error);
            // Em caso de erro, prosseguir com a atualização normal
            editContactInfos(channelType, inputValue)
              .then(result => {
                // Remover log de debug
                
                // Verificar se houve cooldown
                if (result.cooldown) {
                  // Mostrar mensagem de cooldown para o usuário
                  const cooldownMessage = {
                    id: `cooldown-message-${Date.now()}`,
                    text: `${result.message} Por favor, tente novamente mais tarde.`,
                    sender: 'bot',
                    type: 'text',
                    timestamp: new Date(),
                    isActive: false
                  };
                  
                  setMessages(prevMessages => [...prevMessages, cooldownMessage as Message]);
                  return;
                }
              })
              .catch(error => {
                console.error('Erro ao atualizar informações de contato de mídia (input direto):', error);
              });
          });
        }
        
        // Mensagem simplificada sem detalhes específicos
        const confirmationText = `Seu contato foi registrado com sucesso! ✅

Você receberá notificações sobre os jogos da FURIA conforme solicitado.

Você poderá alterar esta configuração a qualquer momento em seu perfil.`;
        
        // Adicionar mensagem de confirmação direta com o botão de confirmação
        addBotMessage('direct-notification-confirmed', confirmationText);
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
            id: `error-input-${Date.now()}`,
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

  return {
    messages,
    inputValue,
    isTyping,
    currentInputAction,
    showResetModal,
    setShowResetModal,
    displayName,
    messagesEndRef,
    handleResetConversation,
    handleOptionSelect,
    handleInputChange,
    handleInputSubmit,
    sessionUserImage
  };
}; 