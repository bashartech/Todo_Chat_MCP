'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';
// CSS import causes type errors, so we'll import globally in layout.tsx
import { useChat } from '@/components/chat/ChatProvider';
import { chatService, ChatMessage } from '@/services/chat-service';
import { authClient } from '@/lib/auth-client';

const ChatWindow: React.FC = () => {
  const { messages, addMessage, isLoading, setIsLoading, conversationId, setConversationId } = useChat();
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change with smooth behavior
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    // Add user message to UI immediately
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    addMessage(userMessage);

    setIsLoading(true);

    try {
      // Send message to backend
      const response = await chatService.sendMessage(message, conversationId);
      console.log("CHAT RESPONSE -->>>", response);

      // Update conversation ID if it's the first message
      if (conversationId === null || conversationId === undefined) {
        setConversationId(response.conversation_id);
      }

      // Add assistant response to UI
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      };
      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to UI
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString()
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainContainer className="bg-white rounded-xl" style={{ height: '100%', border: 'none', borderRadius: '8px', backgroundColor: 'transparent' }}>
      <ChatContainer  style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor:"white" }}>
        <MessageList
          className="p-4 flex-grow bg-gray-50"
          style={{
            overflowY: 'auto',
            backgroundColor:"white",
            maxHeight: 'calc(100vh - 150px)', // Ensure there's always space for input and header
            minHeight: '200px',
            flex: 1,
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db #f9fafb'
          }}
        >
          {isLoading && <TypingIndicator content="AI is thinking..." className="text-gray-500" />}
          {messages.map((msg, index) => (
            <Message
              key={index}
              model={{
                message: msg.content,
                sender: msg.role,
                direction: msg.role === 'user' ? 'outgoing' : 'incoming',
                position: 'normal'
              }}
              className={`
                mb-3 rounded-lg p-3 max-w-[85%] shadow-sm
                ${msg.role === 'user'
                  ? 'ml-auto bg-gray-900 text-white rounded-br-none border border-white'
                  : 'mr-auto bg-gray-100 text-gray-800  rounded-bl-none'}
              `}
            />
          ))}
          <div ref={messageEndRef} />
        </MessageList>
        <MessageInput
          placeholder="Type your message here..."
          onSend={handleSend}
          attachButton={false}  // Remove attachment button for cleaner UI
          disabled={isLoading}
          className="border-t border-gray-200  bg-white text-gray-800 placeholder-gray-400 "
          style={{
            marginTop: 'auto'
          }}
        />
      </ChatContainer>
    </MainContainer>
  );
};

export default ChatWindow;