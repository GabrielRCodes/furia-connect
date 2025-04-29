import React from 'react';
import { Button } from "@/components/ui/button";
import { maskEmail, maskCpf } from '../utils/maskingUtils';

interface ProfileSummaryProps {
  userName: string;
  email?: string;
  cpf?: string;
  showEmail: boolean;
  showCpf: boolean;
  onToggleEmail: () => void;
  onToggleCpf: () => void;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({
  userName,
  email,
  cpf,
  showEmail,
  showCpf,
  onToggleEmail,
  onToggleCpf
}) => {
  return (
    <div className="mt-4 bg-background/80 p-3 rounded-md">
      <div className="space-y-3">
        <div>
          <span className="text-xs text-muted-foreground">Nome:</span>
          <p className="font-medium">{userName}</p>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">E-mail:</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6 px-2"
              onClick={onToggleEmail}
            >
              {showEmail ? 'Esconder' : 'Mostrar'}
            </Button>
          </div>
          <p className="font-mono">
            {email 
              ? (showEmail ? email : maskEmail(email))
              : 'Não informado'}
          </p>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">CPF:</span>
            {cpf && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={onToggleCpf}
              >
                {showCpf ? 'Esconder' : 'Mostrar'}
              </Button>
            )}
          </div>
          <p className="font-mono">
            {cpf 
              ? (showCpf ? cpf : maskCpf(cpf))
              : 'Não informado'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary; 