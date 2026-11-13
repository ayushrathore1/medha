import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../AuthContext";
import AuthShell from "../components/Auth/AuthShell";
import { apiUrl } from "../config/api";
import { resolvePostAuthPath } from "../config/appMode";
import {
  needsAcademicProfile,
  PROFILE_BRANCHES,
  PROFILE_SEMESTERS,
} from "../lib/academicProfile";
import { usePageSeo } from "../hooks/usePageSeo";
import { hasSession } from "../config/access";

/**
 * Post-Google (or incomplete) signup — same college / branch / semester
 * fields as email registration step 2.
 */
const CompleteProfile = () => {
  usePageSeo({
    title: "Complete your profile",
    description: "Add your college, branch, and semester so Medha can personalize your desk.",
    path: "/complete-profile",
    noindex: true,
  });

  const { user, setUser, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextParam = searchParams.get("next");

  const [college, setCollege] = useState(user?.college || user?.university || "");
  const [branch, setBranch] = useState(user?.branch || "");
  const [semester, setSemester] = useState(user?.year || user?.semester || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasSession(user)) {
      navigate("/login", { replace: true });
      return;
    }
    if (!needsAcademicProfile(user)) {
      navigate(resolvePostAuthPath(user, nextParam), { replace: true });
    }
  }, [user, navigate, nextParam]);

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "1.5px solid #E5E5E5",
    borderRadius: 12,
    fontSize: 15,
    color: "#111111",
    background: "#F6F6F6",
    outline: "none",
    transition: "border-color 200ms, box-shadow 200ms",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    boxSizing: "border-box",
  };
  const inputFocus = (e) => {
    e.target.style.borderColor = "#111111";
    e.target.style.boxShadow = "0 0 0 3px rgba(17,17,17,0.08)";
    e.target.style.background = "white";
  };
  const inputBlur = (e) => {
    e.target.style.borderColor = "#E5E5E5";
    e.target.style.boxShadow = "none";
    e.target.style.background = "#F6F6F6";
  };
  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: "#9A9A9A",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: 6,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!college.trim() || !branch || !semester) {
      setError("College, branch, and current semester are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/api/users/me"), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          college: college.trim(),
          university: college.trim(),
          branch,
          year: semester,
          semester,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Failed to save. Please try again.");
        return;
      }

      const updated = {
        ...user,
        ...(data.user || {}),
        college: college.trim(),
        university: college.trim(),
        branch,
        year: semester,
        semester,
        needsProfile: false,
      };
      localStorage.setItem("user", JSON.stringify(updated));
      if (typeof setUser === "function") setUser(updated);
      else login(updated);
      navigate(resolvePostAuthPath(updated, nextParam), { replace: true });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!hasSession(user)) return null;

  const firstName = String(user?.name || "there").split(" ")[0];

  return (
    <AuthShell
      kicker="Almost there"
      titleLines={["Personalize your desk.", "One quick step."]}
      subtitle="We use college, branch, and semester to match syllabus, notes, and past papers."
    >
      <motion.div
        className="auth-form-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#111111",
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Welcome, {firstName}
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "#6B6B6B",
            marginTop: 8,
            marginBottom: 24,
          }}
        >
          Tell us where you study so Medha can personalize your experience.
        </p>

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#EF4444",
              marginBottom: 16,
              padding: "10px 14px",
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: 10,
            }}
          >
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>College *</label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="RTU Kota / Poornima College / ..."
              required
              style={inputStyle}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Branch *</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {PROFILE_BRANCHES.map((b) => (
                <button
                  key={b}
                  type="button"
                  className="chip-btn"
                  onClick={() => setBranch(b)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    background: branch === b ? "#111111" : "white",
                    color: branch === b ? "white" : "#6B6B6B",
                    border: `1.5px solid ${branch === b ? "#111111" : "#E5E5E5"}`,
                    cursor: "pointer",
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Current semester *</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 6,
              }}
            >
              {PROFILE_SEMESTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chip-btn"
                  onClick={() => setSemester(s)}
                  style={{
                    padding: "10px 0",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    textAlign: "center",
                    background: semester === s ? "#111111" : "white",
                    color: semester === s ? "white" : "#6B6B6B",
                    border: `1.5px solid ${semester === s ? "#111111" : "#E5E5E5"}`,
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "#F0FAF0",
              border: "1px solid rgba(125,198,122,0.3)",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 12,
              color: "#4A9E47",
              lineHeight: 1.5,
              marginBottom: 20,
            }}
          >
            ✦ Same details as email signup — used for syllabus, past papers, and
            lecture recommendations.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-shine"
            style={{
              width: "100%",
              padding: 16,
              background: loading ? "#9A9A9A" : "#111111",
              color: "#FFFFFF",
              borderRadius: 999,
              border: "none",
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Saving..." : "Continue to Medha"}
          </button>
        </form>
      </motion.div>
    </AuthShell>
  );
};

export default CompleteProfile;
