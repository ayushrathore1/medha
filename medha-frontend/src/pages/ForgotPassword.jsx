import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AuthShell from "../components/Auth/AuthShell";
import { apiUrl } from "../config/api";

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  border: "1.5px solid #E5E5E5",
  borderRadius: 12,
  fontSize: 15,
  color: "#111111",
  background: "#F6F6F6",
  outline: "none",
  transition: "border-color 200ms, box-shadow 200ms",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
};

const inputFocus = (event) => {
  event.target.style.borderColor = "#111111";
  event.target.style.boxShadow = "0 0 0 3px rgba(17,17,17,0.08)";
  event.target.style.background = "white";
};

const inputBlur = (event) => {
  event.target.style.borderColor = "#E5E5E5";
  event.target.style.boxShadow = "none";
  event.target.style.background = "#F6F6F6";
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      setError("Enter the email on your Medha account.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(apiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: nextEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Could not send the reset email.");
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      kicker="Account recovery"
      titleLines={["Forgot it.", "Reset it."]}
      subtitle="We'll email a reset link from auth@medharevision.shopcampuskart.in. It expires in 30 minutes."
    >
      <motion.div
        className="auth-form-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#111111",
            letterSpacing: "-0.04em",
            margin: 0,
          }}
        >
          Forgot password
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "#5A5A5A",
            marginTop: 8,
            marginBottom: 28,
          }}
        >
          Enter your registered email. If an account exists, we send a reset link there.
        </p>

        {error ? (
          <div
            style={{
              fontSize: 12,
              color: "#E30613",
              marginBottom: 16,
              padding: "10px 14px",
              background: "rgba(227,6,19,0.06)",
              border: "1px solid rgba(227,6,19,0.15)",
              borderRadius: 10,
            }}
          >
            {error}
          </div>
        ) : null}

        {sent ? (
          <div
            style={{
              padding: "16px 18px",
              borderRadius: 16,
              background: "rgba(27,163,74,0.08)",
              border: "1px solid rgba(27,163,74,0.18)",
              color: "#166534",
              fontSize: 14,
              lineHeight: 1.55,
              marginBottom: 24,
            }}
          >
            If that email is on Medha, the reset link is on its way from{" "}
            <strong>auth@medharevision.shopcampuskart.in</strong>. Check inbox and spam.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#9A9A9A",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="you@university.edu"
              required
              style={{ ...inputStyle, marginBottom: 24 }}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-shine"
              style={{
                width: "100%",
                padding: 16,
                background: loading ? "#2D2D2D" : "#111111",
                color: "white",
                borderRadius: 999,
                border: "none",
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Sending reset email..." : "Email me a reset link"}
            </button>
          </form>
        )}

        <p
          style={{
            fontSize: 14,
            color: "#5A5A5A",
            textAlign: "center",
            marginTop: 28,
          }}
        >
          Remembered it?{" "}
          <Link
            to="/login"
            style={{
              color: "#111111",
              fontWeight: 700,
              textDecoration: "underline",
            }}
          >
            Back to login
          </Link>
        </p>
      </motion.div>
    </AuthShell>
  );
}
