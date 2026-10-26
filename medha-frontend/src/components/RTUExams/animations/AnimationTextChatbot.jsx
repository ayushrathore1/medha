/**
 * AnimationTextChatbot - Context-aware text chatbot for animations
 * Has full context of current slide, content, and topic
 * Premium Apple-inspired dark theme with web search support
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FaComments,
  FaTimes,
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaGlobe,
  FaSpinner,
  FaChevronDown,
  FaTrash,
  FaLightbulb,
} from "react-icons/fa";

const APPLE_THEME = {
  bg: "#000000",
  surface: "#1c1c1e",
  surfaceHover: "#2c2c2e",
  surfaceElevated: "#38383a",
  border: "rgba(255, 255, 255, 0.1)",
  accent: "#0A84FF",
  accentGradient: "linear-gradient(135deg, #0A84FF, #5e5ce6)",
  text: "#F5F5F7",
  textSec: "#86868B",
  textTertiary: "#636366",
  success: "#30D158",
  danger: "#FF453A",
  warning: "#FFD60A",
  purple: "#BF5AF2",
};

const AnimationTextChatbot = ({
  animationTitle,
  currentStep,
  totalSteps,
  slideNotes,
  animationId,
  isVisible = true,
  currentSlideTitle = "",
  currentSlideContent = "",
  animationSubject = "",
  animationTopics = [],
  sectionName = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  // Context-aware suggestions based on animation
  const suggestions = [
    `Explain "${currentSlideTitle || `step ${currentStep}`}" in simple terms`,
    `What's the key concept here?`,
    `Give me a real-world example`,
    `What should I remember for exams?`,
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isExpanded]);

  // Build context string for AI
  const buildContext = useCallback(() => {
    let context = `
=== CURRENT ANIMATION CONTEXT (USE THIS AS PRIMARY REFERENCE) ===

ANIMATION INFO:
- Subject: ${animationSubject || "C++ / Object Oriented Programming"}
- Main Topic: ${animationTitle || "Animation"}
- Animation ID: ${animationId || "unknown"}
- Topics Covered: ${animationTopics.length > 0 ? animationTopics.join(", ") : "General programming concepts"}

CURRENT POSITION:
- Step: ${currentStep} of ${totalSteps}
- Current Section: ${sectionName || "General"}
- Current Slide Title: "${currentSlideTitle || `Step ${currentStep}`}"

CURRENT SLIDE CONTENT:
${currentSlideContent || "No specific content available for this slide."}
`;

    if (slideNotes && typeof slideNotes === "object" && slideNotes.english) {
      context += `
INSTRUCTOR NOTES FOR THIS SLIDE:
${slideNotes.english}
`;
    } else if (slideNotes && typeof slideNotes === "string") {
      context += `
INSTRUCTOR NOTES FOR THIS SLIDE:
${slideNotes}
`;
    }

    context += `
=== INSTRUCTIONS ===
You are helping a student understand the content on THIS SPECIFIC SLIDE.
- Focus ONLY on the current slide content shown above
- Do NOT mix concepts from other topics or slides
- Be specific to what's displayed on this slide (step ${currentStep})
- If the slide is about "${currentSlideTitle}", only discuss that specific topic
- Keep answers relevant to ${animationSubject || "C++"} and the current topic
- Be concise but educational
`;

    return context;
  }, [
    animationTitle,
    animationId,
    currentStep,
    totalSteps,
    slideNotes,
    currentSlideTitle,
    currentSlideContent,
    animationSubject,
    animationTopics,
    sectionName,
  ]);

  // Send message to AI
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Build context-aware prompt
      const contextPrompt = buildContext();

      const response = await axios.post(
        `${baseUrl}/api/chatbot/ask`,
        {
          input: text,
          contextMessages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          animationContext: contextPrompt,
          model: "groq",
        },
        { headers, timeout: 60000 }
      );

      const aiMessage = {
        role: "assistant",
        content: response.data.answer,
        hasWebSearch: response.data.webSearchUsed || false,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to get response. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
    setShowSuggestions(true);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          position: "fixed",
          bottom: "100px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: isExpanded
            ? APPLE_THEME.surfaceElevated
            : APPLE_THEME.accentGradient,
          border: isExpanded ? `1px solid ${APPLE_THEME.accent}` : "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isExpanded
            ? "0 8px 32px rgba(0, 0, 0, 0.4)"
            : "0 8px 32px rgba(10, 132, 255, 0.4)",
          zIndex: 10000,
        }}
      >
        {isExpanded ? (
          <FaChevronDown color={APPLE_THEME.accent} size={20} />
        ) : (
          <FaComments color="white" size={20} />
        )}
      </motion.button>

      {/* Unread indicator */}
      {!isExpanded && messages.length > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: "fixed",
            bottom: "144px",
            right: "24px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: APPLE_THEME.danger,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 600,
            color: "white",
            zIndex: 10001,
            border: `2px solid ${APPLE_THEME.bg}`,
          }}
        >
          {messages.filter((m) => m.role === "assistant").length}
        </motion.div>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: "fixed",
              bottom: "170px",
              right: "24px",
              width: "380px",
              maxWidth: "calc(100vw - 48px)",
              height: "500px",
              maxHeight: "60vh",
              background: "rgba(28, 28, 30, 0.98)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              borderRadius: "24px",
              border: `1px solid ${APPLE_THEME.border}`,
              boxShadow: "0 25px 80px rgba(0, 0, 0, 0.6)",
              zIndex: 10000,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: `1px solid ${APPLE_THEME.border}`,
                background: "rgba(10, 132, 255, 0.08)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "12px",
                    background: APPLE_THEME.accentGradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaRobot color="white" size={18} />
                </div>
                <div>
                  <div
                    style={{
                      color: APPLE_THEME.text,
                      fontWeight: 600,
                      fontSize: "15px",
                    }}
                  >
                    Medha AI
                  </div>
                  <div style={{ color: APPLE_THEME.textSec, fontSize: "11px" }}>
                    Step {currentStep}/{totalSteps} •{" "}
                    {animationTitle?.slice(0, 20)}...
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    style={{
                      background: "rgba(255, 69, 58, 0.1)",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px",
                      cursor: "pointer",
                    }}
                    title="Clear chat"
                  >
                    <FaTrash color={APPLE_THEME.danger} size={14} />
                  </button>
                )}
                <button
                  onClick={() => setIsExpanded(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px",
                    cursor: "pointer",
                  }}
                >
                  <FaTimes color={APPLE_THEME.textSec} size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {/* Welcome message */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "20px",
                      background: APPLE_THEME.accentGradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <FaLightbulb color="white" size={28} />
                  </div>
                  <div
                    style={{
                      color: APPLE_THEME.text,
                      fontWeight: 600,
                      fontSize: "16px",
                      marginBottom: "8px",
                    }}
                  >
                    Ask about this animation
                  </div>
                  <div
                    style={{
                      color: APPLE_THEME.textSec,
                      fontSize: "13px",
                      lineHeight: 1.5,
                    }}
                  >
                    I have full context of "{animationTitle}" and can help
                    explain Step {currentStep}.
                  </div>
                </motion.div>
              )}

              {/* Suggestions */}
              {showSuggestions && messages.length === 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      color: APPLE_THEME.textSec,
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginTop: "8px",
                    }}
                  >
                    Suggested questions
                  </div>
                  {suggestions.map((suggestion, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => sendMessage(suggestion)}
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: `1px solid ${APPLE_THEME.border}`,
                        borderRadius: "12px",
                        padding: "12px 16px",
                        textAlign: "left",
                        cursor: "pointer",
                        color: APPLE_THEME.text,
                        fontSize: "13px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(10, 132, 255, 0.1)";
                        e.target.style.borderColor = APPLE_THEME.accent;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(255, 255, 255, 0.05)";
                        e.target.style.borderColor = APPLE_THEME.border;
                      }}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Messages */}
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                    gap: "8px",
                  }}
                >
                  {msg.role === "assistant" && (
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        background: APPLE_THEME.accentGradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FaRobot color="white" size={14} />
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "12px 16px",
                      borderRadius:
                        msg.role === "user"
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                      background:
                        msg.role === "user"
                          ? APPLE_THEME.accentGradient
                          : "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)",
                      backdropFilter: msg.role === "assistant" ? "blur(20px)" : "none",
                      WebkitBackdropFilter: msg.role === "assistant" ? "blur(20px)" : "none",
                      border: msg.role === "assistant" 
                        ? "1px solid rgba(255, 255, 255, 0.15)"
                        : "none",
                      boxShadow: msg.role === "assistant"
                        ? "0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                        : "0 4px 12px rgba(10, 132, 255, 0.3)",
                      color: APPLE_THEME.text,
                      fontSize: "14px",
                      lineHeight: 1.5,
                    }}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                        {msg.hasWebSearch && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              marginTop: "8px",
                              paddingTop: "8px",
                              borderTop: `1px solid ${APPLE_THEME.border}`,
                              color: APPLE_THEME.success,
                              fontSize: "11px",
                            }}
                          >
                            <FaGlobe size={10} />
                            <span>Enhanced with web search</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        background: APPLE_THEME.purple,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FaUser color="white" size={12} />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 16px",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      background: APPLE_THEME.accentGradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaRobot color="white" size={14} />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 16px",
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "12px",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    >
                      <FaSpinner color={APPLE_THEME.accent} size={14} />
                    </motion.div>
                    <span
                      style={{ color: APPLE_THEME.textSec, fontSize: "13px" }}
                    >
                      Thinking...
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    padding: "12px 16px",
                    background: "rgba(255, 69, 58, 0.1)",
                    borderRadius: "12px",
                    color: APPLE_THEME.danger,
                    fontSize: "13px",
                    textAlign: "center",
                  }}
                >
                  {error}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              style={{
                padding: "12px 16px 16px",
                borderTop: `1px solid ${APPLE_THEME.border}`,
                background: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                  padding: "4px 4px 4px 16px",
                  border: `1px solid ${APPLE_THEME.border}`,
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about this animation..."
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: APPLE_THEME.text,
                    fontSize: "14px",
                    padding: "8px 0",
                  }}
                />
                <motion.button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "12px",
                    background:
                      inputText.trim() && !isLoading
                        ? APPLE_THEME.accentGradient
                        : "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    cursor:
                      inputText.trim() && !isLoading
                        ? "pointer"
                        : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: inputText.trim() && !isLoading ? 1 : 0.5,
                  }}
                >
                  <FaPaperPlane color="white" size={14} />
                </motion.button>
              </div>
              <div
                style={{
                  color: APPLE_THEME.textTertiary,
                  fontSize: "10px",
                  textAlign: "center",
                  marginTop: "8px",
                }}
              >
                Press Enter to send • Powered by Medha AI
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnimationTextChatbot;
