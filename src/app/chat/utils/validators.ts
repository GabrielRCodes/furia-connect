/**
 * Valida um endereço de email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida um CPF (apenas verifica se tem 11 dígitos numéricos)
 */
export const isValidCpf = (cpf: string): boolean => {
  const cleanCpf = cpf.replace(/\D/g, '');
  return cleanCpf.length === 11;
};

/**
 * Valida um username do Telegram (deve começar com @)
 */
export const isValidTelegramUsername = (username: string): boolean => {
  return username.startsWith('@') && username.length > 1;
};

/**
 * Valida um número de WhatsApp (formato básico)
 */
export const isValidWhatsAppNumber = (number: string): boolean => {
  const cleanNumber = number.replace(/\D/g, '');
  // Número deve ter entre 10 e 13 dígitos (incluindo código do país)
  return cleanNumber.length >= 10 && cleanNumber.length <= 13;
}; 