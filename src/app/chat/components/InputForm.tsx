import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from 'next-intl';

interface InputFormProps {
  inputValue: string;
  placeholderText?: string;
  inputMode?: 'text' | 'email' | 'numeric' | 'tel' | 'url';
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const InputForm: React.FC<InputFormProps> = ({
  inputValue,
  placeholderText,
  inputMode = 'text',
  onInputChange,
  onSubmit
}) => {
  const t = useTranslations('Chat');
  const defaultPlaceholder = t('input.placeholder');

  return (
    <form onSubmit={onSubmit} className="mt-3">
      <div className="flex flex-col space-y-2">
        <Input
          type={inputMode === 'email' ? 'email' : 'text'}
          placeholder={placeholderText || defaultPlaceholder}
          value={inputValue}
          onChange={onInputChange}
          className="bg-background"
          autoFocus
          inputMode={inputMode}
        />
        <Button type="submit" disabled={!inputValue.trim()}>
          {t('input.sendButton')}
        </Button>
      </div>
    </form>
  );
};

export default InputForm; 