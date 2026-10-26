import React, { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

const ChatbotPage = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `${import.meta.env.VITE_BACKEND_URL}/api/chat/stream`,
    // Optional: send standard auth headers if your backend route requires it
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });

  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen pt-20 pb-4 px-2 sm:px-4 md:px-8 bg-[var(--bg-primary)] flex justify-center">
      <div className="w-full max-w-4xl flex flex-col" style={{ height: "calc(100dvh - 100px)" }}>
        
        {/* Header */}
        <div className="text-center mb-6">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight"
          >
            MEDHA <span className="text-[var(--action-primary)]">AI</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[var(--text-secondary)] font-medium mt-2"
          >
            Your intelligent study companion. Powered by Groq.
          </motion.p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white border border-[var(--border-default)] rounded-2xl sm:rounded-[2rem] shadow-xl overflow-hidden flex flex-col relative">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--action-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white text-3xl font-black mb-6 shadow-lg shadow-[var(--action-primary)]/20">
                  M
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">How can I help you study today?</h3>
                <p className="text-[var(--text-secondary)] max-w-md">Ask me to summarize notes, explain complex RTU topics, or build a study schedule for your next exam.</p>
              </div>
            ) : (
              messages.map(m => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--action-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white text-xs font-bold mr-3 mt-1 flex-shrink-0">
                      M
                    </div>
                  )}
                  
                  <div className={`
                    max-w-[90%] sm:max-w-[85%] px-4 sm:px-5 py-3 sm:py-4 text-[14px] sm:text-[15px] leading-relaxed
                    ${m.role === 'user' 
                      ? 'bg-[var(--text-primary)] text-white rounded-[1.5rem] rounded-tr-sm' 
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-[1.5rem] rounded-tl-sm border border-[var(--border-default)]'
                    }
                  `}>
                    {m.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none prose-headings:text-[var(--text-primary)] prose-a:text-[var(--action-primary)] prose-code:bg-[var(--bg-primary)] prose-code:px-1 prose-code:rounded">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--action-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white text-xs font-bold mr-3 mt-1 flex-shrink-0">
                  M
                </div>
                <div className="bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-[1.5rem] rounded-tl-sm px-5 py-4 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-[var(--border-default)]">
            <form onSubmit={handleSubmit} className="flex gap-3 relative max-w-4xl mx-auto">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Message Medha AI..."
                className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-primary)] px-4 sm:px-6 py-3 sm:py-4 rounded-xl focus:outline-none focus:border-[var(--action-primary)] focus:ring-4 focus:ring-[var(--action-primary)]/10 transition-all font-medium text-sm sm:text-base"
              />
              <button 
                type="submit" 
                disabled={!input?.trim() || isLoading}
                className="bg-[var(--action-primary)] hover:bg-[var(--action-hover)] text-white px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[var(--action-primary)]/20"
              >
                Send
              </button>
            </form>
            <div className="text-center mt-3 text-xs font-semibold tracking-wide text-[var(--text-tertiary)] uppercase">
              AI can make mistakes. Verify important information.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
