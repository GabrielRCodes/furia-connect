import React from 'react';
import { Button } from "@/components/ui/button";
import { maskEmail, maskCpf } from '../utils/maskingUtils';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Chat.profileSummary');
  
  return (
    <div className="mt-4 bg-background/80 p-3 rounded-md">
      <div className="space-y-3">
        <div>
          <span className="text-xs text-muted-foreground">{t('name')}</span>
          <p className="font-medium">{userName}</p>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{t('email')}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6 px-2"
              onClick={onToggleEmail}
            >
              {showEmail ? t('hide') : t('show')}
            </Button>
          </div>
          <p className="font-mono">
            {email 
              ? (showEmail ? email : maskEmail(email))
              : t('notProvided')}
          </p>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{t('cpf')}</span>
            {cpf && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={onToggleCpf}
              >
                {showCpf ? t('hide') : t('show')}
              </Button>
            )}
          </div>
          <p className="font-mono">
            {cpf 
              ? (showCpf ? cpf : maskCpf(cpf))
              : t('notProvided')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary; 