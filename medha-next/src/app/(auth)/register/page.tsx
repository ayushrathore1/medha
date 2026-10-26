"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthLeftColumn from "@/components/auth/AuthLeftColumn";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await register({ name, email, password, college }); router.push("/dashboard"); }
    catch (err) { setError(err instanceof Error ? err.message : "Registration failed"); }
    finally { setLoading(false); }
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "14px 16px", border: "1.5px solid var(--border)", borderRadius: 12, fontSize: 15, color: "var(--foreground)", background: "var(--secondary)", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

  return (
    <div className="reg-grid" style={{ display: "grid", gridTemplateColumns: "55% 45%", minHeight: "100vh" }}>
      <style>{`@media(max-width:900px){.reg-grid{grid-template-columns:1fr !important}.reg-left{display:none !important}.reg-form-panel{padding:32px 20px !important}}`}</style>
      <div className="reg-left">
        <AuthLeftColumn preLabel="JOIN 149+ STUDENTS" headline1="Your semester." headline2="Simplified." subText="Smart notes, AI flashcards, RTU analysis — everything in one place." />
      </div>
      <div className="reg-form-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 48px", background: "var(--background)" }}>
        <div style={{ maxWidth: 400, width: "100%", margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>Create account</h2>
          <p style={{ color: "var(--muted-foreground)", marginBottom: 32 }}>Start acing your exams today 🚀</p>
          {error && <div style={{ padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, color: "#DC2626", fontSize: 13, marginBottom: 20 }}>{error}</div>}
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: "block" }}>Full name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required style={inputStyle} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: "block" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@university.edu" required style={inputStyle} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: "block" }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: "block" }}>College <span style={{ fontWeight: 400, color: "var(--muted-foreground)" }}>(optional)</span></label>
              <input type="text" value={college} onChange={e => setCollege(e.target.value)} placeholder="Your college name" style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", padding: 16, background: "var(--primary)", color: "white", borderRadius: 12, border: "none", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "Creating account..." : "Create account →"}</button>
          </form>
          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--muted-foreground)" }}>
            Already have an account? <Link href="/login" style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
