"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (res.ok) setSent(true); else setError(data.error || "Failed to send reset email");
    } catch { setError("Network error"); } finally { setLoading(false); }
  };

  if (sent) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Check your email</h2>
        <p style={{ color: "var(--muted-foreground)", marginBottom: 24 }}>If an account exists for {email}, we sent a password reset link.</p>
        <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>← Back to login</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "var(--card)", borderRadius: 20, padding: 40, border: "1px solid var(--border)", maxWidth: 400, width: "100%" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Forgot password?</h2>
        <p style={{ color: "var(--muted-foreground)", marginBottom: 24, fontSize: 14 }}>Enter your email and we&apos;ll send a reset link.</p>
        {error && <div style={{ fontSize: 12, color: "var(--destructive)", marginBottom: 16, padding: "10px 14px", background: "rgba(239,68,68,0.06)", borderRadius: 10 }}>⚠ {error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@university.edu" required
            style={{ width: "100%", padding: "14px 16px", border: "1.5px solid var(--border)", borderRadius: 12, fontSize: 15, color: "var(--foreground)", background: "var(--secondary)", outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 16 }} />
          <button type="submit" disabled={loading} style={{ width: "100%", padding: 16, background: "var(--primary)", color: "white", borderRadius: 12, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14 }}>
          <Link href="/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>← Back to login</Link>
        </p>
      </div>
    </div>
  );
}
