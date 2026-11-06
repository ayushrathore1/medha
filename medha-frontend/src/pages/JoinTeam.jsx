import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUserPlus,
  FaSpinner,
  FaCircleCheck,
  FaCircleExclamation,
} from "react-icons/fa6";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const JoinTeam = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const emailParam = searchParams.get("email") || "";

  useEffect(() => {
    if (!token) {
      navigate("/login", {
        state: { returnUrl: `/join-team?${searchParams.toString()}` },
      });
    }
  }, [searchParams, navigate, token]);

  const handleJoin = async (e) => {
    e?.preventDefault?.();
    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/team/join`,
        { email: emailParam },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus("success");
      setMessage(res.data.message || "Welcome to the team!");

      try {
        const raw = localStorage.getItem("user");
        if (raw) {
          const user = JSON.parse(raw);
          user.role = res.data.role || "team";
          user.isAdmin = true;
          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch {
        /* ignore */
      }

      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (error) {
      console.error("Join failed:", error);
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          "Could not join the team. Ask an admin to invite this email again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-4 pt-20">
      <div className="w-full max-w-md rounded-2xl border border-[#e8e8e8] bg-white p-8 shadow-[0_12px_40px_rgba(17,17,17,0.06)]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f8ee] text-[#1ba34a]">
            <FaUserPlus size={22} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#111]">
            Join the Medha team
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#5a5a5a]">
            Admin already approved you — no invite code. Confirm with the same
            email that received the invite.
          </p>
          {emailParam ? (
            <p className="mt-3 rounded-full bg-[#f4f4f2] px-3 py-1.5 text-xs font-semibold text-[#111]">
              {emailParam}
            </p>
          ) : null}
        </div>

        {status === "success" ? (
          <div className="rounded-xl border border-[#b7e4c4] bg-[#e8f8ee] p-4 text-center text-[#14532d]">
            <FaCircleCheck className="mb-1 inline text-xl" />
            <p className="font-bold">You&apos;re in</p>
            <p className="text-sm">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleJoin} className="space-y-4">
            {status === "error" ? (
              <div className="flex items-start gap-2 rounded-xl border border-[#fecaca] bg-[#fff5f5] p-3 text-sm text-[#be123c]">
                <FaCircleExclamation className="mt-0.5 shrink-0" />
                <span>{message}</span>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Accept team access"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default JoinTeam;
