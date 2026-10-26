"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  ArrowUpDown,
  Calendar,
  Key,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserX,
  Plus,
  X,
  Mail,
  AlertTriangle,
  School,
  Lock
} from "lucide-react";

interface DirectoryUser {
  _id: string;
  name: string;
  email: string;
  university?: string;
  branch?: string;
  role: "user" | "team" | "admin";
  createdAt: string;
}

export default function TeamDashboardPage() {
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Filters & Searching
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"name" | "newest">("newest");
  const [selectedUniversity, setSelectedUniversity] = useState("");

  // Modals state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<DirectoryUser | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [resettingUserEmail, setResettingUserEmail] = useState<string | null>(null);

  // Access validation and data fetch
  const checkAccessAndFetch = useCallback(async () => {
    try {
      setLoading(true);
      const accessRes = await apiGet<{ hasAccess: boolean; isAdmin: boolean }>("/api/team/check");

      if (!accessRes.hasAccess) {
        router.push("/dashboard");
        return;
      }

      setIsAdmin(accessRes.isAdmin);

      // Load users
      const usersData = await apiGet<DirectoryUser[]>("/api/team/users");
      setUsers(usersData || []);
    } catch (err) {
      console.error("Access or fetch error:", err);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    checkAccessAndFetch();
  }, [isAuthenticated, router, checkAccessAndFetch]);

  // Filters logic
  const filteredUsers = () => {
    let result = [...users];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
      );
    }

    if (selectedUniversity) {
      result = result.filter((u) => u.university === selectedUniversity);
    }

    if (sortField === "name") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  };

  const getUniqueUniversities = () => {
    return Array.from(new Set(users.map((u) => u.university).filter(Boolean))).sort();
  };

  // Staff promotion / demotion trigger
  const handleUpdateRole = async (userId: string, newRole: "user" | "team" | "admin") => {
    if (!window.confirm(`Confirm setting student role to: ${newRole.toUpperCase()}?`)) return;

    try {
      await apiPut(`/api/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      alert(`User role updated to ${newRole.toUpperCase()} successfully!`);
    } catch (err) {
      console.error("Error setting role:", err);
      alert("Failed to update user role.");
    }
  };

  // Password reset trigger
  const handlePasswordReset = async (email: string, name: string) => {
    if (!window.confirm(`Trigger password reset sequence for: ${name}?`)) return;

    setResettingUserEmail(email);
    try {
      const res = await apiPost<{ message: string }>("/api/auth/admin/trigger-reset", { email });
      alert(`✅ Reset successful: ${res.message || "Reset link dispatched."}`);
    } catch (err: any) {
      console.error("Reset trigger error:", err);
      alert(`❌ Failed: ${err.message || "Error setting up reset link"}`);
    } finally {
      setResettingUserEmail(null);
    }
  };

  // Team Invite trigger
  const handleInviteTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || inviteLoading) return;

    setInviteLoading(true);
    try {
      await apiPost("/api/team/invite", { email: inviteEmail.trim() });
      alert(`Team invitation sent to ${inviteEmail} successfully!`);
      setInviteEmail("");
      setShowInviteModal(false);
    } catch (err: any) {
      console.error("Invitation dispatch error:", err);
      alert(`Failed: ${err.message || "Invitation error."}`);
    } finally {
      setInviteLoading(false);
    }
  };

  // Account deletion trigger
  const handleDeleteUser = async () => {
    if (!deleteTarget || deleteLoading) return;
    if (deleteConfirmText.toUpperCase() !== "DELETE") {
      alert("Please enter the confirmation keyword precisely.");
      return;
    }

    setDeleteLoading(true);
    try {
      await apiDelete(`/api/admin/users/${deleteTarget._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      setDeleteTarget(null);
      alert("User account permanently deleted.");
    } catch (err) {
      console.error("Account removal error:", err);
      alert("Failed to delete user account.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    );
  }

  const universityOptions = getUniqueUniversities();
  const listToRender = filteredUsers();

  const totalTeam = users.filter((u) => u.role === "team").length;
  const totalAdmin = users.filter((u) => u.role === "admin").length;

  return (
    <div style={{ maxWidth: 1000, margin: "24px auto", padding: "0 16px" }}>
      {/* Title block with invite action */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
            Campus Team Dashboard
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Manage academic content contributor credentials and browse student list
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setInviteEmail("");
              setShowInviteModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-[var(--primary)] hover:opacity-90 transition-all font-bold text-xs text-white flex items-center gap-1 cursor-pointer"
          >
            <Plus size={14} /> Add Contributor
          </button>
        )}
      </div>

      {/* Quick stats block */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <div className="text-xl font-black text-[var(--foreground)]">{users.length}</div>
          <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
            Total Students
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <div className="text-xl font-black text-purple-400">{totalTeam}</div>
          <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
            Staff Members
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
          <div className="text-xl font-black text-red-500">{totalAdmin}</div>
          <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
            Administrators
          </div>
        </div>
      </div>

      {/* Main filter & table columns grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
            <h3 className="font-bold text-xs text-[var(--foreground)] uppercase tracking-wider">
              Directory Filters
            </h3>

            {/* Search filter */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--secondary)]/30 border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            {/* University filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">
                University
              </label>
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--secondary)]/30 border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="">All Institutions</option>
                {universityOptions.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort toggles */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">
                Ordering
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortField("name")}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-xl border flex items-center justify-center gap-1 cursor-pointer ${
                    sortField === "name"
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-transparent text-[var(--muted-foreground)] border-[var(--border)]"
                  }`}
                >
                  <ArrowUpDown size={10} /> Alphabetical
                </button>
                <button
                  onClick={() => setSortField("newest")}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-xl border flex items-center justify-center gap-1 cursor-pointer ${
                    sortField === "newest"
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-transparent text-[var(--muted-foreground)] border-[var(--border)]"
                  }`}
                >
                  <Calendar size={10} /> Date Joined
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Directory Listing column */}
        <div className="lg:col-span-3 space-y-3">
          {listToRender.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)]">
              <Users size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">No students found matching filters</p>
            </div>
          ) : (
            listToRender.map((student) => {
              const isSelf = currentUser?._id === student._id;
              return (
                <div
                  key={student._id}
                  className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex flex-wrap justify-between items-center gap-4 hover:border-[var(--primary)]/30 transition-all"
                >
                  <div>
                    <h3 className="font-extrabold text-sm text-[var(--foreground)] flex items-center gap-1.5">
                      {student.name}
                      {isSelf && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--secondary)] text-[var(--primary)] font-bold uppercase tracking-wider">
                          YOU
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{student.email}</p>

                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {student.university && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 flex items-center gap-1">
                          <School size={10} /> {student.university}
                        </span>
                      )}

                      {student.role === "team" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/10 flex items-center gap-1">
                          <ShieldCheck size={10} /> Contributor
                        </span>
                      )}

                      {student.role === "admin" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/10 flex items-center gap-1">
                          <ShieldAlert size={10} /> Admin
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  {isAdmin && !isSelf && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Password Reset */}
                      <button
                        onClick={() => handlePasswordReset(student.email, student.name)}
                        disabled={resettingUserEmail === student.email}
                        className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/10 hover:bg-amber-500/20 transition disabled:opacity-50 cursor-pointer"
                        title="Trigger Password Reset Email"
                      >
                        {resettingUserEmail === student.email ? (
                          <div className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Key size={14} />
                        )}
                      </button>

                      {/* Promote Demote Staff */}
                      <button
                        onClick={() => {
                          if (student.role === "team") {
                            handleUpdateRole(student._id, "user");
                          } else {
                            handleUpdateRole(student._id, "team");
                          }
                        }}
                        className={`p-2 rounded-xl border transition cursor-pointer ${
                          student.role === "team"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/10 hover:bg-purple-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border-zinc-500/10 hover:bg-zinc-500/20"
                        }`}
                        title={student.role === "team" ? "Demote from Team" : "Promote to Contributor"}
                      >
                        <Shield size={14} />
                      </button>

                      {/* Delete Account */}
                      <button
                        onClick={() => {
                          setDeleteConfirmText("");
                          setDeleteTarget(student);
                        }}
                        className="p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/10 hover:bg-red-500/20 transition cursor-pointer"
                        title="Delete Student Permanently"
                      >
                        <UserX size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Invite Contributor modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[var(--border)] bg-[var(--secondary)]/30 flex justify-between items-center">
                <h3 className="font-bold text-sm text-[var(--foreground)] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[var(--primary)]" /> Add Contributor
                </h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-1 rounded-lg hover:bg-[var(--secondary)] cursor-pointer"
                >
                  <X size={16} className="text-[var(--muted-foreground)]" />
                </button>
              </div>

              <form onSubmit={handleInviteTeam} className="p-4 space-y-4">
                <p className="text-xs text-[var(--muted-foreground)]">
                  Invite students to get staff editing and content publishing privileges. They will receive an email instruction link.
                </p>

                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
                  />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter student email..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--secondary)]/30 border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={inviteLoading || !inviteEmail.trim()}
                  className="w-full py-2.5 rounded-xl bg-[var(--primary)] text-white font-bold text-xs hover:opacity-90 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1"
                >
                  {inviteLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Send Invitation"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete User Modal confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[var(--border)] bg-red-500/10 flex justify-between items-center text-red-500">
                <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle size={16} /> Dangerous Operation
                </h3>
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="p-1 rounded-lg hover:bg-[var(--secondary)] cursor-pointer"
                >
                  <X size={16} className="text-[var(--muted-foreground)]" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                  Are you absolutely certain you want to delete student account{" "}
                  <strong className="text-[var(--foreground)]">{deleteTarget.name}</strong> (
                  {deleteTarget.email})? This action is permanent and deletes all associated studies, flashcards, karma, and settings.
                </p>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">
                    Type <span className="text-red-500 font-extrabold">DELETE</span> to confirm
                  </label>
                  <div className="relative">
                    <Lock
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
                    />
                    <input
                      type="text"
                      required
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type keyword..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--secondary)]/30 border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleDeleteUser}
                  disabled={deleteLoading || deleteConfirmText.toUpperCase() !== "DELETE"}
                  className="w-full py-2.5 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1"
                >
                  {deleteLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Confirm Permanent Deletion"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
