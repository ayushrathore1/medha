import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaCheck, FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "../styles/responsive-pages.css";

const EMOJIS = ["🔥", "💡", "🐛", "😤", "🙏", "💜"];

const SuggestPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async () => {
    if (!message.trim()) return;
    if (message.trim().length > 2000) {
      setError("keep it under 2000 chars bestie");
      return;
    }

    setSending(true);
    setError("");

    try {
      const res = await fetch(`${baseUrl}/api/suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          emoji: selectedEmoji,
        }),
      });

      if (!res.ok) throw new Error("failed");

      setSent(true);
      setMessage("");
      setSelectedEmoji(null);
    } catch {
      setError("something broke. try again?");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="suggest-container" style={{ background: "var(--bg-primary)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: 520, position: "relative" }}
      >
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: "var(--text-tertiary)",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
            marginBottom: 24,
            padding: 0,
          }}
        >
          <FaArrowLeft size={11} /> back
        </button>

        <AnimatePresence mode="wait">
          {sent ? (
            /* ─── Success state ─── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "40px 16px" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7DC67A, #4A9E47)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  boxShadow: "0 8px 30px rgba(125, 198, 122, 0.3)",
                }}
              >
                <FaCheck size={28} style={{ color: "#fff" }} />
              </motion.div>

              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: 8,
                }}
              >
                noted. 📝
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--text-secondary)",
                  marginBottom: 28,
                  lineHeight: 1.6,
                }}
              >
                we actually read every single one of these lol
                <br />
                appreciate u fr fr 💜
              </p>

              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => setSent(false)}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 14,
                    background: "var(--bg-tertiary)",
                    border: "1.5px solid var(--border-default)",
                    color: "var(--text-primary)",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  drop another one
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 14,
                    background: "linear-gradient(135deg, #7DC67A, #4A9E47)",
                    border: "none",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  back to medha
                </button>
              </div>
            </motion.div>
          ) : (
            /* ─── Form state ─── */
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <div style={{ marginBottom: 24 }}>
                <h1
                  style={{
                    fontSize: "clamp(24px, 6vw, 32px)",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    marginBottom: 8,
                    lineHeight: 1.2,
                  }}
                >
                  got something to say? 🫡
                </h1>
                <p
                  style={{
                    fontSize: "clamp(14px, 3.5vw, 16px)",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  feature idea? something broken? rant? whatever it is, just type it.{" "}
                  no login, no name, no judgement. we're listening.
                </p>
              </div>

              {/* Emoji picker */}
              <div style={{ marginBottom: 16 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--text-tertiary)",
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  vibe check (optional)
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {EMOJIS.map((emoji) => (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setSelectedEmoji((prev) => (prev === emoji ? null : emoji))
                      }
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        border:
                          selectedEmoji === emoji
                            ? "2px solid var(--action-primary)"
                            : "1.5px solid var(--border-default)",
                        background:
                          selectedEmoji === emoji
                            ? "rgba(125, 198, 122, 0.1)"
                            : "var(--bg-tertiary)",
                        fontSize: 18,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.15s",
                      }}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div style={{ position: "relative", marginBottom: 16 }}>
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setError("");
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="just say it... feature requests, bugs, complaints, wildest ideas — literally anything"
                  rows={5}
                  maxLength={2000}
                  style={{
                    width: "100%",
                    padding: "16px 18px",
                    borderRadius: 16,
                    border: "1.5px solid var(--border-default)",
                    background: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                    fontSize: 15,
                    fontFamily: "inherit",
                    lineHeight: 1.6,
                    resize: "vertical",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                    minHeight: 130,
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--action-primary)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--border-default)")
                  }
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: 12,
                    right: 14,
                    fontSize: 11,
                    color:
                      message.length > 1800
                        ? "#ef4444"
                        : "var(--text-tertiary)",
                    fontWeight: 500,
                  }}
                >
                  {message.length}/2000
                </span>
              </div>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontSize: 13,
                    color: "#ef4444",
                    fontWeight: 500,
                    marginBottom: 12,
                  }}
                >
                  {error}
                </motion.p>
              )}

              {/* Submit */}
              <motion.button
                whileHover={message.trim() ? { y: -2, boxShadow: "0 8px 24px rgba(125, 198, 122, 0.3)" } : {}}
                whileTap={message.trim() ? { scale: 0.98 } : {}}
                onClick={handleSubmit}
                disabled={!message.trim() || sending}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 14,
                  background: message.trim()
                    ? "linear-gradient(135deg, #7DC67A, #4A9E47)"
                    : "var(--bg-secondary)",
                  border: "none",
                  color: message.trim() ? "#fff" : "var(--text-tertiary)",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: message.trim() ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s",
                }}
              >
                {sending ? (
                  "sending..."
                ) : (
                  <>
                    send it <FaPaperPlane size={13} />
                  </>
                )}
              </motion.button>

              {/* Footer tip */}
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-tertiary)",
                  textAlign: "center",
                  marginTop: 14,
                  fontWeight: 500,
                }}
              >
                ⌘/ctrl + enter to send • 100% anonymous
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SuggestPage;
