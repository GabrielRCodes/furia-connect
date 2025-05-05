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
        nextMessageId: 'clip-championship-info'
      },
      {
        id: 'games-calendar',
        text: 'Games Calendar 📅',
        nextMessageId: 'games-calendar-info'
      },
      {
        id: 'panther-shop',
        text: 'Panther Shop 🛒',
        nextMessageId: 'panther-shop-external'
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
  'panther-shop-external': {
    id: 'panther-shop-external',
    text: 'Redirecting to FURIA shop...',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'return-to-main',
        text: 'Back to main menu ↩️',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  'in-development': {
    id: 'in-development',
    text: 'Feature under development... 🚧\nThis area is still being built. Soon you will be able to enjoy new features here!',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'return-to-main',
        text: '↩️ Back to main menu',
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
    type: 'options',
    options: [
      {
        id: 'return-to-support',
        text: 'Back to support center 🌐',
        nextMessageId: 'visit-support-center'
      },
      {
        id: 'return-to-main',
        text: 'Back to main menu ↩️',
        nextMessageId: 'return-to-new-main'
      }
    ]
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
        id: 'clip-championship',
        text: 'Clip Championship 🎬',
        nextMessageId: 'clip-championship-info'
      },
      {
        id: 'games-calendar',
        text: 'Games Calendar 📅',
        nextMessageId: 'games-calendar-info'
      },
      {
        id: 'panther-shop',
        text: 'Panther Shop 🛒',
        nextMessageId: 'panther-shop-external'
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
        nextMessageId: 'clip-championship-info'
      },
      {
        id: 'games-calendar',
        text: 'Games Calendar 📅',
        nextMessageId: 'games-calendar-info'
      },
      {
        id: 'panther-shop',
        text: 'Panther Shop 🛒',
        nextMessageId: 'panther-shop-external'
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
    type: 'options',
    options: [
      {
        id: 'return-to-main',
        text: 'Back to main menu ↩️',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  // New message for Clip Championship
  'clip-championship-info': {
    id: 'clip-championship-info',
    text: '🚨#FURIAClips - Season 1 is on! 🎬🔥\nR$20,000 in prizes for the best clips! 💰\n\nCreate content, post on social media with the required hashtags (see rules) and participate in the competition made for everyone who loves FURIA!',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'clip-championship-rules',
        text: 'View rules 📋',
        nextMessageId: 'clip-championship-rules-info'
      },
      {
        id: 'clip-championship-register',
        text: 'Register clips 📤',
        nextMessageId: 'clip-championship-register-input'
      },
      {
        id: 'clip-championship-my-clips',
        text: 'View my clips 🎞️',
        nextMessageId: 'clip-championship-my-clips-list'
      },
      {
        id: 'clip-championship-enable-notifications',
        text: 'Enable notifications 🔔',
        nextMessageId: 'clip-championship-enable-notifications-confirm'
      },
      {
        id: 'clip-championship-disable-notifications',
        text: 'Disable notifications 🔕',
        nextMessageId: 'clip-championship-disable-notifications-confirm'
      },
      {
        id: 'return-to-main',
        text: 'Back to main menu ↩️',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  // New message to display the rules link
  'clip-championship-rules-info': {
    id: 'clip-championship-rules-info',
    text: 'You can access the complete rules for the clip championship through the link below:',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'go-to-rules',
        text: 'Access rules 🔗',
        nextMessageId: 'clip-championship-rules-external'
      },
      {
        id: 'back-to-clip-championship',
        text: 'Back to clip championship menu 🎬',
        nextMessageId: 'clip-championship-info'
      }
    ]
  },
  'clip-championship-rules-external': {
    id: 'clip-championship-rules-external',
    text: 'Redirecting to championship rules...',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'back-to-clip-championship',
        text: 'Back to clip championship menu 🎬',
        nextMessageId: 'clip-championship-info'
      },
      {
        id: 'return-to-main',
        text: 'Back to main menu ↩️',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  // New messages for clips flow
  'clip-championship-register-input': {
    id: 'clip-championship-register-input',
    text: 'Please paste your clip link below. Remember that the link must be from a clip published on social media with the required hashtags:',
    sender: 'bot',
    type: 'input',
    showInput: true,
    inputLabel: 'Your clip link',
    inputAction: 'submit-clip-link'
  },
  'clip-championship-register-success': {
    id: 'clip-championship-register-success',
    text: 'Your clip has been successfully registered! Our team will review and approve it soon. ✅\n\nYou can send another clip in 10 minutes.',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'back-to-clip-championship',
        text: 'Back to clip championship menu 🎬',
        nextMessageId: 'clip-championship-info'
      }
    ]
  },
  'clip-championship-register-cooldown': {
    id: 'clip-championship-register-cooldown',
    text: 'You need to wait 10 minutes between submitting each clip. Please try again later!',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'back-to-clip-championship',
        text: 'Back to clip championship menu 🎬',
        nextMessageId: 'clip-championship-info'
      }
    ]
  },
  'clip-championship-my-clips-list': {
    id: 'clip-championship-my-clips-list',
    text: 'Here are your registered clips:',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'back-to-clip-championship',
        text: 'Back to clip championship menu 🎬',
        nextMessageId: 'clip-championship-info'
      }
    ]
  },
  'clip-championship-no-clips': {
    id: 'clip-championship-no-clips',
    text: 'You haven\'t registered any clips yet. Participate now by submitting your best moments!',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'clip-championship-register',
        text: 'Register clips 📤',
        nextMessageId: 'clip-championship-register-input'
      },
      {
        id: 'back-to-clip-championship',
        text: 'Back to clip championship menu 🎬',
        nextMessageId: 'clip-championship-info'
      }
    ]
  },
  // New messages for enabling/disabling clip championship notifications
  'clip-championship-enable-notifications-confirm': {
    id: 'clip-championship-enable-notifications-confirm',
    text: 'Clip championship notifications have been successfully enabled! 🔔\n\nYou will receive alerts about news, deadlines, and updates for the championship.',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'back-to-clip-championship',
        text: 'Back to clip championship menu 🎬',
        nextMessageId: 'clip-championship-info'
      }
    ]
  },
  'clip-championship-disable-notifications-confirm': {
    id: 'clip-championship-disable-notifications-confirm',
    text: 'Clip championship notifications have been disabled. 🔕\n\nYou will no longer receive alerts about news, deadlines, and updates for the championship.',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'back-to-clip-championship',
        text: 'Back to clip championship menu 🎬',
        nextMessageId: 'clip-championship-info'
      }
    ]
  },
  // New messages for games calendar
  'games-calendar-info': {
    id: 'games-calendar-info',
    text: 'Here are the upcoming events FURIA will participate in! \n\nCALENDAR - 05/05/2025 to 11/05/2025',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'game-kings-league-05-05',
        text: '05/05 - 5:00 PM - [FURIA FC] Kings League vs Fluxo FC',
        nextMessageId: 'game-redirect-twitch'
      },
      {
        id: 'game-cs-pgl-10-05',
        text: '10/05 - 5:00 AM - [CS International] PGL Astana 2025 FURIA vs The MongolZ',
        nextMessageId: 'game-redirect-twitch'
      },
      {
        id: 'game-r6-reload-10-05',
        text: '10/05 - 12:00 PM - [R6] RE:LO:AD - FURIA vs Elevate - BO1 - Round 1 - Group Stage',
        nextMessageId: 'game-redirect-twitch'
      },
      {
        id: 'game-lol-11-05',
        text: '11/05 - 12:00 PM - [FURIA LOL] FURIA X FLUXO/W7M - Group Stage 2nd Split',
        nextMessageId: 'game-redirect-twitch'
      },
      {
        id: 'return-to-main',
        text: 'Back to main menu ↩️',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  'game-redirect-twitch': {
    id: 'game-redirect-twitch',
    text: 'Redirecting to FURIA\'s Twitch channel...',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'back-to-calendar',
        text: 'Back to games calendar 📅',
        nextMessageId: 'games-calendar-info'
      },
      {
        id: 'return-to-main',
        text: 'Back to main menu ↩️',
        nextMessageId: 'return-to-new-main'
      }
    ]
  }
}; 