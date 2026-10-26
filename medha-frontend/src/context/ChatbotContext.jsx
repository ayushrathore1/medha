/**
 * ChatbotContext - Global state for chatbot widget
 * Allows opening/closing chatbot from anywhere in the app
 */
import React, { createContext, useContext, useState, useCallback } from "react";

const ChatbotContext = createContext();

export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openChatbot = useCallback(() => setIsOpen(true), []);
  const closeChatbot = useCallback(() => setIsOpen(false), []);
  const toggleChatbot = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <ChatbotContext.Provider value={{ isOpen, openChatbot, closeChatbot, toggleChatbot, setIsOpen }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within ChatbotProvider");
  }
  return context;
};
