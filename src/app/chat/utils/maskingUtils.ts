/**
 * Mascara o email para exibição parcial (primeiros caracteres + @ + domínio)
 * Ex: john.doe@example.com -> j******@example.com
 */
export const maskEmail = (email: string): string => {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  
  const username = parts[0];
  const domain = parts[1];
  
  // Mantém o primeiro caractere e mascara o resto
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 1);
  
  return `${maskedUsername}@${domain}`;
};

/**
 * Mascara o CPF para exibição parcial
 * Ex: 123.456.789-00 -> ***.***.789-00
 */
export const maskCpf = (cpf: string): string => {
  const cleanCpf = cpf.replace(/\D/g, '');
  if (cleanCpf.length !== 11) return cpf;
  
  // Formata e mascara o CPF, mantendo apenas os últimos 5 dígitos visíveis
  return `***.***.${ cleanCpf.substring(6, 9) }-${ cleanCpf.substring(9, 11) }`;
}; 