'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, X, Bot } from 'lucide-react';
import { ChatProvider } from './ChatProvider';
import ChatWindow from './ChatWindow';
import { authClient } from '@/lib/auth-client';

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Handle sign out by listening to auth state changes
  useEffect(() => {
    if (!isAuthenticated && !checkingAuth) {
      // Clear any open chat windows when user signs out
      setIsOpen(false);
    }
  }, [isAuthenticated, checkingAuth]);

  // Toggle chat window
  const toggleChat = () => {
    if (!isAuthenticated && !checkingAuth) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    setIsOpen(!isOpen);
  };

  // Remove the click outside to close functionality
  // Chat will only close via the close button

  if (checkingAuth) {
    return null; // Don't render anything while checking auth
  }

  if (!isAuthenticated) {
    return null; // Don't show the chatbot button to non-authenticated users
  }

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <Button
            onClick={toggleChat}
            className="rounded-full p-4 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 ring-2 ring-offset-2 ring-blue-300 dark:ring-blue-700"
            aria-label="Open chatbot"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          id="floating-chat-container"
          className="fixed bottom-24 right-6 z-50 w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-[500px] sm:h-[550px] md:h-[600px] bg-transparent"
        >
          <Card className="h-full flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-2xl bg-white text-gray-800">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg backdrop-blur-sm border border-gray-200">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">AI Task Assistant</h3>
                  <p className="text-xs text-gray-500">Always here to help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="h-9 w-9 p-0 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors border border-gray-200"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="flex-grow p-0 flex flex-col bg-gray-50">
              <ChatProvider>
                <ChatWindow />
              </ChatProvider>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;