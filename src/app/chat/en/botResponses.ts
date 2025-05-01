// Message types
export type MessageType = 'text' | 'options' | 'input';

// Interface for response options
export interface Option {
  id: string;
  text: string;
  nextMessageId: string;
  inputType?: boolean;
}

// Interface for messages
export interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  type: MessageType;
  options?: Option[];
  timestamp: Date;
  showInput?: boolean;
  inputLabel?: string;
  inputAction?: string;
  isActive?: boolean;
  customData?: {
    email?: string;
    showEmail?: boolean;
    cpf?: string;
    showCpf?: boolean;
    userName?: string;
    selectedTeams?: string[];  // To store selected teams
    notificationChannel?: string;  // To store the notification channel chosen
    contactInfo?: string;  // To store contact information
    inputMode?: 'text' | 'numeric' | 'tel' | 'email';  // To specify input type
  };
}

// Predefined bot responses
export const BOT_RESPONSES: Record<string, Omit<Message, 'timestamp'>> = {
  welcome: {
    id: 'welcome',
    text: 'Hello! 👋 Welcome to FURIA Connect chat! Here you can get information about our team, players, upcoming events, and much more. To continue, you need to accept our terms of use. The terms can be found at: https://terms.furia.gg',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'accept-terms',
        text: 'Accept Terms ✅',
        nextMessageId: 'ask-name'
      }
    ]
  },
  'ask-name': {
    id: 'ask-name',
    text: 'Thank you for accepting the terms! 🙏 What would you like to be called during our conversation?',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'confirm-name',
        text: 'Use my profile name 👤',
        nextMessageId: 'confirm-name'
      },
      {
        id: 'custom-name',
        text: 'Use another name ✏️',
        nextMessageId: 'custom-name-input'
      }
    ]
  },
  'custom-name-input': {
    id: 'custom-name-input',
    text: 'Enter the name you would like to be called: 📝',
    sender: 'bot',
    type: 'input',
    showInput: true,
    inputLabel: 'Your preferred name',
    inputAction: 'submit-custom-name'
  },
  'ask-email': {
    id: 'ask-email',
    text: '', // Will be dynamically defined to include the current email
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'confirm-email',
        text: 'Use my current email ✉️',
        nextMessageId: 'confirm-email'
      },
      {
        id: 'custom-email',
        text: 'Use another email 📧',
        nextMessageId: 'custom-email-input'
      }
    ]
  },
  'custom-email-input': {
    id: 'custom-email-input',
    text: 'Please enter the email you want to use: 📧',
    sender: 'bot',
    type: 'input',
    showInput: true,
    inputLabel: 'Your email',
    inputAction: 'submit-custom-email'
  },
  'ask-cpf': {
    id: 'ask-cpf',
    text: 'Would you like to provide your CPF (Brazilian ID)? 🆔 By providing your CPF, you can earn rewards and prestige in the community. 🏆 It will be used exclusively for promotions within FURIA products.',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'accept-cpf',
        text: 'Yes, I want to provide my CPF ✅',
        nextMessageId: 'input-cpf'
      },
      {
        id: 'decline-cpf',
        text: 'No, thank you ❌',
        nextMessageId: 'cpf-declined'
      }
    ]
  },
  'input-cpf': {
    id: 'input-cpf',
    text: 'Please enter your CPF (numbers only): 🔢',
    sender: 'bot',
    type: 'input',
    showInput: true,
    inputLabel: 'Your CPF (numbers only)',
    inputAction: 'submit-cpf'
  },
  'cpf-confirmed': {
    id: 'cpf-confirmed',
    text: 'CPF successfully registered! ✅ Thank you for sharing this information with us. You can change this at any time in your profile.',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'thanks-after-cpf',
        text: 'Thank you 😊',
        nextMessageId: 'show-profile-summary'
      }
    ]
  },
  'cpf-declined': {
    id: 'cpf-declined',
    text: 'No problem! 👍 We have registered as "CPF not provided". You can change this at any time in your profile.',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'thanks-after-cpf',
        text: 'Thank you 😊',
        nextMessageId: 'show-profile-summary'
      }
    ]
  },
  'show-profile-summary': {
    id: 'show-profile-summary',
    text: 'Here is a summary of your registered information: 📋 \n\nThis information can be viewed and edited at any time in your profile settings.',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'continue-to-menu',
        text: 'Confirm ✅',
        nextMessageId: 'menu-after-cpf'
      }
    ]
  },
  'menu-after-cpf': {
    id: 'menu-after-cpf',
    text: 'How can I help you today? 😃',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'live-games',
        text: 'Watch live games 📺',
        nextMessageId: 'live-games-notification-channel'
      },
      {
        id: 'clip-championship',
        text: 'Clip Championship 🎬',
        nextMessageId: 'in-development'
      },
      {
        id: 'games-calendar',
        text: 'Games Calendar 📅',
        nextMessageId: 'in-development'
      },
      {
        id: 'panther-shop',
        text: 'Panther Shop 🛒',
        nextMessageId: 'in-development'
      },
      {
        id: 'esports-news',
        text: 'Esports News / Trend Topics 📰',
        nextMessageId: 'in-development'
      },
      {
        id: 'content-creators',
        text: 'Content Creators and Streamers 🎥',
        nextMessageId: 'in-development'
      },
      {
        id: 'furia-cash',
        text: 'Furia Cash 💰',
        nextMessageId: 'in-development'
      },
      {
        id: 'support',
        text: 'Visit the central 🌐',
        nextMessageId: 'visit-support-center'
      }
    ]
  },
  'in-development': {
    id: 'in-development',
    text: 'This feature is under development! 🚧 Soon you will be able to access this area. Stay tuned for updates! ✨',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'understand',
        text: 'Understood, I will wait 👍',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  'visit-support-center': {
    id: 'visit-support-center',
    text: 'The FURIA Central brings together all the information about the organization, our teams, events, and much more. Visit to stay up-to-date with all the latest news! 🏆',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'go-to-central',
        text: '🌐 Visit FURIA Central',
        nextMessageId: 'external-central-link'
      },
      {
        id: 'return-to-main',
        text: '↩️ Return to main menu',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  'external-central-link': {
    id: 'external-central-link',
    text: 'Redirecting to FURIA Central...',
    sender: 'bot',
    type: 'text',
    isActive: false
  },
  'return-to-new-main': {
    id: 'return-to-new-main',
    text: 'What would you like to do now?',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'live-games',
        text: 'Watch live games 📺',
        nextMessageId: 'live-games-notification-channel'
      },
      {
        id: 'clipper-championship',
        text: 'Clip Championship 🎬',
        nextMessageId: 'in-development'
      },
      {
        id: 'games-calendar',
        text: 'Games Calendar 📅',
        nextMessageId: 'in-development'
      },
      {
        id: 'panther-shop',
        text: 'Panther Shop 🛒',
        nextMessageId: 'in-development'
      },
      {
        id: 'esports-news',
        text: 'Esports News / Trend Topics 📰',
        nextMessageId: 'in-development'
      },
      {
        id: 'content-creators',
        text: 'Content Creators and Streamers 🎥',
        nextMessageId: 'in-development'
      },
      {
        id: 'furia-cash',
        text: 'Furia Cash 💰',
        nextMessageId: 'in-development'
      },
      {
        id: 'support',
        text: 'Visit the central 🌐',
        nextMessageId: 'visit-support-center'
      }
    ]
  },
  'return-to-main': {
    id: 'return-to-main',
    text: 'What else would you like to see? 💭',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'live-games',
        text: 'Watch live games 📺',
        nextMessageId: 'in-development'
      },
      {
        id: 'clip-championship',
        text: 'Clip Championship 🎬',
        nextMessageId: 'in-development'
      },
      {
        id: 'games-calendar',
        text: 'Games Calendar 📅',
        nextMessageId: 'in-development'
      },
      {
        id: 'panther-shop',
        text: 'Panther Shop 🛒',
        nextMessageId: 'in-development'
      },
      {
        id: 'esports-news',
        text: 'Esports News / Trend Topics 📰',
        nextMessageId: 'in-development'
      },
      {
        id: 'content-creators',
        text: 'Content Creators and Streamers 🎥',
        nextMessageId: 'in-development'
      },
      {
        id: 'furia-cash',
        text: 'Furia Cash 💰',
        nextMessageId: 'in-development'
      },
      {
        id: 'support',
        text: 'Visit the central 🌐',
        nextMessageId: 'visit-support-center'
      }
    ]
  },
  // New messages for the live games follow-up flow
  'live-games-notification-channel': {
    id: 'live-games-notification-channel',
    text: 'By which channel would you like to receive notifications about live games?',
    sender: 'bot',
    type: 'options',
    options: [
      { id: 'whatsapp', text: 'WhatsApp 📱', nextMessageId: 'ask-contact-info' },
      { id: 'telegram', text: 'Telegram 📨', nextMessageId: 'ask-contact-info' },
      { id: 'discord', text: 'Discord 🎮', nextMessageId: 'ask-contact-info' },
      { id: 'email', text: 'E-mail 📧', nextMessageId: 'ask-contact-info' },
      { id: 'return-to-main', text: '↩️ Return to main menu', nextMessageId: 'return-to-new-main' }
    ]
  },
  'direct-notification-confirmed': {
    id: 'direct-notification-confirmed',
    text: 'You will receive notifications about FURIA games on the chosen channel. We will notify you about all important games. 🎮🏆',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'thanks-notification',
        text: 'Confirm and Continue ✅',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  'live-games-contact-info': {
    id: 'live-games-contact-info',
    text: 'Enter your {{notificationChannel}} to receive notifications:',
    sender: 'bot',
    type: 'input',
    showInput: true,
    inputLabel: 'Your contact here',
    customData: { notificationChannel: '' }
  },
  'live-games-select-teams': {
    id: 'live-games-select-teams',
    text: 'Select the teams you want to follow live games:',
    sender: 'bot',
    type: 'options',
    options: [
      { id: 'flamengo', text: 'Flamengo', nextMessageId: '' },
      { id: 'corinthians', text: 'Corinthians', nextMessageId: '' },
      { id: 'palmeiras', text: 'Palmeiras', nextMessageId: '' },
      { id: 'santos', text: 'Santos', nextMessageId: '' },
      { id: 'sao-paulo', text: 'São Paulo', nextMessageId: '' },
      { id: 'fluminense', text: 'Fluminense', nextMessageId: '' },
      { id: 'vasco', text: 'Vasco', nextMessageId: '' },
      { id: 'botafogo', text: 'Botafogo', nextMessageId: '' },
      { id: 'gremio', text: 'Grêmio', nextMessageId: '' },
      { id: 'internacional', text: 'Internacional', nextMessageId: '' },
      { id: 'cruzeiro', text: 'Cruzeiro', nextMessageId: '' },
      { id: 'atletico-mg', text: 'Atlético-MG', nextMessageId: '' },
      { id: 'confirm-teams', text: '✅ Confirm selection', nextMessageId: '' },
      { id: 'return-to-main', text: '↩️ Return to main menu', nextMessageId: 'return-to-new-main' }
    ],
    customData: { selectedTeams: [] }
  },
  'live-games-confirmation': {
    id: 'live-games-confirmation',
    text: 'You selected the following teams: {{teams}}. Confirm receiving notifications via {{notificationChannel}} at {{contactInfo}}?',
    sender: 'bot',
    type: 'options',
    options: [
      { id: 'confirm-subscription', text: '✅ Confirm subscription', nextMessageId: '' },
      { id: 'cancel-subscription', text: '❌ Cancel', nextMessageId: '' }
    ],
    customData: { 
      selectedTeams: [],
      notificationChannel: '',
      contactInfo: ''
    }
  },
  'live-games-success': {
    id: 'live-games-success',
    text: 'Subscription confirmed successfully! You will receive notifications about the selected live games.',
    sender: 'bot',
    type: 'options',
    options: [
      { id: 'return-to-main', text: '↩️ Return to main menu', nextMessageId: 'return-to-new-main' }
    ]
  },
  'ask-contact-info': {
    id: 'ask-contact-info',
    text: '', // Will be dynamically filled based on the chosen channel
    sender: 'bot',
    type: 'input',
    showInput: true,
    inputLabel: 'Enter your contact',
    inputAction: 'submit-contact-info'
  },
  'select-teams': {
    id: 'select-teams',
    text: 'Which FURIA teams would you like to follow? ⚔️\nSelect using the switches and confirm when done:',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'cs-team',
        text: 'CS:GO 🔫',
        nextMessageId: 'team-selection-toggle'
      },
      {
        id: 'valorant-team',
        text: 'VALORANT 🎯',
        nextMessageId: 'team-selection-toggle'
      },
      {
        id: 'r6-team',
        text: 'RAINBOW SIX 🛡️',
        nextMessageId: 'team-selection-toggle'
      },
      {
        id: 'rocket-team',
        text: 'ROCKET LEAGUE 🚗',
        nextMessageId: 'team-selection-toggle'
      },
      {
        id: 'kings-team',
        text: 'KINGS LEAGUE ⚽',
        nextMessageId: 'team-selection-toggle'
      },
      {
        id: 'lol-team',
        text: 'LEAGUE OF LEGENDS 🧙‍♂️',
        nextMessageId: 'team-selection-toggle'
      },
      {
        id: 'confirm-teams',
        text: 'Confirm selection ✅',
        nextMessageId: 'notification-confirmed'
      }
    ],
    customData: { selectedTeams: [] }
  },
  'team-selected': {
    id: 'team-selected',
    text: '', // Will be dynamically filled
    sender: 'bot',
    type: 'options',
    options: [] // Will be dynamically filled with the same options as select-teams
  },
  'notification-confirmed': {
    id: 'notification-confirmed',
    text: 'Subscription confirmed successfully! 🎉 You will receive notifications about the selected FURIA teams. Stay tuned and don\'t miss any game! 🏆',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'thanks-notification',
        text: 'Uhuuu, thank you! 🙌',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  'contact-info-exists': {
    id: 'contact-info-exists',
    text: 'You already have contact information registered ({mediaName}: {mediaContact}). You can change it in your profile settings.',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'go-to-settings',
        text: '⚙️ Go to Settings',
        nextMessageId: 'go-to-settings'
      },
      {
        id: 'return-to-main',
        text: '🔙 Return to Main Menu',
        nextMessageId: 'menu-after-cpf'
      }
    ]
  },
  'go-to-settings': {
    id: 'go-to-settings',
    text: 'Redirecting to settings page...',
    sender: 'bot',
    type: 'text',
    isActive: false
  }
}; 