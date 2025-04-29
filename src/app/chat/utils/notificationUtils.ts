import { LiveGamesNotification, ContactDescription } from '../types';

/**
 * Retorna a descrição do canal de contato com base na notificação
 */
export const getContactDescription = (notification: LiveGamesNotification): ContactDescription => {
  if (!notification.channel || !notification.contactInfo) {
    return {
      contactType: 'Desconhecido',
      contactValue: 'Não informado',
      contactDescription: 'Canal de contato não informado'
    };
  }
  
  switch (notification.channel) {
    case 'WhatsApp':
      return {
        contactType: 'Número WhatsApp',
        contactValue: notification.contactInfo,
        contactDescription: `WhatsApp: ${notification.contactInfo}`
      };
    case 'Telegram':
      return {
        contactType: 'Username Telegram',
        contactValue: notification.contactInfo,
        contactDescription: `Telegram: ${notification.contactInfo}`
      };
    case 'Discord':
      return {
        contactType: 'Username Discord',
        contactValue: notification.contactInfo,
        contactDescription: `Discord: ${notification.contactInfo}`
      };
    case 'E-mail':
      return {
        contactType: 'Endereço de email',
        contactValue: notification.contactInfo,
        contactDescription: `E-mail: ${notification.contactInfo}`
      };
    default:
      return {
        contactType: notification.channel,
        contactValue: notification.contactInfo,
        contactDescription: `${notification.channel}: ${notification.contactInfo}`
      };
  }
};

/**
 * Gera texto de confirmação para notificações de jogos
 */
export const generateConfirmationText = (notification: LiveGamesNotification): string => {
  const { contactDescription } = getContactDescription(notification);
  const teamsList = notification.teams.join(', ');
  
  return `Perfeito! Você receberá notificações sobre jogos de ${teamsList} através de ${contactDescription}.`;
}; 