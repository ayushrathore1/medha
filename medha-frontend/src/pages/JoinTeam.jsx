import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserPlus, FaSpinner, FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import Card from "../components/Common/Card";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const JoinTeam = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, success, error
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Check login
    if (!token) {
      // Redirect to login with return url
      // For now just storing intent? Or let them login and come back manually?
      // Better: navigate to login with state
      navigate("/login", { state: { returnUrl: `/join-team?${searchParams.toString()}` } });
      return;
    }

    // Pre-fill email from URL
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams, navigate, token]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/team/join`,
        { email, code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus("success");
      setMessage(res.data.message || "Welcome to the team!");
      
      // Update local storage user info if storing role?
      // Usually need to refresh profile or token. The token contains role? 
      // If token has role, user needs to relogin. If role is fetched from /me, it's fine.
      // Assuming role is checked from DB on critical actions.
      
      setTimeout(() => {
        navigate("/team-dashboard");
      }, 2000);

    } catch (error) {
      console.error("Verification failed:", error);
      setStatus("error");
      setMessage(error.response?.data?.message || "Verification failed. Please check your code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 flex items-center justify-center bg-[var(--bg-primary)]">
      <Card className="max-w-md w-full p-8 shadow-2xl border-t-4 border-purple-600">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <FaUserPlus />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Join the Team</h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Enter the 6-digit code sent to your email to verify your invitation.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center mb-6">
            <FaCircleCheck className="inline text-xl mb-1 mr-2" />
            <span className="font-bold block">Success!</span>
            {message}
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            {status === "error" && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm flex items-start gap-2">
                <FaCircleExclamation className="mt-0.5 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Your Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="yours@example.com"
                required
                readOnly={!!searchParams.get("email")} // Read-only if from link
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Invitation Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500 outline-none uppercase placeholder:tracking-normal"
                placeholder="XXXXXX"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Verify & Join Team"}
            </button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default JoinTeam;
