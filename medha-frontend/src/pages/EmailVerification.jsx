import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import { AuthContext } from "../AuthContext";

/**
 * EmailVerification page for existing users who haven't verified their email.
 * They arrive here after login with emailVerified: false.
 * Uses custom OTP system via /api/auth/send-otp and /api/auth/verify-otp
 */
const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  // Get user data passed from login page
  const userData = location.state?.userData;
  const token = location.state?.token;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationStep, setVerificationStep] = useState("init"); // init, code, complete
  const [verificationCode, setVerificationCode] = useState("");

  // Redirect if no user data OR if user is already verified
  useEffect(() => {
    if (!userData?.email) {
      navigate("/login");
      return;
    }
    if (userData.emailVerified === true) {
      navigate("/dashboard");
    }
  }, [userData, navigate]);

  // Step 1: Send OTP code
  const handleSendCode = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${baseUrl}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email, type: "verification" }),
      });
      const data = await res.json();

      if (res.ok) {
        setVerificationStep("code");
      } else if (res.status === 429) {
        setError(data.message || "Please wait before requesting another code.");
      } else {
        setError(data.message || "Failed to send verification code.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify the OTP code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${baseUrl}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email, code: verificationCode }),
      });
      const data = await res.json();

      if (res.ok && data.verified) {
        await updateBackendVerification();
      } else {
        setError(data.message || "Invalid code. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  // Update backend with verification status
  const updateBackendVerification = async () => {
    try {
      await fetch(`${baseUrl}/api/users/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Proceed anyway — OTP verification succeeded
    }

    const updatedUser = { ...userData, emailVerified: true };
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    login(updatedUser);
    setVerificationStep("complete");
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  // Resend code
  const handleResendCode = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email, type: "verification" }),
      });
      const data = await res.json();
      if (res.ok) {
        setError("");
        alert("Verification code resent! Check your email.");
      } else {
        setError(data.message || "Failed to resend code.");
      }
    } catch {
      setError("Failed to resend code. Please try again.");
    }
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden bg-slate-50">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "3s" }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img
            src="https://ik.imagekit.io/ayushrathore1/MEDHA%20Revision%20Logo%20(5)/6.svg?updatedAt=1767677218473"
            alt="MEDHA logo"
            className="w-20 h-20 mx-auto mb-4 object-contain"
          />
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-2">
            {verificationStep === "complete" ? "Email Verified!" : "Verify Your Email"}
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            {verificationStep === "complete"
              ? "Redirecting to dashboard..."
              : `Verify ${userData.email} to continue`}
          </p>
        </div>

        <Card className="shadow-2xl shadow-indigo-500/10 border-indigo-100 p-8">
          {verificationStep === "init" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-3xl">📧</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  To secure your account, please verify your email address. We'll send a 6-digit code to <strong>{userData.email}</strong>
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-xl text-sm font-bold text-red-600 bg-red-50 border border-red-200 text-center">
                  {error}
                </div>
              )}

              <Button
                onClick={handleSendCode}
                disabled={loading}
                loading={loading}
                variant="primary"
                size="lg"
                fullWidth
                className="shadow-xl shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 border-0"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </Button>
            </div>
          )}

          {verificationStep === "code" && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl text-sm font-bold text-red-600 bg-red-50 border border-red-200 text-center">
                  {error}
                </div>
              )}

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-3xl">✉️</span>
                </div>
                <p className="text-slate-600 text-sm">
                  Enter the 6-digit code we sent to your email
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-center text-2xl font-bold tracking-[0.5em] placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                loading={loading}
                variant="primary"
                size="lg"
                fullWidth
                className="shadow-xl shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 border-0"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </form>
          )}

          {verificationStep === "complete" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-4xl">✅</span>
              </div>
              <p className="text-green-600 font-bold text-lg">
                Your email has been verified!
              </p>
              <p className="text-slate-500 mt-2">
                Redirecting to your dashboard...
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default EmailVerification;
