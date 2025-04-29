import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdVerified } from "react-icons/md";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-start">
        <Avatar className="h-8 w-8 mr-2 mt-1 border border-primary/30 p-0.5 rounded-full">
          <AvatarImage src="https://res.cloudinary.com/dnuayiowd/image/upload/v1745531725/LOGO-MAIN_linrk0.png" alt="FURIA" />
          <AvatarFallback>F</AvatarFallback>
        </Avatar>
        
        <div>
          <div className="text-xs text-muted-foreground mb-1 flex items-center">
            FURIA
            <MdVerified className="ml-1 text-amber-500" size={12} />
          </div>
          <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator; 