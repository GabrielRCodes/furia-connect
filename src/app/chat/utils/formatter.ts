/**
 * Formata o timestamp para exibição
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formata o CPF para exibição (XXX.XXX.XXX-XX)
 */
export const formatCpf = (cpf: string): string => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

/**
 * Gera um ID único baseado em um ID base e timestamp
 */
export const generateUniqueId = (baseId: string): string => {
  return `${baseId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
}; 