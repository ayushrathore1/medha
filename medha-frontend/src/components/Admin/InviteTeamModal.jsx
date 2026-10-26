import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaSpinner, FaEnvelope } from 'react-icons/fa6';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const InviteTeamModal = ({ isOpen, onClose, token, initialEmail = "" }) => {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, success, error
  const [message, setMessage] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
      setStatus("idle");
      setMessage("");
      setGeneratedCode("");
    }
  }, [isOpen, initialEmail]);
  /* eslint-enable react-hooks/exhaustive-deps */

  if (!isOpen) return null;

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage("");
    setGeneratedCode("");

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/admin/invite-team`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus("success");
      setMessage(res.data.message || "Invitation sent successfully!");
      if (res.data.code) {
        setGeneratedCode(res.data.code);
      }
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
    setGeneratedCode("");
    setEmail("");
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div 
        className="max-w-md w-full bg-white rounded-xl overflow-hidden shadow-2xl border-2 border-purple-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
              <FaPaperPlane />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Invite Team Member</h3>
            <p className="text-sm text-gray-500">
              Send an invitation link to a content contributor.
            </p>
          </div>

          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  placeholder="colleague@example.com"
                  required
                />
              </div>
            </div>

            {/* Status Messages */}
            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                status === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                <p className="font-bold">{status === "success" ? "Success" : "Error"}</p>
                <p>{message}</p>
                {/* For debugging/dev convenience show code if returned */}
                {generatedCode && (
                  <div className="mt-2 pt-2 border-t border-green-200">
                    <span className="text-xs uppercase font-bold text-green-600">Generated Code:</span>
                    <span className="ml-2 font-mono bg-white px-2 py-0.5 rounded border border-green-200 select-all">{generatedCode}</span>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Send Invitation"}
            </button>

            {status === "success" && (
                <button
                    type="button"
                    onClick={handleClose}
                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg"
                >
                    Close
                </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default InviteTeamModal;
