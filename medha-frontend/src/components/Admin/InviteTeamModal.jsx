import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPaperPlane, FaSpinner, FaEnvelope } from "react-icons/fa6";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const InviteTeamModal = ({ isOpen, onClose, token, initialEmail = "" }) => {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
      setStatus("idle");
      setMessage("");
    }
  }, [isOpen, initialEmail]);

  if (!isOpen) return null;

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/admin/invite-team`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus("success");
      setMessage(
        res.data.message ||
          "Invitation sent. They join with this email — no code required."
      );
      setEmail("");
    } catch (error) {
      console.error("Invite failed:", error);
      setStatus("error");
      setMessage(error.response?.data?.message || "Failed to send invitation.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setMessage("");
    setEmail("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f8ee] text-[#1ba34a] text-xl">
              <FaPaperPlane />
            </div>
            <h3 className="text-xl font-extrabold tracking-tight text-[#111]">
              Invite team member
            </h3>
            <p className="mt-1 text-sm text-[#5a5a5a]">
              Grants early Ops access and sends a welcome email — no verification
              code.
            </p>
          </div>

          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#6b6b6b]">
                Email address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-[#8a8a8a]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#e5e5e5] bg-[#fafafa] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#cfcfcf] focus:shadow-[0_0_0_3px_rgba(27,163,74,0.12)]"
                  placeholder="colleague@example.com"
                  required
                />
              </div>
            </div>

            {message ? (
              <div
                className={`rounded-xl p-3 text-sm ${
                  status === "success"
                    ? "border border-[#b7e4c4] bg-[#e8f8ee] text-[#14532d]"
                    : "border border-[#fecaca] bg-[#fff5f5] text-[#be123c]"
                }`}
              >
                <p className="font-bold">
                  {status === "success" ? "Sent" : "Error"}
                </p>
                <p>{message}</p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading || !email}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111] py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Send invite"}
            </button>

            {status === "success" ? (
              <button
                type="button"
                onClick={handleClose}
                className="w-full rounded-full bg-[#f4f4f2] py-2.5 text-sm font-semibold text-[#111] hover:bg-[#ebebe8]"
              >
                Close
              </button>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
};

export default InviteTeamModal;
