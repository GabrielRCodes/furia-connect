// Tipos de mensagens
export type MessageType = 'text' | 'options' | 'input';

// Interface para as opções de resposta
export interface Option {
  id: string;
  text: string;
  nextMessageId: string;
  inputType?: boolean;
}

// Interface para as mensagens
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
    selectedTeams?: string[];  // Para armazenar as equipes selecionadas
    notificationChannel?: string;  // Para armazenar o canal de notificação escolhido
    contactInfo?: string;  // Para armazenar a informação de contato
    inputMode?: 'text' | 'numeric' | 'tel' | 'email';  // Para especificar o tipo de entrada
  };
}

// Respostas predefinidas do bot
export const BOT_RESPONSES: Record<string, Omit<Message, 'timestamp'>> = {
  welcome: {
    id: 'welcome',
    text: 'Olá! 👋 Boas-vindas ao chat da FURIA Connect! Aqui você pode obter informações sobre nosso time, jogadores, próximos eventos e muito mais. Para continuar, você precisa aceitar nossos termos de uso. Os termos podem ser encontrados em: https://terms.furia.gg',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'accept-terms',
        text: 'Aceitar Termos ✅',
        nextMessageId: 'ask-name'
      }
    ]
  },
  'ask-name': {
    id: 'ask-name',
    text: 'Agradecemos por aceitar os termos! 🙏 Como você gostaria de ser chamado(a) durante nossa conversa?',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'confirm-name',
        text: 'Usar meu nome de perfil 👤',
        nextMessageId: 'confirm-name'
      },
      {
        id: 'custom-name',
        text: 'Usar outro nome ✏️',
        nextMessageId: 'custom-name-input'
      }
    ]
  },
  'custom-name-input': {
    id: 'custom-name-input',
    text: 'Digite o nome pelo qual você gostaria de ser chamado(a): 📝',
    sender: 'bot',
    type: 'input',
    showInput: true,
    inputLabel: 'Seu nome preferido',
    inputAction: 'submit-custom-name'
  },
  'ask-email': {
    id: 'ask-email',
    text: '', // Será definido dinamicamente para incluir o e-mail atual
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'confirm-email',
        text: 'Usar meu e-mail atual ✉️',
        nextMessageId: 'confirm-email'
      },
      {
        id: 'custom-email',
        text: 'Usar outro e-mail 📧',
        nextMessageId: 'custom-email-input'
      }
    ]
  },
  'custom-email-input': {
    id: 'custom-email-input',
    text: 'Por favor, digite o e-mail que você deseja utilizar: 📧',
    sender: 'bot',
    type: 'input',
    showInput: true,
    inputLabel: 'Seu e-mail',
    inputAction: 'submit-custom-email'
  },
  'ask-cpf': {
    id: 'ask-cpf',
    text: 'Deseja informar seu CPF? 🆔 Ao fornecer seu CPF, você poderá ganhar recompensas e prestígio na comunidade. 🏆 O uso é exclusivo para promoções dentro dos produtos da FURIA.',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'accept-cpf',
        text: 'Sim, quero informar meu CPF ✅',
        nextMessageId: 'input-cpf'
      },
      {
        id: 'decline-cpf',
        text: 'Não, obrigado ❌',
        nextMessageId: 'cpf-declined'
      }
    ]
  },
  'input-cpf': {
    id: 'input-cpf',
    text: 'Por favor, digite seu CPF (apenas números): 🔢',
    sender: 'bot',
    type: 'input',
    showInput: true,
    inputLabel: 'Seu CPF (apenas números)',
    inputAction: 'submit-cpf'
  },
  'cpf-confirmed': {
    id: 'cpf-confirmed',
    text: 'CPF registrado com sucesso! ✅ Obrigado por compartilhar essa informação conosco. Você pode alterar isso a qualquer momento em seu perfil.',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'thanks-after-cpf',
        text: 'Obrigado 😊',
        nextMessageId: 'show-profile-summary'
      }
    ]
  },
  'cpf-declined': {
    id: 'cpf-declined',
    text: 'Sem problemas! 👍 Registramos como "CPF não informado". Você pode alterar isso a qualquer momento em seu perfil.',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'thanks-after-cpf',
        text: 'Obrigado 😊',
        nextMessageId: 'show-profile-summary'
      }
    ]
  },
  'show-profile-summary': {
    id: 'show-profile-summary',
    text: 'Aqui está o resumo das suas informações registradas: 📋 \n\nEssas informações podem ser visualizadas e editadas a qualquer momento nas configurações do seu perfil.',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'continue-to-menu',
        text: 'Confirmar ✅',
        nextMessageId: 'menu-after-cpf'
      }
    ]
  },
  'menu-after-cpf': {
    id: 'menu-after-cpf',
    text: 'Como posso ajudar você hoje? 😃',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'live-games',
        text: 'Acompanhe jogos ao vivo 📺',
        nextMessageId: 'live-games-notification-channel'
      },
      {
        id: 'clip-championship',
        text: 'Campeonato de clipadores 🎬',
        nextMessageId: 'clip-championship-info'
      },
      {
        id: 'games-calendar',
        text: 'Calendário de jogos 📅',
        nextMessageId: 'games-calendar-info'
      },
      {
        id: 'panther-shop',
        text: 'Lojinha da pantera 🛒',
        nextMessageId: 'panther-shop-external'
      },
      {
        id: 'esports-news',
        text: 'Esports News / Trend Topics 📰',
        nextMessageId: 'in-development'
      },
      {
        id: 'content-creators',
        text: 'Criadores de Conteúdo e Streamers 🎥',
        nextMessageId: 'in-development'
      },
      {
        id: 'furia-cash',
        text: 'Furia Cash 💰',
        nextMessageId: 'in-development'
      },
      {
        id: 'support',
        text: 'Visitar a central 🌐',
        nextMessageId: 'visit-support-center'
      }
    ]
  },
  'panther-shop-external': {
    id: 'panther-shop-external',
    text: 'Redirecionando para a loja da FURIA...',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'return-to-main',
        text: 'Voltar para o menu principal ↩️',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  'in-development': {
    id: 'in-development',
    text: 'Funcionalidade em desenvolvimento... 🚧\nEsta área ainda está sendo construída. Em breve você poderá desfrutar de novos recursos aqui!',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'return-to-main',
        text: '↩️ Voltar ao menu principal',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  'visit-support-center': {
    id: 'visit-support-center',
    text: 'A Central FURIA reúne todas as informações sobre a organização, nossos times, eventos e muito mais. Visite para ficar por dentro de todas as novidades! 🏆',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'go-to-central',
        text: '🌐 Visitar a Central FURIA',
        nextMessageId: 'external-central-link'
      },
      {
        id: 'return-to-main',
        text: '↩️ Voltar ao menu principal',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  'external-central-link': {
    id: 'external-central-link',
    text: 'Redirecionando para a Central FURIA...',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'return-to-support',
        text: 'Voltar para a central de suporte 🌐',
        nextMessageId: 'visit-support-center'
      },
      {
        id: 'return-to-main',
        text: 'Voltar para o menu principal ↩️',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  'return-to-new-main': {
    id: 'return-to-new-main',
    text: 'O que você gostaria de fazer agora?',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'live-games',
        text: 'Acompanhe jogos ao vivo 📺',
        nextMessageId: 'live-games-notification-channel'
      },
      {
        id: 'clipper-championship',
        text: 'Campeonato de clipadores 🎬',
        nextMessageId: 'clip-championship-info'
      },
      {
        id: 'games-calendar',
        text: 'Calendário de jogos 📅',
        nextMessageId: 'games-calendar-info'
      },
      {
        id: 'panther-shop',
        text: 'Lojinha da pantera 🛒',
        nextMessageId: 'panther-shop-external'
      },
      {
        id: 'esports-news',
        text: 'Esports News / Trend Topics 📰',
        nextMessageId: 'in-development'
      },
      {
        id: 'content-creators',
        text: 'Criadores de Conteúdo e Streamers 🎥',
        nextMessageId: 'in-development'
      },
      {
        id: 'furia-cash',
        text: 'Furia Cash 💰',
        nextMessageId: 'in-development'
      },
      {
        id: 'support',
        text: 'Visitar a central 🌐',
        nextMessageId: 'visit-support-center'
      }
    ]
  },
  'return-to-main': {
    id: 'return-to-main',
    text: 'O que mais você gostaria de ver? 💭',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'live-games',
        text: 'Acompanhe jogos ao vivo 📺',
        nextMessageId: 'in-development'
      },
      {
        id: 'clip-championship',
        text: 'Campeonato de clipadores 🎬',
        nextMessageId: 'in-development'
      },
      {
        id: 'games-calendar',
        text: 'Calendário de jogos 📅',
        nextMessageId: 'games-calendar-info'
      },
      {
        id: 'panther-shop',
        text: 'Lojinha da pantera 🛒',
        nextMessageId: 'panther-shop-external'
      },
      {
        id: 'esports-news',
        text: 'Esports News / Trend Topics 📰',
        nextMessageId: 'in-development'
      },
      {
        id: 'content-creators',
        text: 'Criadores de Conteúdo e Streamers 🎥',
        nextMessageId: 'in-development'
      },
      {
        id: 'furia-cash',
        text: 'Furia Cash 💰',
        nextMessageId: 'in-development'
      },
      {
        id: 'support',
        text: 'Visitar a central 🌐',
        nextMessageId: 'visit-support-center'
      }
    ]
  },
  // Novas mensagens para o fluxo de Acompanhe jogos ao vivo
  'live-games-notification-channel': {
    id: 'live-games-notification-channel',
    text: 'Por qual canal você gostaria de receber notificações sobre jogos ao vivo?',
    sender: 'bot',
    type: 'options',
    options: [
      { id: 'whatsapp', text: 'WhatsApp 📱', nextMessageId: 'ask-contact-info' },
      { id: 'telegram', text: 'Telegram 📨', nextMessageId: 'ask-contact-info' },
      { id: 'discord', text: 'Discord 🎮', nextMessageId: 'ask-contact-info' },
      { id: 'email', text: 'E-mail 📧', nextMessageId: 'ask-contact-info' },
      { id: 'return-to-main', text: '↩️ Voltar ao menu principal', nextMessageId: 'return-to-new-main' }
    ]
  },
  'direct-notification-confirmed': {
    id: 'direct-notification-confirmed',
    text: 'Você receberá notificações sobre os jogos da FURIA no canal escolhido. Notificaremos sobre todos os jogos importantes. 🎮🏆',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'thanks-notification',
        text: 'Confirmar e Continuar ✅',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  'live-games-contact-info': {
    id: 'live-games-contact-info',
    text: 'Digite seu {{notificationChannel}} para receber as notificações:',
    sender: 'bot',
    type: 'input',
    showInput: true,
    inputLabel: 'Seu contato aqui',
    customData: { notificationChannel: '' }
  },
  'live-games-select-teams': {
    id: 'live-games-select-teams',
    text: 'Selecione os times que você deseja acompanhar os jogos ao vivo:',
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
      { id: 'confirm-teams', text: '✅ Confirmar seleção', nextMessageId: '' },
      { id: 'return-to-main', text: '↩️ Voltar ao menu principal', nextMessageId: 'return-to-new-main' }
    ],
    customData: { selectedTeams: [] }
  },
  'live-games-confirmation': {
    id: 'live-games-confirmation',
    text: 'Você selecionou os seguintes times: {{teams}}. Confirma receber notificações via {{notificationChannel}} no contato {{contactInfo}}?',
    sender: 'bot',
    type: 'options',
    options: [
      { id: 'confirm-subscription', text: '✅ Confirmar inscrição', nextMessageId: '' },
      { id: 'cancel-subscription', text: '❌ Cancelar', nextMessageId: '' }
    ],
    customData: { 
      selectedTeams: [],
      notificationChannel: '',
      contactInfo: ''
    }
  },
  'live-games-success': {
    id: 'live-games-success',
    text: 'Inscrição confirmada com sucesso! Você receberá notificações sobre os jogos ao vivo dos times selecionados.',
    sender: 'bot',
    type: 'options',
    options: [
      { id: 'return-to-main', text: '↩️ Voltar ao menu principal', nextMessageId: 'return-to-new-main' }
    ]
  },
  'ask-contact-info': {
    id: 'ask-contact-info',
    text: '', // Será preenchido dinamicamente baseado no canal escolhido
    sender: 'bot',
    type: 'input',
    showInput: true,
    inputLabel: 'Digite seu contato',
    inputAction: 'submit-contact-info'
  },
  'select-teams': {
    id: 'select-teams',
    text: 'Quais equipes da FURIA você gostaria de acompanhar? ⚔️\nSelecione usando os switches e confirme quando terminar:',
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
        text: 'Confirmar seleção ✅',
        nextMessageId: 'notification-confirmed'
      }
    ],
    customData: { selectedTeams: [] }
  },
  'team-selected': {
    id: 'team-selected',
    text: '', // Será preenchido dinamicamente
    sender: 'bot',
    type: 'options',
    options: [] // Será preenchido dinamicamente com as mesmas opções de select-teams
  },
  'notification-confirmed': {
    id: 'notification-confirmed',
    text: 'Inscrição confirmada com sucesso! 🎉 Você receberá notificações sobre os jogos das equipes selecionadas da FURIA. Fique ligado e não perca nenhuma partida! 🏆',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'thanks-notification',
        text: 'Uhuuu, obrigado(a)! 🙌',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  'contact-info-exists': {
    id: 'contact-info-exists',
    text: 'Você já possui informações de contato registradas ({mediaName}: {mediaContact}). Você pode alterá-las nas configurações do seu perfil.',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'go-to-settings',
        text: '⚙️ Ir para Configurações',
        nextMessageId: 'go-to-settings'
      },
      {
        id: 'return-to-main',
        text: '🔙 Voltar ao Menu Principal',
        nextMessageId: 'menu-after-cpf'
      }
    ]
  },
  'go-to-settings': {
    id: 'go-to-settings',
    text: 'Redirecionando para a página de configurações...',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'return-to-main',
        text: 'Voltar para o menu principal ↩️',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  // Nova mensagem para o Campeonato de Clipadores
  'clip-championship-info': {
    id: 'clip-championship-info',
    text: '🚨#FURIAClips - Temporada 1 já tá valendo! 🎬🔥\nR$20 MIL em premiação pros melhores clipes! 💰\n\nCrie conteúdo, poste nas redes sociais com as hashtags obrigatórias (veja as regras) e participe da competição feita para todos que amam a FURIA!',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'clip-championship-rules',
        text: 'Ver regras 📋',
        nextMessageId: 'clip-championship-rules-info'
      },
      {
        id: 'clip-championship-register',
        text: 'Cadastrar clipes 📤',
        nextMessageId: 'clip-championship-register-input'
      },
      {
        id: 'clip-championship-my-clips',
        text: 'Ver meus clipes 🎞️',
        nextMessageId: 'clip-championship-my-clips-list'
      },
      {
        id: 'clip-championship-enable-notifications',
        text: 'Ativar notificações 🔔',
        nextMessageId: 'clip-championship-enable-notifications-confirm'
      },
      {
        id: 'clip-championship-disable-notifications',
        text: 'Desativar notificações 🔕',
        nextMessageId: 'clip-championship-disable-notifications-confirm'
      },
      {
        id: 'return-to-main',
        text: 'Voltar para o menu principal ↩️',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  // Nova mensagem para exibir o link das regras
  'clip-championship-rules-info': {
    id: 'clip-championship-rules-info',
    text: 'Você pode acessar as regras completas do campeonato de clipadores através do link abaixo:',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'go-to-rules',
        text: 'Acessar regras 🔗',
        nextMessageId: 'clip-championship-rules-external'
      },
      {
        id: 'back-to-clip-championship',
        text: 'Voltar para o menu de clipadores 🎬',
        nextMessageId: 'clip-championship-info'
      }
    ]
  },
  'clip-championship-rules-external': {
    id: 'clip-championship-rules-external',
    text: 'Redirecionando para as regras do campeonato...',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'back-to-clip-championship',
        text: 'Voltar para o menu de clipadores 🎬',
        nextMessageId: 'clip-championship-info'
      },
      {
        id: 'return-to-main',
        text: 'Voltar para o menu principal ↩️',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  // Novas mensagens para o fluxo de clipes
  'clip-championship-register-input': {
    id: 'clip-championship-register-input',
    text: 'Por favor, cole abaixo o link do seu clipe. Lembre-se de que o link deve ser de um clipe publicado nas redes sociais com as hashtags obrigatórias:',
    sender: 'bot',
    type: 'input',
    showInput: true,
    inputLabel: 'Link do seu clipe',
    inputAction: 'submit-clip-link'
  },
  'clip-championship-register-success': {
    id: 'clip-championship-register-success',
    text: 'Seu clipe foi registrado com sucesso! Nossa equipe irá analisar e aprovar em breve. ✅\n\nVocê poderá enviar outro clipe em 10 minutos.',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'back-to-clip-championship',
        text: 'Voltar para o menu de clipadores 🎬',
        nextMessageId: 'clip-championship-info'
      }
    ]
  },
  'clip-championship-register-cooldown': {
    id: 'clip-championship-register-cooldown',
    text: 'Você precisa aguardar 10 minutos entre o envio de cada clipe. Tente novamente mais tarde!',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'back-to-clip-championship',
        text: 'Voltar para o menu de clipadores 🎬',
        nextMessageId: 'clip-championship-info'
      }
    ]
  },
  'clip-championship-my-clips-list': {
    id: 'clip-championship-my-clips-list',
    text: 'Aqui estão os seus clipes cadastrados:',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'back-to-clip-championship',
        text: 'Voltar para o menu de clipadores 🎬',
        nextMessageId: 'clip-championship-info'
      }
    ]
  },
  'clip-championship-no-clips': {
    id: 'clip-championship-no-clips',
    text: 'Você ainda não cadastrou nenhum clipe. Participe agora enviando seus melhores momentos!',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'clip-championship-register',
        text: 'Cadastrar clipes 📤',
        nextMessageId: 'clip-championship-register-input'
      },
      {
        id: 'back-to-clip-championship',
        text: 'Voltar para o menu de clipadores 🎬',
        nextMessageId: 'clip-championship-info'
      }
    ]
  },
  // Novas mensagens para ativação/desativação de notificações de clipes
  'clip-championship-enable-notifications-confirm': {
    id: 'clip-championship-enable-notifications-confirm',
    text: 'As notificações do campeonato de clipadores foram ativadas com sucesso! 🔔\n\nVocê receberá avisos sobre novidades, prazos e atualizações do campeonato.',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'back-to-clip-championship',
        text: 'Voltar para o menu de clipadores 🎬',
        nextMessageId: 'clip-championship-info'
      }
    ]
  },
  'clip-championship-disable-notifications-confirm': {
    id: 'clip-championship-disable-notifications-confirm',
    text: 'As notificações do campeonato de clipadores foram desativadas. 🔕\n\nVocê não receberá mais avisos sobre novidades, prazos e atualizações do campeonato.',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'back-to-clip-championship',
        text: 'Voltar para o menu de clipadores 🎬',
        nextMessageId: 'clip-championship-info'
      }
    ]
  },
  // Novas mensagens para o calendário de jogos
  'games-calendar-info': {
    id: 'games-calendar-info',
    text: 'Aqui estão os próximos eventos que a FURIA vai participar! \n\nCALENDÁRIO - 05/05/2025 a 11/05/2025',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'game-kings-league-05-05',
        text: '05/05 - 17h00 - [FURIA FC] Kings League vs Fluxo FC',
        nextMessageId: 'game-redirect-twitch'
      },
      {
        id: 'game-cs-pgl-10-05',
        text: '10/05 - 05h00 - [CS Internacional] PGL Astana 2025 FURIA vs The MongolZ',
        nextMessageId: 'game-redirect-twitch'
      },
      {
        id: 'game-r6-reload-10-05',
        text: '10/05 - 12h00 - [R6] RE:LO:AD - FURIA vs Elevate - MD1 - Round 1 - Group Stage',
        nextMessageId: 'game-redirect-twitch'
      },
      {
        id: 'game-lol-11-05',
        text: '11/05 - 12h00 - [FURIA LOL] FURIA X FLUXO/W7M - Fase de grupos 2º Split',
        nextMessageId: 'game-redirect-twitch'
      },
      {
        id: 'return-to-main',
        text: 'Voltar para o menu principal ↩️',
        nextMessageId: 'return-to-new-main'
      }
    ]
  },
  'game-redirect-twitch': {
    id: 'game-redirect-twitch',
    text: 'Redirecionando para o canal da FURIA na Twitch...',
    sender: 'bot',
    type: 'options',
    options: [
      {
        id: 'back-to-calendar',
        text: 'Voltar para o calendário de jogos 📅',
        nextMessageId: 'games-calendar-info'
      },
      {
        id: 'return-to-main',
        text: 'Voltar para o menu principal ↩️',
        nextMessageId: 'return-to-new-main'
      }
    ]
  }
}; 