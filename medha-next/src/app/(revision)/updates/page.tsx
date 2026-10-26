"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiGet } from "@/lib/api";
import { motion } from "framer-motion";
import {
  History,
  Crown,
  Inbox,
  Bug,
  Lightbulb,
  ArrowRight,
  MessageSquare,
  Sparkles,
  ChevronRight
} from "lucide-react";

interface AdminStats {
  unread: number;
  pending: number;
  total: number;
  bugReports: number;
  featureRequests: number;
}

const updatesList = [
  {
    version: "2.9.0",
    date: "December 2025",
    title: "Notes Sharing Platform",
    features: [
      "📤 Upload and share notes with the community",
      "📥 Download notes shared by other students",
      "🔍 Search notes by subject, topic, or keyword",
      "⭐ Rate and review shared notes",
      "📚 Subject-wise organization for easy browsing",
    ],
  },
  {
    version: "2.8.0",
    date: "December 2025",
    title: "Admin Dashboard & Email System",
    features: [
      "📧 AI-powered email composer for admin broadcasts",
      "📊 Email history tracking with re-send capability",
      "👥 User management with individual/bulk messaging",
      "🎨 Refreshed UI with light theme consistency",
      "🔒 Enhanced security with balanced rate limiting",
    ],
  },
  {
    version: "2.7.0",
    date: "December 2025",
    title: "RTU Exam Paper Analysis",
    features: [
      "📝 Digital Electronics 2024 & 2025 paper analysis",
      "📊 Unit-wise marks distribution with weightage %",
      "🎯 98 marks breakdown (including optional questions)",
      "📖 Complete documentation for adding new papers",
      "🧮 KaTeX math equation rendering in solutions",
    ],
  },
  {
    version: "2.6.0",
    date: "December 2025",
    title: "WhatsApp-Style Messaging",
    features: [
      "💬 Real-time chat with admin support",
      "📢 Broadcast announcements to all users",
      "🔔 Notification badges for new messages",
      "👥 Admin contact list & user management",
    ],
  },
  {
    version: "2.5.0",
    date: "December 2025",
    title: "AI-Powered Exam Solutions",
    features: [
      "🤖 'Medha, solve it' - AI generates exam-ready solutions",
      "🌐 Real-time web search for current topics",
      "📊 Enhanced markdown rendering with tables & math equations",
      "💬 Chat history with session management",
    ],
  },
  {
    version: "2.0.0",
    date: "October 2025",
    title: "Medha AI Launch",
    features: [
      "🚀 Initial release of Medha AI study companion",
      "💬 AI chatbot for instant study assistance",
      "📚 Syllabus integration for RTU courses",
      "👤 User profiles and secure authentication",
    ],
  },
];

export default function UpdatesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTeam, setIsTeam] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkAccess = async () => {
      try {
        const adminRes = await apiGet<{ isAdmin: boolean }>("/api/messages/check-admin");
        if (adminRes.isAdmin) {
          setIsAdmin(true);
          const statsRes = await apiGet<{ stats: AdminStats }>("/api/messages/admin/stats");
          setAdminStats(statsRes.stats);
        }

        try {
          const teamRes = await apiGet<{ hasAccess: boolean }>("/api/team/check");
          if (teamRes.hasAccess) {
            setIsTeam(true);
          }
        } catch {
          // Not a team member
        }
      } catch (err) {
        console.error("Access validation error:", err);
      }
    };

    checkAccess();
  }, [isAuthenticated]);

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 16px" }}>
      {/* Admin Fast Access Card */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl border border-amber-500/25 bg-amber-500/5 mb-8 relative overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Crown className="text-amber-500 text-2xl flex-shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-amber-500 uppercase tracking-wider">
                  Admin System Panel
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  {adminStats
                    ? `${adminStats.unread} unread • ${adminStats.pending} pending items`
                    : "Loading administrative counters..."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {adminStats && (
                <div className="flex gap-2 text-[10px] font-bold">
                  <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/10">
                    <Inbox size={10} className="inline mr-1" /> {adminStats.total} total
                  </span>
                  <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 border border-red-500/10">
                    <Bug size={10} className="inline mr-1" /> {adminStats.bugReports} bugs
                  </span>
                  <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/10">
                    <Lightbulb size={10} className="inline mr-1" /> {adminStats.featureRequests} ideas
                  </span>
                </div>
              )}

              <button
                onClick={() => router.push("/admin")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer"
              >
                Launch Panel <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Team Access Redirect Card */}
      {isTeam && !isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl border border-purple-500/25 bg-purple-500/5 mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-purple-400 uppercase tracking-wider">
                Staff Privileged Portal
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Manage syllabus, public notes, custom lectures and verify study credentials
              </p>
            </div>
            <button
              onClick={() => router.push("/team-dashboard")}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer"
            >
              Enter Dashboard <ArrowRight size={12} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Header details */}
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[var(--primary)] to-indigo-400 bg-clip-text text-transparent tracking-tight mb-2">
          Updates & Announcements
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Follow the latest features, releases, and platform enhancements
        </p>
      </header>

      {/* Two Columns Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Changelog list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--primary)] to-indigo-600 text-white">
              <History size={16} />
            </div>
            <h2 className="font-bold text-base text-[var(--foreground)] uppercase tracking-wider">
              Medha Version History
            </h2>
          </div>

          <div className="space-y-4">
            {updatesList.map((update, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                key={idx}
                className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] relative overflow-hidden"
              >
                {idx === 0 && (
                  <span className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-[var(--primary)] to-orange-500 text-white text-[9px] font-extrabold rounded-bl-xl tracking-wider">
                    LATEST RELEASE
                  </span>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[var(--secondary)] text-[var(--primary)] border border-[var(--border)]">
                    v{update.version}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] font-semibold">
                    {update.date}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-[var(--foreground)] mb-3">
                  {update.title}
                </h3>

                <ul className="space-y-2 pl-1">
                  {update.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className="text-xs text-[var(--muted-foreground)] flex items-start gap-2 leading-relaxed"
                    >
                      <span className="text-[10px] mt-0.5">▪</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Support & Feedback cards */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <MessageSquare size={16} />
              </div>
              <h2 className="font-bold text-base text-[var(--foreground)] uppercase tracking-wider">
                Support & Ideas
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={22} />
              </div>
              <h3 className="font-bold text-sm text-[var(--foreground)] mb-2">
                Have a feature request or bug report?
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-6">
                Tell us how we can make your study flow even better! Send direct feedback to the Medha admin team.
              </p>

              <button
                onClick={() => router.push("/messages")}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                Open Messages <ChevronRight size={14} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
