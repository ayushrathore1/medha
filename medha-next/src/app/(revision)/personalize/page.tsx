"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiPatch } from "@/lib/api";
import { motion } from "framer-motion";

const UNIVERSITIES = ["RTU", "GGSIPU", "DTU", "AKTU"];
const BRANCHES = ["CSE", "IT", "ECE", "EE", "ME", "Civil", "AIDS"];
const GENDERS = ["Male", "Female", "Other"];

export default function PersonalizePage() {
  const router = useRouter();
  const { user, updateUser, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    university: "",
    branch: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if user already has complete profile data
  useEffect(() => {
    if (!isAuthenticated) return;
    if (user?.university && user?.branch && user?.gender) {
      router.push("/dashboard");
    }
  }, [user, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.university || !formData.branch || !formData.gender) {
      setError("Please select all options to continue.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiPatch<{ user: any }>("/api/users/me", formData);
      updateUser(formData);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error saving personalization:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden bg-[var(--background)]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--primary)]/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#d46936]/10 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg my-12"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-[#d46936] rounded-2xl flex items-center justify-center text-white text-3xl font-extrabold mx-auto mb-4 shadow-lg shadow-[var(--primary)]/25">
            M
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--foreground)] mb-2">
            Let&apos;s Personalize Your Experience
          </h2>
          <p className="text-[var(--muted-foreground)] font-medium text-lg">
            Help us tailor Medha just for you.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xl shadow-[var(--primary)]/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl text-sm font-bold text-red-500 bg-red-500/5 border border-red-500/15 text-center">
                {error}
              </div>
            )}

            {/* University Selection */}
            <div>
              <label className="block mb-3 text-sm font-bold text-[var(--foreground)]">
                Select Your University
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {UNIVERSITIES.map((uni) => (
                  <button
                    key={uni}
                    type="button"
                    onClick={() => setFormData({ ...formData, university: uni })}
                    className={`px-3 py-2.5 rounded-xl border font-bold text-sm transition-all cursor-pointer ${
                      formData.university === uni
                        ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
                        : "bg-[var(--secondary)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:bg-[var(--secondary)]"
                    }`}
                  >
                    {uni}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, university: "Other" })}
                  className={`px-3 py-2.5 rounded-xl border font-bold text-sm transition-all cursor-pointer ${
                    formData.university === "Other" || (!UNIVERSITIES.includes(formData.university) && formData.university !== "")
                      ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
                      : "bg-[var(--secondary)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:bg-[var(--secondary)]"
                  }`}
                >
                  Other
                </button>
              </div>
              {(formData.university === "Other" || (!UNIVERSITIES.includes(formData.university) && formData.university !== "")) && (
                <input
                  type="text"
                  placeholder="Enter your university name"
                  value={formData.university === "Other" ? "" : formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value || "Other" })}
                  className="mt-3 w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] font-semibold text-sm outline-none focus:border-[var(--primary)]"
                />
              )}
            </div>

            {/* Branch Selection */}
            <div>
              <label className="block mb-3 text-sm font-bold text-[var(--foreground)]">
                Select Your Branch
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {BRANCHES.map((branch) => (
                  <button
                    key={branch}
                    type="button"
                    onClick={() => setFormData({ ...formData, branch })}
                    className={`px-2 py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      formData.branch === branch
                        ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
                        : "bg-[var(--secondary)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:bg-[var(--secondary)]"
                    }`}
                  >
                    {branch}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, branch: "Other" })}
                  className={`px-2 py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    formData.branch === "Other" || (!BRANCHES.includes(formData.branch) && formData.branch !== "")
                      ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
                      : "bg-[var(--secondary)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:bg-[var(--secondary)]"
                  }`}
                >
                  Other
                </button>
              </div>
              {(formData.branch === "Other" || (!BRANCHES.includes(formData.branch) && formData.branch !== "")) && (
                <input
                  type="text"
                  placeholder="Enter your branch name"
                  value={formData.branch === "Other" ? "" : formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value || "Other" })}
                  className="mt-3 w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] font-semibold text-sm outline-none focus:border-[var(--primary)]"
                />
              )}
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block mb-3 text-sm font-bold text-[var(--foreground)]">
                Select Your Gender
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {GENDERS.map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender })}
                    className={`px-3 py-2.5 rounded-xl border font-bold text-sm transition-all cursor-pointer ${
                      formData.gender === gender
                        ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
                        : "bg-[var(--secondary)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:bg-[var(--secondary)]"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[#d46936] hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-[var(--primary)]/20 transition-all border-none cursor-pointer disabled:opacity-50"
              >
                {loading ? "Saving..." : "Continue to Dashboard"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
