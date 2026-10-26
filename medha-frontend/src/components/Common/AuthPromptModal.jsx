import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaXmark, FaCrown, FaRocket, FaUserPlus, FaArrowRight } from "react-icons/fa6";

/**
 * AuthPromptModal - Premium metallic-styled modal for prompting authentication
 * Shows when unauthenticated users try to access premium features
 */
const AuthPromptModal = ({ isOpen, onClose, featureName = "this feature" }) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    onClose();
    navigate("/register");
  };

  const handleSignIn = () => {
    onClose();
    navigate("/login");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#1a1a2e]"
            style={{
               boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 20px 40px -10px rgba(0,0,0,0.5)'
            }}
          >
            {/* Content */}
            <div className="relative z-10 p-8">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close"
              >
                <FaXmark size={20} />
              </button>

              {/* Crown Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative p-4 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-default)]">
                    <FaCrown className="text-4xl text-yellow-400" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center mb-2 text-white">
                Sign In to Continue
              </h2>

              {/* Subtitle */}
              <p className="text-gray-300 text-center mb-8">
                 <span className="text-[var(--action-primary)] font-bold">Medha Revision is completely free!</span>
                 <br />
                 You just need to sign in or create an account to access <span className="text-white font-semibold">{featureName}</span>.
              </p>

              {/* Features List */}
              <div className="space-y-3 mb-8">
                {[
                  { icon: "🎯", text: "AI-powered solution explanations" },
                  { icon: "📚", text: "Upload and manage your notes" },
                  { icon: "📖", text: "RTU exam archives with analysis" },
                  { icon: "🎨", text: "Personalized dashboard" },
                ].map((feature, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)]"
                  >
                    <span className="text-lg">{feature.icon}</span>
                    <span className="text-gray-300 text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Sign Up Button */}
              <button
                onClick={handleSignUp}
                className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 bg-[var(--action-primary)] text-white"
              >
                <FaUserPlus />
                Create Free Account
                <FaArrowRight className="ml-1" />
              </button>

              {/* Sign In Link */}
              <p className="text-center mt-6 text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                  onClick={handleSignIn}
                  className="text-[var(--action-primary)] font-semibold hover:text-[var(--action-hover)] transition-colors underline-offset-2 hover:underline"
                >
                  Sign In
                </button>
              </p>

              {/* Skip Text */}
              <p className="text-center mt-4 text-gray-500 text-xs">
                Press X or click outside to continue browsing
              </p>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Shimmer keyframes removed

export default AuthPromptModal;
