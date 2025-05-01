import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdVerified } from "react-icons/md";
import { useTranslations } from 'next-intl';

const ChatHeader: React.FC = () => {
  const t = useTranslations('Chat');

  return (
    <div className="flex items-center p-4 border-b">
      <Avatar className="h-10 w-10 mr-3 border border-primary/30 p-0.5 rounded-full">
        <AvatarImage src="https://res.cloudinary.com/dnuayiowd/image/upload/v1745531725/LOGO-MAIN_linrk0.png" alt="FURIA" />
        <AvatarFallback>F</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center">
          <h2 className="font-semibold">FURIA</h2>
          <MdVerified className="ml-1 text-amber-500" size={16} />
        </div>
        <p className="text-sm text-muted-foreground">{t('header.assistantTitle')}</p>
      </div>
    </div>
  );
};

export default ChatHeader; 