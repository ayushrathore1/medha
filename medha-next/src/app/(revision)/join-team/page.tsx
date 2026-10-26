"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiPost } from "@/lib/api";
import { motion } from "framer-motion";
import { UserPlus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function JoinTeamContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?returnUrl=/join-team?${searchParams.toString()}`);
      return;
    }

    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams, router, isAuthenticated]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await apiPost<{ message: string }>("/api/team/join", { email, code });
      setStatus("success");
      setMessage(res.message || "Welcome to the team!");

      setTimeout(() => {
        router.push("/team-dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Verification failed:", error);
      setStatus("error");
      setMessage(error.message || "Verification failed. Please check your code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-[var(--background)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xl shadow-[var(--primary)]/5"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">
            <UserPlus size={24} />
          </div>
          <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">Join the Team</h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-2 font-semibold">
            Enter the 6-digit code sent to your email to verify your team invitation.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-emerald-500/5 border border-emerald-500/15 text-emerald-500 p-4 rounded-xl text-center mb-6">
            <CheckCircle2 className="inline text-xl mb-1.5 mr-2 animate-bounce" size={20} />
            <span className="font-extrabold block text-sm">Success!</span>
            <p className="text-xs mt-1">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            {status === "error" && (
              <div className="bg-red-500/5 border border-red-500/15 text-red-500 p-3 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="mt-0.5 shrink-0" size={14} />
                <span className="font-semibold">{message}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--foreground)]">Your Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-sm outline-none focus:border-[var(--primary)]"
                placeholder="yours@college.edu"
                required
                readOnly={!!searchParams.get("email")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--foreground)]">Invitation Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3.5 text-center text-xl tracking-[0.5em] font-mono rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] focus:border-[var(--primary)] outline-none uppercase placeholder:tracking-normal font-extrabold"
                placeholder="XXXXXX"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full py-3 bg-[var(--primary)] hover:opacity-95 text-white font-extrabold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Verify & Join Team"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function JoinTeamPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--background)]">
        <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    }>
      <JoinTeamContent />
    </Suspense>
  );
}
