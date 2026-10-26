import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Page Not Found</h1>
      <p style={{ color: "var(--muted-foreground)", marginBottom: 24, maxWidth: 400 }}>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link href="/" style={{ padding: "12px 24px", background: "var(--primary)", color: "white", borderRadius: 12, textDecoration: "none", fontWeight: 600 }}>← Back to Home</Link>
    </div>
  );
}
