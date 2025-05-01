import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Message, SavedUserInfo, LiveGamesNotification } from '../../types';
import { BOT_RESPONSES } from '../botResponses';
import { getContactInfos } from '../../hooks/getContactInfos';
import { formatTime, generateUniqueId } from '@/app/chat/utils/formatter';

// Static welcome message - without dynamic elements like new Date()
const WELCOME_MESSAGE: Omit<Message, 'timestamp'> = {
  id: 'welcome-static',
  text: 'Hello! 👋 Welcome to FURIA Connect chat! Here you can get information about our team, players, upcoming events, and much more. To continue, you need to accept our terms of use. The terms can be found at: https://terms.furia.gg',
  sender: 'bot',
  type: 'options',
  options: [
    {
      id: 'accept-terms',
      text: 'Accept Terms ✅',
      nextMessageId: 'ask-name'
    }
  ],
  isActive: true
};

// Initial menu message
const MENU_MESSAGE: Omit<Message, 'timestamp'> = {
  ...BOT_RESPONSES['menu-after-cpf'],
  isActive: true
};

export const useChat = () => {
  const { data: session, status } = useSession();
  // Initial state with loading
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(true); // Start with typing state
  const [currentInputAction, setCurrentInputAction] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [displayName, setDisplayName] = useState(session?.user?.name || 'Visitor');
  const [displayEmail, setDisplayEmail] = useState(session?.user?.email || '');
  const [customCpf, setCustomCpf] = useState('');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [savedUserInfo, setSavedUserInfo] = useState<SavedUserInfo | null>(null);
  const [savedNotification, setSavedNotification] = useState<LiveGamesNotification | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check if the user already has a registration when loading
  useEffect(() => {
    if (status === 'loading') {
      return; // Wait for the session to be loaded
    }
    
    if (session?.user && !isInitialized) {
      checkExistingUser();
    } else if (status === 'unauthenticated' && !isInitialized) {
      // If there is no session, show the normal welcome message
      setIsTyping(false);
      setMessages([{
        ...WELCOME_MESSAGE,
        timestamp: new Date()
      }]);
      setIsInitialized(true);
    }
  }, [session, status]);
  
  // Function to check if the user already has a registration
  const checkExistingUser = async () => {
    try {
      setIsTyping(true);
      
      const result = await getContactInfos();
      
      if (result.exists && result.data) {
        // User already has registration, go directly to menu
        setDisplayName(result.data.name || session?.user?.name || 'Visitor');
        setDisplayEmail(result.data.email || session?.user?.email || '');
        if (result.data.cpf) {
          setCustomCpf(result.data.cpf);
        }
        
        // Set saved information
        setSavedUserInfo({
          name: result.data.name || session?.user?.name || 'Visitor',
          email: result.data.email || session?.user?.email || '',
          cpf: result.data.cpf || 'Not provided',
          timestamp: new Date()
        });
        
        // Show welcome back message
        setTimeout(() => {
          setIsTyping(false);
          setMessages([{
            ...MENU_MESSAGE,
            id: `menu-${Date.now()}`,
            timestamp: new Date()
          }]);
        }, 1000);
      } else {
        // User does not have registration, show normal flow
        setIsTyping(false);
        setMessages([{
          ...WELCOME_MESSAGE,
          timestamp: new Date()
        }]);
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error("Error checking user:", error);
      // In case of error, show the normal welcome message
      setIsTyping(false);
      setMessages([{
        ...WELCOME_MESSAGE,
        timestamp: new Date()
      }]);
      setIsInitialized(true);
    }
  };
  
  // Function to add bot message (original implementation)
  const addBotMessage = (messageId: string, customText?: string, customData?: Message['customData']) => {
    const botResponse = BOT_RESPONSES[messageId];
    
    if (botResponse) {
      // Show typing indicator
      setIsTyping(true);
      
      // Deactivate all previous messages
      setMessages(prevMessages => 
        prevMessages.map(msg => ({
          ...msg,
          isActive: false
        }))
      );
      
      // Small delay to simulate bot typing
      setTimeout(() => {
        setIsTyping(false);
        
        // Create copy of message to ensure options have unique IDs
        const messageWithUniqueOptions = {
          ...botResponse,
          options: botResponse.options ? botResponse.options.map(opt => ({
            ...opt,
            id: generateUniqueId(opt.id)
          })) : undefined,
          isActive: true,  // Set the new message as active
          customData: customData // Add custom data, if provided
        };
        
        // Replace text if a custom one was provided
        if (customText) {
          messageWithUniqueOptions.text = customText;
        }
        
        // If it's an input message, configure the current action
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
      }, 1000); // 1 second delay to appear more natural
    }
  };
  
  // Restart conversation
  const handleResetConversation = () => {
    // Clear all messages and reset state
    setIsTyping(true);
    
    // Check if the user has registration again
    if (session?.user) {
      checkExistingUser();
    } else {
      setMessages([{
        ...WELCOME_MESSAGE,
        timestamp: new Date() // New timestamp for the restarted message
      }]);
      setIsTyping(false);
    }
    
    setInputValue('');
    setCurrentInputAction(null);
    setShowResetModal(false);
  };
  
  // Scroll to the last message when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
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