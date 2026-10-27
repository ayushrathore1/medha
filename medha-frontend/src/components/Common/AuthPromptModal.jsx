import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const AuthPromptModal = ({ isOpen, onClose, featureName = "this" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const next = `${location.pathname}${location.search}`;

  const go = (path) => {
    onClose();
    navigate(`${path}?next=${encodeURIComponent(next)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="revision-app fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-[#1F1F1F]/40" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md border border-[#E5E5E5] bg-white p-6"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#1F1F1F]"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        <h2 className="pr-8 text-[20px] font-semibold tracking-[-0.03em] text-[#1F1F1F]">
          Sign in to {featureName}
        </h2>
        <p className="mt-2 text-[14px] leading-6 text-[#5C5C5C]">
          Browse as a guest. An account is only needed to download notes or upload your own.
        </p>
        <button
          type="button"
          onClick={() => go("/register")}
          className="mt-6 w-full bg-[#1F1F1F] py-3 text-[14px] text-white"
        >
          Create an account
        </button>
        <p className="mt-4 text-center text-[13px] text-[#5C5C5C]">
          Already have one?{" "}
          <button type="button" onClick={() => go("/login")} className="text-[#1F1F1F] underline underline-offset-2">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPromptModal;
