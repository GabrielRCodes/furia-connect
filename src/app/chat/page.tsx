"use client";

import React from 'react';
import { useMessageHandler } from './hooks/useMessageHandler';
import ChatHeader from './components/ChatHeader';
import MessageBubble from './components/MessageBubble';
import TypingIndicator from './components/TypingIndicator';
import ResetDialog from './components/ResetDialog';

export default function ChatPage() {
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
        {/* Cabeçalho do chat */}
        <ChatHeader />
        
        {/* Área das mensagens */}
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
          
          {/* Indicador de digitação */}
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Rodapé do chat */}
        <div className="p-4 border-t bg-muted/50">
          <div className="flex items-center justify-center text-muted-foreground text-sm">
            <p>Chat automático do FURIA Connect - Use os botões acima para navegar</p>
          </div>
        </div>
      </div>
      
      {/* Modal de confirmação para reiniciar a conversa */}
      <ResetDialog
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onReset={handleResetConversation}
      />
    </div>
  );
}
