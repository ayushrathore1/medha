import React, { useState, useContext } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../AuthContext";
import AuthShell from "../components/Auth/AuthShell";
import { apiUrl } from "../config/api";
import { resolvePostAuthPath } from "../config/appMode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginMode, setLoginMode] = useState("password");
  const [otpStep, setOtpStep] = useState("email");
  const [otpCode, setOtpCode] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);
  const nextParam = searchParams.get("next");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(apiUrl("/api/auth/login"), {
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
        navigate(resolvePostAuthPath(data.user, nextParam));
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendLoginOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(apiUrl("/api/auth/send-otp"), {
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

  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(apiUrl("/api/auth/login-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        login(data.user);
        navigate(resolvePostAuthPath(data.user, nextParam));
      } else {
        setError(data.message || "Verification failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "1.5px solid #E8E8E8",
    borderRadius: 12,
    fontSize: 15,
    color: "#111111",
    background: "#F6F6F6",
    outline: "none",
    transition: "border-color 200ms, box-shadow 200ms",
  };

  const inputFocus = (e) => {
    e.target.style.borderColor = "#111111";
    e.target.style.boxShadow = "0 0 0 3px rgba(17,17,17,0.08)";
    e.target.style.background = "white";
  };
  const inputBlur = (e) => {
    e.target.style.borderColor = "#E8E8E8";
    e.target.style.boxShadow = "none";
    e.target.style.background = "#F6F6F6";
  };

  const tabStyle = (active) => ({
    flex: 1,
    padding: "10px 0",
    fontSize: 13,
    fontWeight: 600,
    border: "none",
    borderBottom: active ? "2px solid #111111" : "2px solid transparent",
    background: "none",
    color: active ? "#111111" : "#9A9A9A",
    cursor: "pointer",
    transition: "all 200ms",
  });

  return (
    <AuthShell
      kicker="Exam season is here"
      titleLines={["Stop scrolling.", "Start studying."]}
      subtitle="The students who pass aren't smarter. They just knew what to study."
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
          Welcome back
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "#5A5A5A",
            marginTop: 8,
            marginBottom: 28,
          }}
        >
          Your exam prep is waiting.
        </p>

        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #E8E8E8",
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
            Password
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
            Login via OTP
          </button>
        </div>

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#E30613",
              marginBottom: 16,
              padding: "10px 14px",
              background: "rgba(227,6,19,0.06)",
              border: "1px solid rgba(227,6,19,0.15)",
              borderRadius: 10,
            }}
          >
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {loginMode === "password" && (
          <form onSubmit={handleLogin}>
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
                Email
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
                Password
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
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div style={{ textAlign: "right", marginBottom: 24 }}>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: 13,
                  color: "#111111",
                  textDecoration: "underline",
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </Link>
            </div>

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
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}

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
                Email
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
                color: "#5A5A5A",
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
                background: loading ? "#2D2D2D" : "#111111",
                color: "white",
                borderRadius: 999,
                border: "none",
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Sending code..." : "Send login code"}
            </button>
          </form>
        )}

        {loginMode === "otp" && otpStep === "code" && (
          <form onSubmit={handleVerifyLoginOtp}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <p
                style={{
                  fontSize: 14,
                  color: "#5A5A5A",
                  lineHeight: 1.5,
                }}
              >
                Enter the 6-digit code sent to{" "}
                <strong style={{ color: "#111111" }}>{email}</strong>
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
                  loading || otpCode.length !== 6 ? "#B8B8B8" : "#111111",
                color: "white",
                borderRadius: 999,
                border: "none",
                fontSize: 15,
                fontWeight: 700,
                cursor:
                  loading || otpCode.length !== 6 ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Verifying..." : "Verify & login"}
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
                  color: "#111111",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Resend code
              </button>
            </div>
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
          New to Medha?{" "}
          <Link
            to="/register"
            style={{
              color: "#111111",
              fontWeight: 700,
              textDecoration: "underline",
            }}
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </AuthShell>
  );
};

export default Login;
