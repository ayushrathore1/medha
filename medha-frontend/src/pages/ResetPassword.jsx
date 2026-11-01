import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthShell from "../components/Auth/AuthShell";

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

export default function ResetPassword() {
  const token = new URLSearchParams(useLocation().search).get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password.length < 6) {
      setOk(false);
      setMsg("Use at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setOk(false);
      setMsg("Passwords do not match.");
      return;
    }
    if (!token) {
      setOk(false);
      setMsg("This reset link is missing or invalid.");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      setOk(response.ok);
      setMsg(data.message || (response.ok ? "Password updated successfully" : "Could not reset password"));
      if (response.ok) setTimeout(() => navigate("/login"), 1500);
    } catch {
      setOk(false);
      setMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      kicker="Account recovery"
      titleLines={["Set a new", "password."]}
      subtitle="This link came from auth@medharevision.shopcampuskart.in and only works once."
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
          Reset password
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "#5A5A5A",
            marginTop: 8,
            marginBottom: 28,
          }}
        >
          Choose a new password for your Medha account.
        </p>

        {msg ? (
          <div
            style={{
              fontSize: 12,
              color: ok ? "#166534" : "#E30613",
              marginBottom: 16,
              padding: "10px 14px",
              background: ok ? "rgba(27,163,74,0.08)" : "rgba(227,6,19,0.06)",
              border: ok ? "1px solid rgba(27,163,74,0.18)" : "1px solid rgba(227,6,19,0.15)",
              borderRadius: 10,
            }}
          >
            {msg}
          </div>
        ) : null}

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
            New password
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            required
            minLength={6}
            style={{ ...inputStyle, marginBottom: 16 }}
            onFocus={inputFocus}
            onBlur={inputBlur}
          />

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
            Confirm password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder="Repeat the new password"
            required
            minLength={6}
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
            {loading ? "Saving..." : "Update password"}
          </button>
        </form>

        <p
          style={{
            fontSize: 14,
            color: "#5A5A5A",
            textAlign: "center",
            marginTop: 28,
          }}
        >
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
