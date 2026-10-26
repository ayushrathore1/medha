import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../AuthContext";

// ─── Shared Left Column ─────────────────────────────────────
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

    {/* Logo */}
    <div style={{ position: "relative", zIndex: 10 }}>
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
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 32 }}>
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

// ─── Password Strength ─────────────────────────────────────
function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthLabels = ["", "Weak", "Fair", "Strong", "Very Strong"];
const strengthColors = ["#E8E4DC", "#EF4444", "#F59E0B", "#7DC67A", "#7DC67A"];

// ─── Constants ──────────────────────────────────────────────
const BRANCHES = ["CSE", "ECE", "ME", "Civil", "IT", "AIDS", "CSD", "CAI"];
const SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

// ─── Register Page ──────────────────────────────────────────
const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    branch: "",
    semester: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const strength = getStrength(formData.password);

  /* ── input style ── */
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
  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: "#9A9A9A",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: 6,
  };

  // ── Step 1 → Step 2
  const goToStep2 = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setStep(2);
  };

  // ── Submit → Send OTP for email verification
  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${baseUrl}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, type: "registration" }),
      });
      const data = await res.json();

      if (res.ok) {
        setVerificationStep(true);
      } else if (res.status === 429) {
        setError(data.message || "Please wait before requesting another code.");
      } else {
        setError(data.message || "Failed to send verification code.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Backend account after OTP verification
  const createBackendAccount = async (retryCount = 0) => {
    const maxRetries = 3;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            emailVerified: true,
            college: formData.college,
            branch: formData.branch,
            semester: formData.semester,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        login(data.user);
        setSuccess(true);
        setTimeout(() => navigate("/personalize"), 2500);
      } else if (response.status === 409) {
        const loginResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          }
        );
        const loginData = await loginResponse.json();
        if (loginResponse.ok) {
          localStorage.setItem("token", loginData.token);
          localStorage.setItem("user", JSON.stringify(loginData.user));
          login(loginData.user);
          setSuccess(true);
          setTimeout(() => navigate("/personalize"), 2500);
        } else {
          setError("Account exists but login failed. Try logging in manually.");
          setLoading(false);
        }
      } else if (response.status >= 500 && retryCount < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * (retryCount + 1)));
        return createBackendAccount(retryCount + 1);
      } else {
        setError(data.message || "Failed to create account.");
        setLoading(false);
      }
    } catch {
      if (retryCount < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * (retryCount + 1)));
        return createBackendAccount(retryCount + 1);
      }
      setError("Failed to complete registration. Please try again.");
      setLoading(false);
    }
  };

  // ── Verify email OTP
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${baseUrl}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: verificationCode }),
      });
      const data = await res.json();

      if (res.ok && data.verified) {
        await createBackendAccount();
      } else {
        setError(data.message || "Verification failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, type: "registration" }),
      });
      const data = await res.json();
      if (res.ok) {
        setError("");
        alert("Verification code resent! Check your email.");
      } else {
        setError(data.message || "Failed to resend code.");
      }
    } catch {
      setError("Failed to resend code.");
    }
  };



  const firstName = formData.name.split(" ")[0] || "there";

  return (
    <div
      className="auth-grid-outer"
      style={{
        display: "grid",
        gridTemplateColumns: "55% 45%",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @media (max-width: 900px) {
          .auth-grid-outer { grid-template-columns: 1fr !important; }
          .auth-left { display: none !important; }
          .auth-mobile-logo { display: block !important; }
          .auth-form-panel-reg { padding: 24px 16px !important; min-height: 100vh !important; }
          .auth-form-card-reg { padding: 28px 20px !important; max-width: 100% !important; }
        }
        @media (max-width: 480px) {
          .auth-form-panel-reg { padding: 16px 12px !important; }
          .auth-form-card-reg { padding: 24px 16px !important; border-radius: 16px !important; }
        }
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after {
          content:''; position:absolute; top:-50%; left:-100%;
          width:50%; height:200%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          transform:skewX(-20deg); transition:left 400ms ease;
        }
        .btn-shine:hover::after { left:160%; }
        .chip-btn { transition: all 150ms; cursor: pointer; border: none; font-family: inherit; }
        .chip-btn:hover { border-color: #7DC67A !important; }
      `}</style>

      {/* LEFT */}
      <div className="auth-left">
        <AuthLeftColumn
          preLabel="JOIN 149+ STUDENTS"
          headline1="Study smart."
          headline2="Not hard."
          subText="Create your free account and get access to AI notes, past papers, and lecture recommendations matched to your exact syllabus."
        />
      </div>

      {/* RIGHT */}
      <div
        className="auth-form-panel-reg"
        style={{
          background: "#F2EDE4",
          padding: "40px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          overflowY: "auto",
        }}
      >
        {/* Dot grid */}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "white",
            borderRadius: 20,
            padding: "36px 40px",
            border: "1px solid #E8E4DC",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            position: "relative",
            zIndex: 10,
            maxWidth: 480,
            width: "100%",
            margin: "0 auto",
          }}
          className="auth-form-card-reg"
        >
          {/* Mobile logo */}
          <div className="auth-mobile-logo" style={{ display: "none", marginBottom: 16 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#1A1A2E" }}>MEDHA</span>
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

          {/* ── SUCCESS STATE ── */}
          {success ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: "center", padding: "20px 0" }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "#F0FAF0",
                  border: "3px solid #7DC67A",
                  margin: "0 auto 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  color: "#7DC67A",
                  fontWeight: 700,
                }}
              >
                ✓
              </div>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#1A1A2E",
                  marginBottom: 8,
                }}
              >
                You're in, {firstName}! 🎉
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "#6B6B6B",
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}
              >
                Your MEDHA account is ready.
                <br />
                Setting up your personalized dashboard...
              </p>
              <div
                style={{
                  height: 4,
                  background: "#E8E4DC",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  style={{
                    height: "100%",
                    background: "#7DC67A",
                    borderRadius: 2,
                  }}
                />
              </div>
            </motion.div>
          ) : verificationStep ? (
            /* ── VERIFICATION STEP ── */
            <form onSubmit={handleVerifyEmail}>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#1A1A2E",
                  marginBottom: 4,
                }}
              >
                Verify your email
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "#6B6B6B",
                  marginBottom: 24,
                }}
              >
                We sent a 6-digit code to <strong>{formData.email}</strong>
              </p>

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

              <div style={{ marginBottom: 20 }}>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  placeholder="000000"
                  maxLength={6}
                  required
                  style={{
                    ...inputStyle,
                    textAlign: "center",
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: "0.5em",
                  }}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>

              <button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                className="btn-shine"
                style={{
                  width: "100%",
                  padding: 16,
                  background:
                    loading || verificationCode.length !== 6
                      ? "#9A9A9A"
                      : "#1A1A2E",
                  color: "white",
                  borderRadius: 12,
                  border: "none",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  marginBottom: 16,
                }}
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>

              <div style={{ textAlign: "center" }}>
                <button
                  type="button"
                  onClick={handleResendCode}
                  style={{
                    fontSize: 13,
                    color: "#7DC67A",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  Didn't receive the code? Resend
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => setVerificationStep(false)}
                  style={{
                    fontSize: 13,
                    color: "#6B6B6B",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>
              </div>
            </form>
          ) : (
            /* ── FORM ── */
            <>
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#1A1A2E",
                  letterSpacing: "-0.03em",
                  margin: 0,
                }}
              >
                Create your account
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "#6B6B6B",
                  marginTop: 4,
                  marginBottom: 20,
                }}
              >
                <span style={{ color: "#7DC67A", fontWeight: 600 }}>Free</span>{" "}
                forever. No credit card needed.
              </p>

              {/* Progress bar */}
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  marginBottom: 28,
                }}
              >
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    style={{
                      flex: 1,
                      height: 4,
                      borderRadius: 2,
                      background: step >= s ? "#7DC67A" : "#E8E4DC",
                      transition: "background 300ms",
                    }}
                  />
                ))}
              </div>

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

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Full Name */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>FULL NAME</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Ayush Rathore"
                        required
                        style={inputStyle}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      />
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>EMAIL</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="you@university.edu"
                        required
                        style={inputStyle}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>PASSWORD</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showPw ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            handleChange("password", e.target.value)
                          }
                          placeholder="Min. 8 characters"
                          required
                          minLength={8}
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

                      {/* Strength */}
                      {formData.password && (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ display: "flex", gap: 3 }}>
                            {[1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                style={{
                                  flex: 1,
                                  height: 3,
                                  borderRadius: 2,
                                  background:
                                    strength >= level
                                      ? strengthColors[level]
                                      : "#E8E4DC",
                                  transition: "background 200ms",
                                }}
                              />
                            ))}
                          </div>
                          <span
                            style={{
                              fontSize: 11,
                              color: "#9A9A9A",
                              marginTop: 4,
                              display: "inline-block",
                            }}
                          >
                            {strengthLabels[strength]}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={goToStep2}
                      className="btn-shine"
                      style={{
                        width: "100%",
                        padding: 16,
                        background: "#1A1A2E",
                        color: "white",
                        borderRadius: 12,
                        border: "none",
                        fontSize: 16,
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 200ms",
                      }}
                    >
                      Continue →
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 60 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* College */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>COLLEGE</label>
                      <input
                        type="text"
                        value={formData.college}
                        onChange={(e) =>
                          handleChange("college", e.target.value)
                        }
                        placeholder="RTU Kota / Poornima College / ..."
                        style={inputStyle}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      />
                    </div>

                    {/* Branch */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>BRANCH</label>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                        }}
                      >
                        {BRANCHES.map((b) => (
                          <button
                            key={b}
                            type="button"
                            className="chip-btn"
                            onClick={() => handleChange("branch", b)}
                            style={{
                              padding: "8px 16px",
                              borderRadius: 10,
                              fontSize: 13,
                              fontWeight: 600,
                              background:
                                formData.branch === b ? "#1A1A2E" : "white",
                              color:
                                formData.branch === b ? "white" : "#6B6B6B",
                              border: `1.5px solid ${formData.branch === b ? "#1A1A2E" : "#E8E4DC"}`,
                            }}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Semester */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>CURRENT SEMESTER</label>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, 1fr)",
                          gap: 6,
                        }}
                      >
                        {SEMESTERS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className="chip-btn"
                            onClick={() => handleChange("semester", s)}
                            style={{
                              padding: "10px 0",
                              borderRadius: 10,
                              fontSize: 13,
                              fontWeight: 600,
                              textAlign: "center",
                              background:
                                formData.semester === s ? "#1A1A2E" : "white",
                              color:
                                formData.semester === s ? "white" : "#6B6B6B",
                              border: `1.5px solid ${formData.semester === s ? "#1A1A2E" : "#E8E4DC"}`,
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Why we ask */}
                    <div
                      style={{
                        background: "#F0FAF0",
                        border: "1px solid rgba(125,198,122,0.3)",
                        borderRadius: 10,
                        padding: "10px 14px",
                        fontSize: 12,
                        color: "#4A9E47",
                        lineHeight: 1.5,
                        marginBottom: 20,
                      }}
                    >
                      ✦ We use this to show you the right syllabus, past papers,
                      and lecture recommendations for your semester.
                    </div>

                    {/* Create account */}
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading || !isLoaded}
                      className="btn-shine"
                      style={{
                        width: "100%",
                        padding: 16,
                        background: loading ? "#9A9A9A" : "#7DC67A",
                        color: "#1A1A2E",
                        borderRadius: 12,
                        border: "none",
                        fontSize: 16,
                        fontWeight: 700,
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 200ms",
                        marginBottom: 12,
                      }}
                    >
                      {loading ? "Creating Account..." : "Create My Account →"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setError("");
                      }}
                      style={{
                        fontSize: 13,
                        color: "#6B6B6B",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "block",
                        margin: "0 auto",
                      }}
                    >
                      ← Back
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>



              {/* Terms */}
              <p
                style={{
                  fontSize: 12,
                  color: "#9A9A9A",
                  textAlign: "center",
                  marginTop: 16,
                  lineHeight: 1.5,
                }}
              >
                By creating an account, you agree to our{" "}
                <a
                  href="#"
                  style={{ color: "#7DC67A", textDecoration: "none" }}
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  style={{ color: "#7DC67A", textDecoration: "none" }}
                >
                  Privacy Policy
                </a>
                .
              </p>

              {/* Bottom link */}
              <p
                style={{
                  fontSize: 14,
                  color: "#6B6B6B",
                  textAlign: "center",
                  marginTop: 16,
                }}
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "#7DC67A",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
