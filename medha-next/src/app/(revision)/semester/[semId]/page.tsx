"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { apiGet } from "@/lib/api";

interface Subject { name: string; code: string; }

function SemesterContent() {
  const { semId } = useParams();
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (semId) {
      apiGet<{ subjects: Subject[] }>(`/api/semester/${semId}`)
        .then(d => setSubjects(d.subjects || []))
        .catch(() => {}).finally(() => setLoading(false));
    }
  }, [semId]);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  return (
    <div style={{ maxWidth: 800, margin: "32px auto", padding: "0 16px" }}>
      <button onClick={() => router.push("/dashboard")} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "var(--foreground)", marginBottom: 20 }}>← Back</button>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>📘 Semester {semId}</h1>
      <p style={{ color: "var(--muted-foreground)", marginBottom: 28 }}>CS / AIDS · RTU Syllabus</p>

      {subjects.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
          <p style={{ fontWeight: 600 }}>No subjects found</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {subjects.map((sub) => (
            <a key={sub.code} href={`/semester/${semId}/${sub.code}`}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderRadius: 14, background: "var(--card)", border: "1.5px solid var(--border)", textDecoration: "none", color: "var(--foreground)", transition: "all 250ms" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.transform = ""; }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{sub.name}</h3>
                <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{sub.code}</span>
              </div>
              <span style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>View →</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SemesterPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    }>
      <SemesterContent />
    </Suspense>
  );
}
