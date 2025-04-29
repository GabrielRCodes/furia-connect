export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'options' | 'input';
  options?: Option[];
  isActive?: boolean;
  showInput?: boolean;
  inputLabel?: string;
  customData?: {
    showEmail?: boolean;
    showCpf?: boolean;
    email?: string;
    cpf?: string;
    userName?: string;
    inputMode?: 'text' | 'email' | 'numeric' | 'tel' | 'url';
    [key: string]: any;
  };
}

export interface Option {
  id: string;
  text: string;
  nextMessageId: string;
}

export interface SavedUserInfo {
  name: string;
  email: string;
  cpf: string;
  timestamp: Date;
}

export interface LiveGamesNotification {
  channel: string | null;
  contactInfo: string | null;
  teams: string[];
  timestamp?: Date;
}

export interface ContactDescription {
  contactType: string;
  contactValue: string;
  contactDescription: string;
} 