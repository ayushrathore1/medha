/**
 * ChatbotWidget — Redesigned MEDHA Study Assistant
 * Cream + green theme matching landing page design
 * Context-aware per-page suggestions, nudge bubble
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChatbot } from "../../context/ChatbotContext";

/* ── page-aware suggestions ── */
const PAGE_PROMPTS = {
  "/dashboard": [
    "What should I study for tomorrow's exam?",
    "Break down my pending tasks",
    "Make a 3-hour study plan",
    "Which subjects need the most attention?",
  ],
  "/notes": [
    "Summarize this note for me",
    "Explain the key concepts",
    "What topics are missing?",
    "Create flashcards from this",
  ],
  "/exams": [
    "Explain this question step by step",
    "Break down this paper's pattern",
    "Which topics repeat the most?",
    "How should I attempt this paper?",
  ],
  "/recommendations": [
    "I didn't understand what was in this video",
    "Explain this concept in simple terms",
    "Which lecture should I watch first?",
    "Compare these two explanations",
  ],
  "/visualizations": [
    "Explain this concept in text",
    "Give me a real-life analogy",
    "How does this relate to the exam?",
    "What's the formula behind this?",
  ],
  default: [
    "What should I study for DBMS tomorrow?",
    "Explain SQL joins simply",
    "Which units are most important in OS?",
    "I have 3 hours, what to focus on?",
  ],
};

const PAGE_NUDGES = {
  "/dashboard": "Need help planning your study session?",
  "/notes": "Want me to summarize a note?",
  "/exams": "Stuck on a past paper question?",
  "/recommendations": "Not sure which lecture to pick?",
  "/visualizations": "Need a text explanation?",
  default: "Got a doubt? Ask me anything!",
};

const ChatbotWidget = () => {
  const { isOpen, setIsOpen } = useChatbot();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNudge, setShowNudge] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const nudgeTimerRef = useRef(null);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const currentPath = location.pathname;
  const suggestions =
    PAGE_PROMPTS[
      Object.keys(PAGE_PROMPTS).find((k) => currentPath.startsWith(k)) || "default"
    ] || PAGE_PROMPTS.default;

  const nudgeText =
    PAGE_NUDGES[
      Object.keys(PAGE_NUDGES).find((k) => currentPath.startsWith(k)) || "default"
    ] || PAGE_NUDGES.default;

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  // Nudge bubble after 30s
  useEffect(() => {
    if (!isOpen && messages.length === 0) {
      nudgeTimerRef.current = setTimeout(() => setShowNudge(true), 30000);
      return () => clearTimeout(nudgeTimerRef.current);
    } else {
      setShowNudge(false);
    }
  }, [isOpen, messages.length, currentPath]);

  // Send message
  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim()) return;
      const userMessage = { role: "user", content: text };
      setMessages((prev) => [...prev, userMessage]);
      setInputText("");
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.post(
          `${baseUrl}/api/chatbot/ask`,
          {
            input: text,
            contextMessages: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            model: "groq",
          },
          { headers, timeout: 60000 }
        );

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.data.answer,
            hasWebSearch: response.data.webSearchUsed || false,
            hasContext: response.data.hasContext || false,
          },
        ]);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to get response. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [baseUrl, messages]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <>
      <style>{`
        @keyframes dot-breathe {
          0%,100% { transform:scale(1); opacity:1; }
          50% { transform:scale(1.5); opacity:0.6; }
        }
        @keyframes pulse-ring {
          0% { transform:scale(1); opacity:0.5; }
          100% { transform:scale(1.6); opacity:0; }
        }
        .chatbot-prose h1,.chatbot-prose h2,.chatbot-prose h3 {
          color:#1A1A2E; font-weight:700; margin:8px 0 4px;
        }
        .chatbot-prose p { margin:4px 0; }
        .chatbot-prose ul,.chatbot-prose ol { padding-left:16px; margin:4px 0; }
        .chatbot-prose code {
          background:#F0FAF0; padding:1px 4px; border-radius:4px; font-size:13px;
        }
        .chatbot-prose pre { background:#1A1A2E; color:#F9F6F1; padding:10px; border-radius:8px; overflow-x:auto; }
        .chatbot-prose pre code { background:transparent; color:inherit; }
        .chatbot-prose a { color:#7DC67A; }
      `}</style>

      {/* ── TRIGGER BUTTON ── */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowNudge(false);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "#1A1A2E",
          border: "2px solid rgba(125,198,122,0.4)",
          boxShadow: "0 8px 24px rgba(26,26,46,0.3)",
          cursor: "pointer",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isOpen ? (
          <span style={{ color: "white", fontSize: 18, lineHeight: 1 }}>×</span>
        ) : (
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "linear-gradient(135deg, #7DC67A, #8B5CF6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
              color: "white",
            }}
          >
            M
          </div>
        )}

        {/* Pulse ring */}
        {!isOpen && messages.length === 0 && (
          <div
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: "50%",
              border: "2px solid rgba(125,198,122,0.3)",
              animation: "pulse-ring 2s ease-out infinite",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Unread dot */}
        {!isOpen && messages.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#EF4444",
              border: "2px solid white",
            }}
          />
        )}
      </motion.button>

      {/* ── NUDGE BUBBLE ── */}
      <AnimatePresence>
        {showNudge && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={() => {
              setIsOpen(true);
              setShowNudge(false);
            }}
            style={{
              position: "fixed",
              bottom: 84,
              right: 24,
              background: "white",
              border: "1px solid #E8E4DC",
              borderRadius: "14px 14px 4px 14px",
              padding: "10px 16px",
              fontSize: 13,
              color: "#1A1A2E",
              fontWeight: 500,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              cursor: "pointer",
              zIndex: 999,
              maxWidth: 220,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {nudgeText}
            <div
              style={{
                position: "absolute",
                bottom: -6,
                right: 20,
                width: 12,
                height: 12,
                background: "white",
                border: "1px solid #E8E4DC",
                borderTop: "none",
                borderLeft: "none",
                transform: "rotate(45deg)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CHAT PANEL ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              bottom: 88,
              right: 24,
              width: 360,
              height: 520,
              maxWidth: "calc(100vw - 48px)",
              maxHeight: "70vh",
              background: "white",
              borderRadius: 20,
              border: "1px solid #E8E4DC",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 999,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                padding: "16px 20px",
                background: "#1A1A2E",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #7DC67A, #8B5CF6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "white",
                }}
              >
                M
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>
                  MEDHA AI
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#7DC67A",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#7DC67A",
                      display: "inline-block",
                      animation: "dot-breathe 2s infinite",
                    }}
                  />
                  Ready to help
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    title="Clear chat"
                    style={{
                      background: "rgba(239,68,68,0.15)",
                      border: "none",
                      borderRadius: 8,
                      padding: 8,
                      cursor: "pointer",
                      fontSize: 12,
                      color: "#EF4444",
                    }}
                  >
                    🗑
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    borderRadius: 8,
                    padding: 8,
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 18,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* MESSAGES */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {/* Welcome + suggestions */}
              {messages.length === 0 && (
                <div style={{ padding: "8px 0" }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#9A9A9A",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 8,
                    }}
                  >
                    TRY ASKING
                  </div>
                  {suggestions.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(prompt)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "10px 12px",
                        background: "#F9F6F1",
                        border: "1px solid #E8E4DC",
                        borderRadius: 10,
                        fontSize: 13,
                        color: "#1A1A2E",
                        cursor: "pointer",
                        marginBottom: 6,
                        transition: "all 150ms",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = "#7DC67A";
                        e.target.style.background = "#F0FAF0";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = "#E8E4DC";
                        e.target.style.background = "#F9F6F1";
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Messages */}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {msg.role === "assistant" && (
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background:
                          "linear-gradient(135deg, #7DC67A, #8B5CF6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 800,
                        color: "white",
                        marginRight: 6,
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      M
                    </div>
                  )}

                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "10px 14px",
                      borderRadius:
                        msg.role === "user"
                          ? "14px 14px 4px 14px"
                          : "14px 14px 14px 4px",
                      background:
                        msg.role === "user" ? "#1A1A2E" : "#F9F6F1",
                      color: msg.role === "user" ? "white" : "#1A1A2E",
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    {msg.role === "assistant" ? (
                      <div className="chatbot-prose">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                        {(msg.hasWebSearch || msg.hasContext) && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginTop: 8,
                              paddingTop: 8,
                              borderTop: "1px solid #E8E4DC",
                              fontSize: 11,
                              color: "#9A9A9A",
                            }}
                          >
                            {msg.hasContext && <span>📚 Your data</span>}
                            {msg.hasWebSearch && <span>🌐 Web search</span>}
                          </div>
                        )}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {/* Loading */}
              {isLoading && (
                <div style={{ display: "flex", gap: 4, padding: "6px 0" }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background:
                        "linear-gradient(135deg, #7DC67A, #8B5CF6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 800,
                      color: "white",
                      marginRight: 6,
                    }}
                  >
                    M
                  </div>
                  <div
                    style={{
                      background: "#F9F6F1",
                      borderRadius: "14px 14px 14px 4px",
                      padding: "12px 16px",
                      display: "flex",
                      gap: 4,
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#9A9A9A",
                          animation: `dot-breathe 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "rgba(239,68,68,0.06)",
                    border: "1px solid rgba(239,68,68,0.15)",
                    borderRadius: 10,
                    fontSize: 13,
                    color: "#EF4444",
                    textAlign: "center",
                  }}
                >
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid #E8E4DC",
                background: "white",
              }}
            >
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", gap: 8 }}
              >
                <input
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask anything..."
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    border: "1.5px solid #E8E4DC",
                    borderRadius: 10,
                    fontSize: 14,
                    outline: "none",
                    color: "#1A1A2E",
                    background: "#F9F6F1",
                    transition: "border-color 200ms",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#7DC67A")}
                  onBlur={(e) => (e.target.style.borderColor = "#E8E4DC")}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: inputText.trim() ? "#7DC67A" : "#E8E4DC",
                    border: "none",
                    cursor: inputText.trim() ? "pointer" : "default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 150ms",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      color: inputText.trim() ? "white" : "#9A9A9A",
                    }}
                  >
                    →
                  </span>
                </button>
              </form>
              <div
                style={{
                  fontSize: 10,
                  color: "#9A9A9A",
                  textAlign: "center",
                  marginTop: 6,
                }}
              >
                Press Enter · Powered by Groq AI
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
