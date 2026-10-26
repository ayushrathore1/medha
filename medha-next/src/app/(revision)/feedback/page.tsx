"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiPost } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MessageSquare, Bug, Lightbulb, Heart, Send, CheckCircle } from "lucide-react";

export default function FeedbackPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    category: "general",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setLoading(true);
    setError("");

    try {
      // Direct POST to backend suggestions
      await apiPost("/api/suggestions", formData);
      setSuccess(true);
      setFormData((prev) => ({ ...prev, message: "" }));
    } catch (err: any) {
      console.error("Feedback submit error:", err);
      setError("Failed to send feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 max-w-5xl mx-auto flex flex-col justify-center">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-semibold text-sm transition-all mb-6 cursor-pointer self-start"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold uppercase tracking-wider mb-3">
          <Heart size={14} className="text-red-500 animate-pulse" /> Feedback & Suggestions
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-[var(--foreground)] tracking-tight mb-2">Help Us Improve Medha</h1>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-md mx-auto">
          Your feedback shapes the future of MEDHA. Let us know what features you want or bugs you found.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Category descriptions */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
            <h3 className="font-extrabold text-base text-[var(--foreground)] mb-4">Feedback Channels</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 flex-shrink-0">
                  <Bug size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[var(--foreground)]">Bug Reports</h4>
                  <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed mt-0.5">Found a layout issue, typo, or broken feature? Report it directly.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                  <Lightbulb size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[var(--foreground)]">Feature Ideas</h4>
                  <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed mt-0.5">Have cool ideas to improve study tools or e-commerce? Share them!</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] flex-shrink-0">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[var(--foreground)]">General Feedback</h4>
                  <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed mt-0.5">Tell us about your overall pair-programming and study experience.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[var(--secondary)] text-[11px] text-[var(--muted-foreground)] leading-relaxed border border-[var(--border)]">
              <strong>💬 Need direct support?</strong> You can also send direct messages to the Medha admin team inside the direct messaging tab.
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-2">
          <div className="p-6 md:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-10"
                >
                  <CheckCircle className="mx-auto text-emerald-500 mb-4 animate-bounce" size={48} />
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Thank You for Your Feedback!</h3>
                  <p className="text-xs text-[var(--muted-foreground)] mb-6 max-w-sm mx-auto">
                    We appreciate your input and will use it to make MEDHA a better revision portal for college students.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2 rounded-xl bg-[var(--secondary)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--foreground)] text-xs font-bold transition-all cursor-pointer"
                  >
                    Send Another Response
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {error && (
                    <div className="p-3 rounded-lg text-xs font-bold bg-red-500/5 border border-red-500/15 text-red-500 text-center">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[var(--foreground)]">Your Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] text-sm outline-none focus:border-[var(--primary)]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[var(--foreground)]">Email (Optional)</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@college.edu"
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] text-sm outline-none focus:border-[var(--primary)]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--foreground)]">Feedback Category</label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { key: "general", label: "💬 General" },
                        { key: "bug", label: "🐛 Bug Report" },
                        { key: "feature", label: "💡 Feature Suggestion" },
                      ].map((cat) => (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat.key })}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            formData.category === cat.key
                              ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-sm"
                              : "bg-[var(--secondary)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--foreground)]">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please write your detailed feedback or bug description here..."
                      required
                      rows={6}
                      className="w-full p-4 rounded-xl bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] text-sm outline-none focus:border-[var(--primary)] resize-vertical"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !formData.message.trim()}
                    className="w-full py-3 rounded-xl bg-[var(--foreground)] text-[var(--card)] hover:opacity-90 disabled:opacity-50 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border-none transition-all"
                  >
                    {loading ? (
                      <div className="w-3.5 h-3.5 border-2 border-[var(--card)] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={12} />
                    )}
                    Send Feedback
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
