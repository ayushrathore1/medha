"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  UserPlus,
  UserCheck,
  Award,
  BookOpen,
  Calendar,
  Building2,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Users2,
  Bookmark,
  ChevronRight
} from "lucide-react";

const AVATARS = [
  "🐼", "🦊", "🦉", "🐯", "🦁", "🐺", "🐸", "🐵", "🐰", "🐻",
  "🦄", "🐲", "🦅", "🐧", "🦋", "🌟", "🚀", "🎨", "📚", "💡"
];

interface ProfileUser {
  _id: string;
  name: string;
  email?: string;
  avatar?: string;
  avatarIndex?: number;
  university?: string;
  branch?: string;
  gender?: string;
  karma?: number;
  rank?: string;
  role?: "user" | "team" | "admin";
  customFlair?: string;
  createdAt: string;
}

interface ProfileStats {
  notesShared: number;
  followers: number;
  following: number;
}

interface ProfileData {
  user: ProfileUser;
  stats: ProfileStats;
  isFollowing: boolean;
}

// Aura contribution tier calculator
const getAuraTier = (notesCount: number) => {
  if (notesCount >= 151) return { tier: "RADIANCE", rank: "Mentor", emoji: "🟣", color: "#a855f7", bg: "rgba(168, 85, 247, 0.15)" };
  if (notesCount >= 101) return { tier: "RADIANCE", rank: "Anchor", emoji: "🟣", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.15)" };
  if (notesCount >= 61) return { tier: "GLOW", rank: "Guide", emoji: "🔵", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" };
  if (notesCount >= 21) return { tier: "GLOW", rank: "Thinker", emoji: "🔵", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.15)" };
  if (notesCount >= 11) return { tier: "SPARK", rank: "Builder", emoji: "🌱", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" };
  if (notesCount >= 1) return { tier: "SPARK", rank: "Flicker", emoji: "🌱", color: "#22c55e", bg: "rgba(34, 197, 94, 0.15)" };
  return { tier: "SPARK", rank: "Newbie", emoji: "✨", color: "#eab308", bg: "rgba(234, 179, 8, 0.15)" };
};

function PublicProfileContent() {
  const { userId } = useParams();
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiGet<ProfileData>(`/api/users/profile/${userId}`);
      setProfile(res);
    } catch (err) {
      console.error("Error fetching public profile:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId, fetchProfile]);

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!profile || followLoading) return;

    setFollowLoading(true);
    try {
      if (profile.isFollowing) {
        await apiDelete(`/api/users/${userId}/follow`);
        setProfile((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            isFollowing: false,
            stats: {
              ...prev.stats,
              followers: Math.max(0, prev.stats.followers - 1),
            },
          };
        });
      } else {
        await apiPost(`/api/users/${userId}/follow`, {});
        setProfile((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            isFollowing: true,
            stats: {
              ...prev.stats,
              followers: prev.stats.followers + 1,
            },
          };
        });
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!profile || messageLoading) return;

    setMessageLoading(true);
    try {
      const res = await apiPost<{ conversation: { _id: string } }>("/api/chats/conversations", {
        recipientId: userId,
      });
      router.push(`/messages?chat=${res.conversation._id}`);
    } catch (err) {
      console.error("Error starting chat:", err);
    } finally {
      setMessageLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center p-8 bg-[var(--card)] border border-[var(--border)] rounded-2xl">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-xl font-bold mb-2 text-[var(--foreground)]">Student Not Found</h3>
        <p className="text-[var(--muted-foreground)] text-sm mb-6">
          This user profile could not be found or may have been deactivated.
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl bg-[var(--primary)] text-white font-semibold cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { user, stats, isFollowing } = profile;
  const isMe = currentUser && currentUser._id === user._id;
  const aura = getAuraTier(stats.notesShared);

  const getAvatar = (idx?: number) => {
    if (idx === undefined || idx === -1) return "🎓";
    return AVATARS[idx % AVATARS.length];
  };

  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div style={{ maxWidth: 800, margin: "32px auto", padding: "0 16px" }}>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-semibold text-sm transition-all mb-6 cursor-pointer"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Main Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] mb-6 relative overflow-hidden shadow-lg"
      >
        {/* Abstract glowing sphere in background */}
        <div
          className="absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: aura.color }}
        />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          {/* Avatar Area */}
          <div className="relative flex-shrink-0">
            <div
              className="w-28 h-28 rounded-3xl border-4 border-[var(--border)] flex items-center justify-center text-5xl shadow-md bg-gradient-to-br"
              style={{
                backgroundImage: `linear-gradient(135deg, ${aura.color}40, rgba(0,0,0,0.1))`,
              }}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-3xl"
                />
              ) : (
                getAvatar(user.avatarIndex)
              )}
            </div>

            {user.role && user.role !== "user" && (
              <span
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-md"
                style={{
                  backgroundColor: user.role === "admin" ? "#ef4444" : "#3b82f6",
                }}
              >
                {user.role}
              </span>
            )}
          </div>

          {/* User Info details */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
                  {user.name}
                </h1>
                {user.customFlair && (
                  <p className="text-xs font-semibold text-[var(--primary)] mt-0.5">
                    ✨ {user.customFlair}
                  </p>
                )}
                <p className="text-sm text-[var(--muted-foreground)] mt-1 flex items-center justify-center md:justify-start gap-1">
                  <Building2 size={14} />
                  {user.university || "University Scholar"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-center">
                {isMe ? (
                  <button
                    onClick={() => router.push("/profile")}
                    className="px-5 py-2 rounded-xl bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--border)] font-semibold text-xs border border-[var(--border)] transition-all cursor-pointer"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isFollowing
                          ? "bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--border)]"
                          : "bg-[var(--primary)] text-white hover:opacity-90 shadow-sm"
                      }`}
                    >
                      {followLoading ? (
                        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : isFollowing ? (
                        <>
                          <UserCheck size={14} /> Following
                        </>
                      ) : (
                        <>
                          <UserPlus size={14} /> Follow
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleStartChat}
                      disabled={messageLoading}
                      className="px-4 py-2 rounded-xl bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--border)] font-semibold text-xs border border-[var(--border)] transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {messageLoading ? (
                        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <MessageSquare size={14} /> Message
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-[var(--border)] max-w-md mx-auto md:mx-0">
              <div className="text-center md:text-left">
                <div className="text-xl font-black text-[var(--foreground)]">
                  {stats.followers}
                </div>
                <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                  Followers
                </div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-xl font-black text-[var(--foreground)]">
                  {stats.following}
                </div>
                <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                  Following
                </div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-xl font-black text-[var(--foreground)]">
                  {stats.notesShared}
                </div>
                <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                  Notes Shared
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Aura Tier & Contribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Aura Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] relative overflow-hidden"
        >
          {/* Neon glow gradient */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 10% 10%, ${aura.color} 0%, transparent 60%)`,
            }}
          />

          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2.5 rounded-xl text-white flex items-center justify-center"
              style={{ backgroundColor: aura.color }}
            >
              <Award size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                Medha Aura
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider"
                  style={{ backgroundColor: aura.bg, color: aura.color }}
                >
                  {aura.tier}
                </span>
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">Study Contribution Standing</p>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 my-3">
            <span className="text-4xl font-black text-[var(--foreground)]">
              {user.karma || stats.notesShared * 10}
            </span>
            <span className="text-xs font-bold text-[var(--muted-foreground)]">Karma Points</span>
          </div>

          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border"
            style={{
              borderColor: `${aura.color}30`,
              backgroundColor: `${aura.color}08`,
              color: aura.color,
            }}
          >
            <span>{aura.emoji}</span>
            <span>
              Rank: {user.rank || aura.rank} ({stats.notesShared} files shared)
            </span>
          </div>
        </motion.div>

        {/* Academic Details Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-500 flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[var(--foreground)]">Academic Background</h3>
              <p className="text-xs text-[var(--muted-foreground)]">Campus Details</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
              <span className="text-xs text-[var(--muted-foreground)] font-medium">Branch / Course</span>
              <span className="text-xs font-bold text-[var(--foreground)]">
                {user.branch || "Not Configured"}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
              <span className="text-xs text-[var(--muted-foreground)] font-medium">Joined Medha</span>
              <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1">
                <Calendar size={12} className="text-[var(--primary)]" />
                {formattedDate}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-[var(--muted-foreground)] font-medium">Profile Integrity</span>
              <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-0.5 text-emerald-500">
                <Sparkles size={11} /> Verified Student
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function PublicProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    }>
      <PublicProfileContent />
    </Suspense>
  );
}
