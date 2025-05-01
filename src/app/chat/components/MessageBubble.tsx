import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdVerified } from "react-icons/md";
import { Message, Option } from '../types';
import { Button } from "@/components/ui/button";
import { formatTime } from '../utils/formatter';
import OptionsButtons from './OptionsButtons';
import InputForm from './InputForm';
import ProfileSummary from './ProfileSummary';
import { useTranslations } from 'next-intl';

interface MessageBubbleProps {
  message: Message;
  displayName: string;
  sessionUserImage?: string | null;
  inputValue: string;
  currentInputAction: string;
  onOptionSelect: (option: Option, message: Message) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputSubmit: (e: React.FormEvent) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  displayName,
  sessionUserImage,
  inputValue,
  currentInputAction,
  onOptionSelect,
  onInputChange,
  onInputSubmit
}) => {
  const t = useTranslations('Chat');
  
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-start max-w-[80%]">
        {/* Avatar (mostrado apenas para mensagens do bot) */}
        {message.sender === 'bot' && (
          <Avatar className="h-8 w-8 mr-2 mt-1 border border-primary/30 p-0.5 rounded-full">
            <AvatarImage src="https://res.cloudinary.com/dnuayiowd/image/upload/v1745531725/LOGO-MAIN_linrk0.png" alt="FURIA" />
            <AvatarFallback>F</AvatarFallback>
          </Avatar>
        )}
        
        <div>
          {/* Nome do remetente */}
          <div className="text-xs text-muted-foreground mb-1 flex items-center">
            {message.sender === 'bot' ? (
              <>
                FURIA
                <MdVerified className="ml-1 text-amber-500" size={12} />
              </>
            ) : displayName}
          </div>
          
          {/* Conteúdo da mensagem */}
          <div
            className={`rounded-lg p-3 ${
              message.sender === 'user'
                ? 'bg-secondary/80 text-secondary-foreground border border-border'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {message.id.includes('welcome') ? (
              <div>
                <p>{t('messageBubble.welcome.greeting')}</p>
                <p className="mt-2">
                  {t('messageBubble.welcome.terms')}{' '}
                  <a 
                    href="https://terms.furia.gg" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary/80"
                  >
                    https://terms.furia.gg
                  </a>
                </p>
              </div>
            ) : message.id.includes('show-profile-summary') ? (
              <div>
                <p>{message.text}</p>
                
                {/* Resumo do perfil */}
                {message.customData && (
                  <ProfileSummary
                    userName={message.customData?.userName || displayName}
                    email={message.customData?.email}
                    cpf={message.customData?.cpf}
                    showEmail={!!message.customData?.showEmail}
                    showCpf={!!message.customData?.showCpf}
                    onToggleEmail={() => onOptionSelect({
                      id: `toggle-email-${message.id}`,
                      text: message.customData?.showEmail ? t('messageBubble.toggleEmail.hide') : t('messageBubble.toggleEmail.show'),
                      nextMessageId: ''
                    }, message)}
                    onToggleCpf={() => onOptionSelect({
                      id: `toggle-cpf-${message.id}`,
                      text: message.customData?.showCpf ? t('messageBubble.toggleCpf.hide') : t('messageBubble.toggleCpf.show'),
                      nextMessageId: ''
                    }, message)}
                  />
                )}
              </div>
            ) : (
              <div>
                <p>{message.text}</p>
                
                {/* Mostrar botão e e-mail para mensagens com customData.email */}
                {message.customData?.email && 
                 !message.id.includes('show-profile-summary') && 
                 !message.id.includes('ask-cpf') && 
                 !message.id.includes('input-cpf') && 
                 !message.id.includes('cpf-declined') && (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => onOptionSelect({
                        id: `toggle-email-${message.id}`,
                        text: message.customData?.showEmail ? t('messageBubble.toggleEmail.hide') : t('messageBubble.toggleEmail.show'),
                        nextMessageId: ''
                      }, message)}
                    >
                      {message.customData?.showEmail ? t('messageBubble.toggleEmail.hide') : t('messageBubble.toggleEmail.show')}
                    </Button>
                    
                    {message.customData?.showEmail && (
                      <div className="mt-1 px-3 py-2 bg-muted rounded text-sm font-mono">
                        {message.customData.email}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Opções de resposta (quando aplicável) */}
            {message.type === 'options' && message.options && (
              <OptionsButtons
                options={message.options}
                messageId={message.id}
                isActive={message.isActive}
                onOptionSelect={onOptionSelect}
                message={message}
              />
            )}
            
            {/* Campo de entrada para mensagens do tipo input */}
            {message.type === 'input' && message.showInput && message.isActive !== false && (
              <InputForm
                inputValue={inputValue}
                placeholderText={message.inputLabel}
                inputMode={message.customData?.inputMode || (currentInputAction === 'submit-cpf' ? 'numeric' : 'text')}
                onInputChange={onInputChange}
                onSubmit={onInputSubmit}
              />
            )}
            
            {/* Horário da mensagem */}
            <div className="text-[10px] opacity-70 text-right mt-1">
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
        
        {/* Avatar (mostrado apenas para mensagens do usuário) */}
        {message.sender === 'user' && (
          <Avatar className="h-8 w-8 ml-2 mt-1">
            {sessionUserImage ? (
              <AvatarImage src={sessionUserImage} alt={displayName} />
            ) : (
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default MessageBubble; 