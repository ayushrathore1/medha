import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../AuthContext";

// ─── Shared Left Column Visual ──────────────────────────────
const AuthLeftColumn = ({ preLabel, headline1, headline2, subText }) => (
  <div
    style={{
      background: "#1A1A2E",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "60px 48px",
      minHeight: "100vh",
    }}
  >
    {/* BG layers */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        opacity: 0.5,
      }}
    />
    <div
      style={{
        position: "absolute",
        width: 400,
        height: 400,
        right: -80,
        top: -80,
        borderRadius: "50%",
        background: "radial-gradient(circle, #7DC67A 0%, transparent 70%)",
        opacity: 0.12,
        filter: "blur(80px)",
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        width: 300,
        height: 300,
        left: -60,
        bottom: -60,
        borderRadius: "50%",
        background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)",
        opacity: 0.1,
        filter: "blur(80px)",
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        fontSize: 200,
        fontWeight: 900,
        color: "rgba(255,255,255,0.02)",
        letterSpacing: "-0.05em",
        lineHeight: 1,
        bottom: "-5%",
        left: "-2%",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      MEDHA
    </div>

    {/* Content */}
    <div style={{ position: "relative", zIndex: 10 }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.03em",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            MEDHA
          </span>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#F59E0B",
            }}
          />
        </div>
      </Link>
    </div>

    {/* Main message */}
    <div style={{ position: "relative", zIndex: 10 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(125,198,122,0.15)",
          border: "1px solid rgba(125,198,122,0.3)",
          borderRadius: 999,
          padding: "6px 14px",
          fontSize: 11,
          fontWeight: 700,
          color: "#7DC67A",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 24,
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#7DC67A",
          }}
        />
        {preLabel}
      </div>

      <h1
        style={{
          fontSize: 52,
          fontWeight: 800,
          color: "white",
          letterSpacing: "-0.04em",
          lineHeight: 1.0,
          margin: 0,
        }}
      >
        {headline1}
        <br />
        {headline2.replace(".", "")}
        <span style={{ color: "#F59E0B" }}>.</span>
      </h1>

      <p
        style={{
          fontSize: 16,
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.7,
          maxWidth: 360,
          marginTop: 20,
        }}
      >
        {subText}
      </p>

      {/* Feature pills */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 32,
        }}
      >
        {[
          { icon: "⚡", text: "AI Note Summaries" },
          { icon: "📄", text: "RTU PYQ Archive" },
          { icon: "🎯", text: "Syllabus-Matched Lectures" },
        ].map((f, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 999,
              padding: "8px 14px",
              fontSize: 13,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            <span>{f.icon}</span>
            <span>{f.text}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Social proof */}
    <div
      style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div style={{ display: "flex" }}>
        {[
          { from: "#7DC67A", to: "#4A9E47", text: "RS" },
          { from: "#F59E0B", to: "#D97706", text: "PM" },
          { from: "#8B5CF6", to: "#6D28D9", text: "AK" },
        ].map((a, i) => (
          <div
            key={i}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "2px solid #1A1A2E",
              background: `linear-gradient(135deg, ${a.from}, ${a.to})`,
              marginLeft: i === 0 ? 0 : -8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "white",
            }}
          >
            {a.text}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
        <span style={{ color: "white", fontWeight: 700 }}>149+ students</span>{" "}
        already studying smarter
      </div>
    </div>
  </div>
);

// ─── Login Page ─────────────────────────────────────────────
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginMode, setLoginMode] = useState("password"); // "password" | "otp"
  const [otpStep, setOtpStep] = useState("email"); // "email" | "code"
  const [otpCode, setOtpCode] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (!data.user.emailVerified) {
          navigate("/verify-email", {
            state: { userData: data.user, token: data.token },
          });
          return;
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        login(data.user);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // OTP: Send code
  const handleSendLoginOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${baseUrl}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "login" }),
      });
      const data = await res.json();

      if (res.ok) {
        setOtpStep("code");
      } else {
        setError(data.message || "Failed to send code.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // OTP: Verify code & login
  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${baseUrl}/api/auth/login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        login(data.user);
        navigate("/dashboard");
      } else {
        setError(data.message || "Verification failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  /* ── input base style ── */
  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "1.5px solid #E8E4DC",
    borderRadius: 12,
    fontSize: 15,
    color: "#1A1A2E",
    background: "#F9F6F1",
    outline: "none",
    transition: "border-color 200ms, box-shadow 200ms",
    fontFamily: "'DM Sans', sans-serif",
  };

  const inputFocus = (e) => {
    e.target.style.borderColor = "#7DC67A";
    e.target.style.boxShadow = "0 0 0 3px rgba(125,198,122,0.1)";
    e.target.style.background = "white";
  };
  const inputBlur = (e) => {
    e.target.style.borderColor = "#E8E4DC";
    e.target.style.boxShadow = "none";
    e.target.style.background = "#F9F6F1";
  };

  const tabStyle = (active) => ({
    flex: 1,
    padding: "10px 0",
    fontSize: 13,
    fontWeight: 600,
    border: "none",
    borderBottom: active ? "2px solid #1A1A2E" : "2px solid transparent",
    background: "none",
    color: active ? "#1A1A2E" : "#9A9A9A",
    cursor: "pointer",
    transition: "all 200ms",
    fontFamily: "'DM Sans', sans-serif",
  });

  return (
    <div
      className="auth-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "55% 45%",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @media (max-width: 900px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-left { display: none !important; }
          .auth-mobile-logo { display: flex !important; align-items: center; gap: 4px; }
          .auth-form-panel { padding: 24px 16px !important; min-height: 100vh !important; }
          .auth-form-card { padding: 28px 20px !important; max-width: 100% !important; }
        }
        @media (max-width: 480px) {
          .auth-form-panel { padding: 16px 12px !important; }
          .auth-form-card { padding: 24px 16px !important; border-radius: 16px !important; }
        }
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after {
          content:''; position:absolute; top:-50%; left:-100%;
          width:50%; height:200%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          transform:skewX(-20deg); transition:left 400ms ease;
        }
        .btn-shine:hover::after { left:160%; }
        @keyframes dot-breathe {
          0%,100% { transform:scale(1); opacity:1; }
          50% { transform:scale(1.5); opacity:0.6; }
        }
      `}</style>

      {/* LEFT — Visual */}
      <div className="auth-left">
        <AuthLeftColumn
          preLabel="EXAM SEASON IS HERE"
          headline1="Stop scrolling."
          headline2="Start studying."
          subText="The students who pass aren't smarter. They just knew what to study."
        />
      </div>

      {/* RIGHT — Form */}
      <div
        className="auth-form-panel"
        style={{
          background: "#F2EDE4",
          padding: "60px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Dot grid bg */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(26,26,46,0.12) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            opacity: 0.3,
            pointerEvents: "none",
          }}
        />

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "white",
            borderRadius: 20,
            padding: 40,
            border: "1px solid #E8E4DC",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            position: "relative",
            zIndex: 10,
            maxWidth: 440,
            width: "100%",
            margin: "0 auto",
          }}
          className="auth-form-card"
        >
          {/* Mobile logo */}
          <div
            className="auth-mobile-logo"
            style={{ display: "none", marginBottom: 20 }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#1A1A2E",
                letterSpacing: "-0.03em",
              }}
            >
              MEDHA
            </span>
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#F59E0B",
                marginLeft: 2,
                verticalAlign: "middle",
              }}
            />
          </div>

          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#1A1A2E",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Welcome back
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "#6B6B6B",
              marginTop: 4,
              marginBottom: 24,
            }}
          >
            Your exam prep is waiting.
          </p>

          {/* Login method tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #E8E4DC",
              marginBottom: 24,
            }}
          >
            <button
              style={tabStyle(loginMode === "password")}
              onClick={() => {
                setLoginMode("password");
                setError("");
                setOtpStep("email");
                setOtpCode("");
              }}
            >
              🔒 Password
            </button>
            <button
              style={tabStyle(loginMode === "otp")}
              onClick={() => {
                setLoginMode("otp");
                setError("");
                setOtpStep("email");
                setOtpCode("");
              }}
            >
              ✉️ Login via OTP
            </button>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#EF4444",
                marginBottom: 16,
                padding: "10px 14px",
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.15)",
                borderRadius: 10,
              }}
            >
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* ═══ PASSWORD LOGIN ═══ */}
          {loginMode === "password" && (
            <form onSubmit={handleLogin}>
              {/* Email */}
              <div style={{ marginBottom: 16 }}>
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
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  required
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 16 }}>
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
                  PASSWORD
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    required
                    minLength={6}
                    style={inputStyle}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 14,
                      color: "#9A9A9A",
                      padding: 4,
                    }}
                  >
                    {showPw ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div style={{ textAlign: "right", marginBottom: 24 }}>
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: 13,
                    color: "#7DC67A",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign in button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-shine"
                style={{
                  width: "100%",
                  padding: 16,
                  background: loading ? "#2D2D3F" : "#1A1A2E",
                  color: "white",
                  borderRadius: 12,
                  border: "none",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 200ms",
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          {/* ═══ OTP LOGIN ═══ */}
          {loginMode === "otp" && otpStep === "email" && (
            <form onSubmit={handleSendLoginOtp}>
              <div style={{ marginBottom: 24 }}>
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
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  required
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>

              <p
                style={{
                  fontSize: 13,
                  color: "#6B6B6B",
                  marginBottom: 24,
                  lineHeight: 1.5,
                }}
              >
                We'll send a 6-digit code to your email. No password needed.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="btn-shine"
                style={{
                  width: "100%",
                  padding: 16,
                  background: loading ? "#5A9E57" : "#7DC67A",
                  color: "white",
                  borderRadius: 12,
                  border: "none",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 200ms",
                }}
              >
                {loading ? "Sending code..." : "Send Login Code"}
              </button>
            </form>
          )}

          {loginMode === "otp" && otpStep === "code" && (
            <form onSubmit={handleVerifyLoginOtp}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: "#F0FAF0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                    fontSize: 24,
                  }}
                >
                  ✉️
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: "#6B6B6B",
                    lineHeight: 1.5,
                  }}
                >
                  Enter the 6-digit code sent to{" "}
                  <strong style={{ color: "#1A1A2E" }}>{email}</strong>
                </p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  maxLength={6}
                  required
                  style={{
                    ...inputStyle,
                    textAlign: "center",
                    fontSize: 28,
                    fontWeight: 800,
                    letterSpacing: "0.4em",
                    padding: "16px",
                    fontFamily: "'Courier New', monospace",
                  }}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="btn-shine"
                style={{
                  width: "100%",
                  padding: 16,
                  background:
                    loading || otpCode.length !== 6 ? "#B8E0B6" : "#7DC67A",
                  color: "white",
                  borderRadius: 12,
                  border: "none",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor:
                    loading || otpCode.length !== 6
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 200ms",
                }}
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 16,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep("email");
                    setOtpCode("");
                    setError("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 13,
                    color: "#9A9A9A",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ← Change email
                </button>
                <button
                  type="button"
                  onClick={handleSendLoginOtp}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 13,
                    color: "#7DC67A",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Resend code
                </button>
              </div>
            </form>
          )}



          {/* Bottom link */}
          <p
            style={{
              fontSize: 14,
              color: "#6B6B6B",
              textAlign: "center",
              marginTop: 24,
            }}
          >
            New to MEDHA?{" "}
            <Link
              to="/register"
              style={{ color: "#7DC67A", fontWeight: 600, textDecoration: "none" }}
            >
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
