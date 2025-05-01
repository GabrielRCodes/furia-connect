"use client";

import React from 'react';
import { useMessageHandler } from './hooks/useMessageHandler';
import ChatHeader from '../components/ChatHeader';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import ResetDialog from '../components/ResetDialog';
import { useTranslations } from 'next-intl';

export default function ChatPage() {
  const t = useTranslations('Chat');
  const {
    messages,
    inputValue,
    isTyping,
    currentInputAction,
    showResetModal,
    setShowResetModal,
    displayName,
    messagesEndRef,
    handleResetConversation,
    handleOptionSelect,
    handleInputChange,
    handleInputSubmit,
    sessionUserImage
  } = useMessageHandler();

  return (
    <div className="flex justify-center items-center py-6 px-4">
      <div className="max-w-7xl w-full bg-background border rounded-xl shadow-lg h-[calc(100vh-150px)] flex flex-col">
        {/* Chat header */}
        <ChatHeader />
        
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              displayName={displayName}
              sessionUserImage={sessionUserImage}
              inputValue={inputValue}
              currentInputAction={currentInputAction || ''}
              onOptionSelect={handleOptionSelect}
              onInputChange={handleInputChange}
              onInputSubmit={handleInputSubmit}
            />
          ))}
          
          {/* Typing indicator */}
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat footer */}
        <div className="p-4 border-t bg-muted/50">
          <div className="flex items-center justify-center text-muted-foreground text-sm">
            <p>{t('footer.automatedChat')}</p>
          </div>
        </div>
      </div>
      
      {/* Confirmation modal to restart the conversation */}
      <ResetDialog
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onReset={handleResetConversation}
      />
    </div>
  );
}
