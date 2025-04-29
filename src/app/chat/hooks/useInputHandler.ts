import { useState } from 'react';
import { isValidEmail } from '../utils/validators';

export const useInputHandler = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [currentInputAction, setCurrentInputAction] = useState<string>('');
  
  // Manipular a mudança no input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Manipulação específica baseada no tipo de input
    if (currentInputAction.startsWith('submit-notification-contact')) {
      const channel = currentInputAction.split('-').pop();
      
      switch (channel) {
        case 'WhatsApp':
          // Para WhatsApp, permitir apenas números e alguns caracteres
          setInputValue(value.replace(/[^\d\s\+\(\)\-]/g, ''));
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
    } else if (currentInputAction === 'submit-cpf') {
      // Para CPF, permitir apenas números
      setInputValue(value.replace(/\D/g, ''));
    } else {
      // Para outros tipos de input, manter comportamento normal
      setInputValue(value);
    }
  };
  
  // Validar e-mail
  const validateEmail = (email: string): boolean => {
    return isValidEmail(email);
  };
  
  // Validar CPF (apenas verificação básica de formato)
  const validateCpf = (cpf: string): boolean => {
    const cleanCpf = cpf.replace(/\D/g, '');
    return cleanCpf.length === 11;
  };
  
  // Validar contato baseado no canal
  const validateContact = (contact: string, channel: string): boolean => {
    switch (channel) {
      case 'WhatsApp':
        // Para WhatsApp, verificar se tem pelo menos 10 dígitos
        return contact.replace(/\D/g, '').length >= 10;
      case 'Telegram':
        // Para Telegram, verificar se começa com @ e tem pelo menos mais um caractere
        return contact.startsWith('@') && contact.length > 1;
      case 'Discord':
        // Para Discord, verificar se tem pelo menos 2 caracteres
        return contact.length >= 2;
      case 'E-mail':
        // Para E-mail, usar a validação de e-mail
        return validateEmail(contact);
      default:
        return false;
    }
  };
  
  return {
    inputValue,
    setInputValue,
    currentInputAction,
    setCurrentInputAction,
    handleInputChange,
    validateEmail,
    validateCpf,
    validateContact
  };
}; 