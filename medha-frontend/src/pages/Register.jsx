import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../AuthContext";
import AuthShell from "../components/Auth/AuthShell";
import { apiUrl } from "../config/api";
import { getPostAuthHome } from "../config/appMode";

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
const strengthColors = ["#E8E8E8", "#E30613", "#FF8A1A", "#1BA34A", "#1BA34A"];

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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const strength = getStrength(formData.password);

  /* ── input style ── */
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
  const inputFocus = (e) => {
    e.target.style.borderColor = "#111111";
    e.target.style.boxShadow = "0 0 0 3px rgba(17,17,17,0.08)";
    e.target.style.background = "white";
  };
  const inputBlur = (e) => {
    e.target.style.borderColor = "#E5E5E5";
    e.target.style.boxShadow = "none";
    e.target.style.background = "#F6F6F6";
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
    if (!formData.college.trim() || !formData.branch || !formData.semester) {
      setError("College, branch, and current semester are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl("/api/auth/send-otp"), {
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
      const response = await fetch(apiUrl("/api/auth/register"), {
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
        });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        login(data.user);
        setSuccess(true);
        setTimeout(() => navigate(getPostAuthHome(data.user)), 2500);
      } else if (response.status === 409) {
        const loginResponse = await fetch(apiUrl("/api/auth/login"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });
        const loginData = await loginResponse.json();
        if (loginResponse.ok) {
          localStorage.setItem("token", loginData.token);
          localStorage.setItem("user", JSON.stringify(loginData.user));
          login(loginData.user);
          setSuccess(true);
          setTimeout(() => navigate(getPostAuthHome(loginData.user)), 2500);
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
      const res = await fetch(apiUrl("/api/auth/verify-otp"), {
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
      const res = await fetch(apiUrl("/api/auth/send-otp"), {
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
    <AuthShell
      kicker="Join students already on Medha"
      titleLines={["We organize your syllabus.", "We unlock exam prep."]}
      subtitle="Create a free account for notes, past papers, and lectures matched to your syllabus."
    >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="auth-form-card-reg"
        >

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
                  border: "3px solid #1BA34A",
                  margin: "0 auto 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  color: "#1BA34A",
                  fontWeight: 700,
                }}
              >
                ✓
              </div>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#111111",
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
                  background: "#E5E5E5",
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
                    background: "#1BA34A",
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
                  color: "#111111",
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
                      : "#111111",
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
                    color: "#1BA34A",
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
                  color: "#111111",
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
                <span style={{ color: "#1BA34A", fontWeight: 600 }}>Free</span>{" "}
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
                      background: step >= s ? "#1BA34A" : "#E5E5E5",
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
                        placeholder="Full Name"
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
                                      : "#E5E5E5",
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
                        background: "#111111",
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
                      <label style={labelStyle}>COLLEGE *</label>
                      <input
                        type="text"
                        value={formData.college}
                        onChange={(e) =>
                          handleChange("college", e.target.value)
                        }
                        placeholder="RTU Kota / Poornima College / ..."
                        required
                        style={inputStyle}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      />
                    </div>

                    {/* Branch */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>BRANCH *</label>
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
                                formData.branch === b ? "#111111" : "white",
                              color:
                                formData.branch === b ? "white" : "#6B6B6B",
                              border: `1.5px solid ${formData.branch === b ? "#111111" : "#E5E5E5"}`,
                            }}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Semester */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>CURRENT SEMESTER *</label>
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
                                formData.semester === s ? "#111111" : "white",
                              color:
                                formData.semester === s ? "white" : "#6B6B6B",
                              border: `1.5px solid ${formData.semester === s ? "#111111" : "#E5E5E5"}`,
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
                      disabled={loading}
                      className="btn-shine"
                      style={{
                        width: "100%",
                        padding: 16,
                        background: loading ? "#9A9A9A" : "#111111",
                        color: "#FFFFFF",
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
                <Link to="/terms" style={{ color: "#1BA34A", textDecoration: "none" }}>
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" style={{ color: "#1BA34A", textDecoration: "none" }}>
                  Privacy Policy
                </Link>
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
                    color: "#1BA34A",
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
    </AuthShell>
  );
};

export default Register;
