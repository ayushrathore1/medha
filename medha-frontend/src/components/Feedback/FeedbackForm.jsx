import React, { useState } from "react";
import Button from "../Common/Button";

const FeedbackForm = ({ onSubmitFeedback }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      if (onSubmitFeedback) {
        await onSubmitFeedback({ name, email, message });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
      setSent(true);
    } catch {
      setErrorMsg("Failed to send feedback. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center rounded-3xl py-14 px-8 max-w-xl mx-auto border-2 shadow-2xl" style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--accent-secondary)"
      }}>
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl text-white"
          style={{ background: `linear-gradient(to bottom right, var(--accent-primary), var(--accent-secondary))` }}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--action-primary)" }}>
          Thank you!
        </h3>
        <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
          Your feedback helps us improve{" "}
          <span className="font-semibold" style={{ color: "var(--action-primary)" }}>MEDHA</span> for
          everyone.
        </p>
        <Button
          onClick={() => {
            setSent(false);
            setName("");
            setEmail("");
            setMessage("");
          }}
          variant="primary"
        >
          Submit Another Feedback
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl py-10 px-8 max-w-2xl mx-auto border-2 shadow-2xl"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--accent-secondary)"
      }}
    >
      <h2 className="text-3xl font-extrabold mb-8 text-center" style={{ color: "var(--action-primary)" }}>
        We'd Love Your Feedback!
      </h2>

      {/* Name Input */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
          Your Name
        </label>
        <input
          type="text"
          className="w-full px-5 py-3 rounded-xl border-2 font-medium transition-all focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--accent-secondary)",
            color: "var(--text-primary)"
          }}
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Email Input */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
          Your Email
        </label>
        <input
          type="email"
          className="w-full px-5 py-3 rounded-xl border-2 font-medium transition-all focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--accent-secondary)",
            color: "var(--text-primary)"
          }}
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Message Textarea */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold" style={{ color: "var(--text-primary)" }}>
          Your Message
        </label>
        <textarea
          className="w-full px-5 py-3 rounded-xl border-2 font-medium transition-all min-h-[160px] focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--accent-secondary)",
            color: "var(--text-primary)"
          }}
          placeholder="Tell us what you think about MEDHA..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="mb-6 text-center text-red-600 font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        loading={loading}
        variant="primary"
        size="large"
        fullWidth
      >
        Send Feedback
      </Button>
    </form>
  );
};

export default FeedbackForm;
