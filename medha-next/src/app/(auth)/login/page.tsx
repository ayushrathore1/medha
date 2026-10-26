"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthLeftColumn from "@/components/auth/AuthLeftColumn";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await login(email, password); router.push("/dashboard"); }
    catch (err) { setError(err instanceof Error ? err.message : "Login failed"); }
    finally { setLoading(false); }
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "14px 16px", border: "1.5px solid var(--border)", borderRadius: 12, fontSize: 15, color: "var(--foreground)", background: "var(--secondary)", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

  return (
    <div className="login-grid" style={{ display: "grid", gridTemplateColumns: "55% 45%", minHeight: "100vh" }}>
      <style>{`@media(max-width:900px){.login-grid{grid-template-columns:1fr !important}.login-left{display:none !important}.login-form-panel{padding:32px 20px !important}}`}</style>
      <div className="login-left">
        <AuthLeftColumn preLabel="EXAM SEASON IS HERE" headline1="Stop scrolling." headline2="Start studying." subText="The students who pass aren't smarter. They just knew what to study." />
      </div>
      <div className="login-form-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 48px", background: "var(--background)" }}>
        <div style={{ maxWidth: 400, width: "100%", margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>Welcome back</h2>
          <p style={{ color: "var(--muted-foreground)", marginBottom: 32 }}>Your exam prep is waiting ⚡</p>
          {error && <div style={{ padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, color: "#DC2626", fontSize: 13, marginBottom: 20 }}>{error}</div>}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: "block" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@university.edu" required style={inputStyle} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: "block" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required minLength={6} style={inputStyle} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>{showPw ? "🙈" : "👁️"}</button>
              </div>
            </div>
            <div style={{ textAlign: "right", marginBottom: 24 }}>
              <Link href="/forgot-password" style={{ fontSize: 13, color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", padding: 16, background: "var(--primary)", color: "white", borderRadius: 12, border: "none", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "Signing in..." : "Sign in →"}</button>
          </form>
          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--muted-foreground)" }}>
            Don&apos;t have an account? <Link href="/register" style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
