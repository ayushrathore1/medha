import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";

/**
 * ForgotPassword - Directs users to contact admin via WhatsApp
 */
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const ADMIN_WHATSAPP = "+916377805448";
  
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleWhatsAppClick = () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    const message = `Hi Admin, I forgot my password for MEDHA.\n\nMy registered email: ${email.trim()}\n\nPlease help me reset my password. Thank you!`;
    
    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden bg-slate-50">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <Card className="max-w-md w-full shadow-2xl shadow-indigo-500/10 border-indigo-100 p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Forgot Password
          </h2>
          <p className="text-slate-500 mt-2">
            Enter your email and contact our admin via WhatsApp to reset your password.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl text-sm font-bold text-red-600 bg-red-50 border border-red-200 text-center mb-4">
            {error}
          </div>
        )}

        {/* Email input - required */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-slate-700">
            Your Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            required
          />
        </div>

        {/* WhatsApp Contact Button */}
        <button
          onClick={handleWhatsAppClick}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg 
            className="w-6 h-6" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Contact Admin on WhatsApp
        </button>

        {/* Privacy Notice */}
        <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <p className="text-center text-emerald-700 font-semibold text-sm">
            📧 You'll receive a password reset link on your email
          </p>
          <p className="text-center text-emerald-600 text-sm mt-2">
            🔒 Your account is completely secure & private. The admin cannot access your password - they only trigger the reset link.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
