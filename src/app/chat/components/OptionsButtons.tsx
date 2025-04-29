import React from 'react';
import { Button } from "@/components/ui/button";
import { Option, Message } from '../types';

interface OptionsButtonsProps {
  options: Option[];
  messageId: string;
  isActive?: boolean;
  onOptionSelect: (option: Option, message: Message) => void;
  message: Message;
}

const OptionsButtons: React.FC<OptionsButtonsProps> = ({
  options,
  messageId,
  isActive = true,
  onOptionSelect,
  message
}) => {
  return (
    <div className="mt-3 space-y-2">
      {options.map((option) => (
        messageId.includes('select-teams') && option.id !== 'confirm-teams' && !option.id.includes('return-to-main') ? (
          // Renderizar switches para seleção de times
          <div 
            key={option.id}
            className="flex items-center justify-between p-3 rounded-md bg-background hover:bg-muted border border-muted-foreground/20 cursor-pointer transition-all duration-200 ease-in-out"
            onClick={() => onOptionSelect(option, message)}
          >
            <div className="flex items-center space-x-2">
              <span className="text-base">{option.text.replace(' ✓', '')}</span>
              {option.text.includes('✓') && (
                <span className="text-sm text-primary">Selecionado</span>
              )}
            </div>
            <div className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${option.text.includes('✓') ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${option.text.includes('✓') ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white'}`} />
            </div>
          </div>
        ) : (
          // Botão padrão para outras opções
          <Button
            key={option.id}
            variant="outline"
            className={`w-full justify-start text-left bg-background hover:bg-muted border-muted-foreground/20 ${isActive === false ? 'opacity-70' : ''}`}
            onClick={() => onOptionSelect(option, message)}
          >
            {option.text}
          </Button>
        )
      ))}
    </div>
  );
};

export default OptionsButtons; 