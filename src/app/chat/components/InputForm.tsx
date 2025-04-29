import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InputFormProps {
  inputValue: string;
  placeholderText?: string;
  inputMode?: 'text' | 'email' | 'numeric' | 'tel' | 'url';
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const InputForm: React.FC<InputFormProps> = ({
  inputValue,
  placeholderText = "Digite sua resposta",
  inputMode = 'text',
  onInputChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="mt-3">
      <div className="flex flex-col space-y-2">
        <Input
          type={inputMode === 'email' ? 'email' : 'text'}
          placeholder={placeholderText}
          value={inputValue}
          onChange={onInputChange}
          className="bg-background"
          autoFocus
          inputMode={inputMode}
        />
        <Button type="submit" disabled={!inputValue.trim()}>
          Enviar
        </Button>
      </div>
    </form>
  );
};

export default InputForm; 