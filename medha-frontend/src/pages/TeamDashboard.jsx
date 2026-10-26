import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaMagnifyingGlass,
  FaArrowDownAZ,
  FaCalendarDays,
  FaSpinner,
  FaBook,
  FaLightbulb,
  FaCloudArrowUp,
  FaShieldHalved,
  FaPaperPlane,
  FaUsers,
  FaTrash,
} from "react-icons/fa6";
import Card from "../components/Common/Card";
import Loader from "../components/Common/Loader";
import Button from "../components/Common/Button";
import DeleteUserModal from "../components/Admin/DeleteUserModal";
import InviteTeamModal from "../components/Admin/InviteTeamModal";
import { AuthContext } from "../AuthContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeamDashboard = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users"); // 'users' or 'content'
  const [isAdmin, setIsAdmin] = useState(false); // Track if current user is admin

  // User Directory State
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userSort, setUserSort] = useState("newest");
  const [universityFilter, setUniversityFilter] = useState("");

  // Team & User Management State
  const [deleteModalUser, setDeleteModalUser] = useState(null); // { id, name, email }
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [resettingPassword, setResettingPassword] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    checkTeamAndFetch();
  }, []);

  const checkTeamAndFetch = async () => {
    try {
      // First check if user has team access
      const checkRes = await axios.get(`${BACKEND_URL}/api/team/check`, {
        headers,
      });

      if (!checkRes.data.hasAccess) {
        console.error("No team access");
        navigate("/dashboard");
        return;
      }

      // Set admin status
      setIsAdmin(checkRes.data.isAdmin || checkRes.data.role === "admin");

      // Fetch users using team endpoint
      const res = await axios.get(`${BACKEND_URL}/api/team/users`, { headers });
      setUsers(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Access denied:", error);
      navigate("/dashboard");
    }
  };

  const getFilteredUsers = () => {
    let result = [...users];

    // Search
    if (userSearch) {
      const lowerQ = userSearch.toLowerCase();
      result = result.filter(
        (u) =>
          (u.name && u.name.toLowerCase().includes(lowerQ)) ||
          (u.email && u.email.toLowerCase().includes(lowerQ))
      );
    }

    // University Filter
    if (universityFilter) {
      result = result.filter((u) => u.university === universityFilter);
    }

    // Sort
    if (userSort === "name") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  };

  const getUniqueUniversities = () => {
    return [...new Set(users.map((u) => u.university).filter(Boolean))].sort();
  };

  const initDeleteUser = (user) => {
    setDeleteModalUser(user);
    setDeleteConfirmation("");
  };

  const handleDeleteUser = async () => {
    if (!deleteModalUser) return;
    if (deleteConfirmation !== "DELETE") {
      alert("Please type DELETE to confirm.");
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(
        `${BACKEND_URL}/api/admin/users/${deleteModalUser._id}`,
        { headers }
      );
      setUsers(users.filter((u) => u._id !== deleteModalUser._id));
      setDeleteModalUser(null);
      alert("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.message || "Failed to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    if (
      !window.confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    )
      return;

    try {
      await axios.put(
        `${BACKEND_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers }
      );

      // Update local state
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );

      alert(`Role updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating role:", error);
      alert(error.response?.data?.message || "Failed to update role.");
    }
  };

  const handlePasswordReset = async (email, userName) => {
    if (!window.confirm(`Send password reset link to ${userName} (${email})?`))
      return;

    setResettingPassword(email);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/auth/admin/trigger-reset`,
        { email },
        { headers }
      );
      alert(`✅ ${res.data.message}`);
    } catch (error) {
      console.error("Error sending reset:", error);
      alert(`❌ Failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setResettingPassword(null);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div
      className="min-h-screen pt-20 px-4 sm:px-6 pb-12"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto">
        <InviteTeamModal
          isOpen={inviteModalOpen}
          onClose={() => {
            setInviteModalOpen(false);
            setInviteEmail(""); // Reset email on close
          }}
          token={token}
          initialEmail={inviteEmail}
        />

        <DeleteUserModal
          isOpen={!!deleteModalUser}
          onClose={() => setDeleteModalUser(null)}
          onConfirm={handleDeleteUser}
          userName={deleteModalUser?.name}
          confirmText={deleteConfirmation}
          setConfirmText={setDeleteConfirmation}
          isDeleting={isDeleting}
        />

        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-2">
              Team Dashboard
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Manage content and view community members
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === "users" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200"}`}
            >
              <FaUser className="inline mr-2" /> Users
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === "content" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200"}`}
            >
              <FaBook className="inline mr-2" /> Content
            </button>
          </div>
        </header>

        {activeTab === "users" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters */}
            <Card className="lg:col-span-1 p-4 h-fit">
              <h2 className="font-bold mb-4 text-[var(--text-primary)]">
                Filters
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <FaMagnifyingGlass className="absolute left-3 top-3 text-[var(--text-tertiary)]" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)]"
                  />
                </div>

                <select
                  value={universityFilter}
                  onChange={(e) => setUniversityFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)]"
                >
                  <option value="">All Universities</option>
                  {getUniqueUniversities().map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => setUserSort("name")}
                    className={`flex-1 py-2 text-sm rounded border ${userSort === "name" ? "bg-[var(--action-primary)]/10 text-[var(--action-primary)] border-[var(--action-primary)]/30" : "border-[var(--border-default)] text-[var(--text-secondary)]"}`}
                  >
                    <FaArrowDownAZ className="inline mr-1" /> Name
                  </button>
                  <button
                    onClick={() => setUserSort("newest")}
                    className={`flex-1 py-2 text-sm rounded border ${userSort === "newest" ? "bg-[var(--action-primary)]/10 text-[var(--action-primary)] border-[var(--action-primary)]/30" : "border-[var(--border-default)] text-[var(--text-secondary)]"}`}
                  >
                    <FaCalendarDays className="inline mr-1" /> Newest
                  </button>
                </div>
              </div>
            </Card>

            {/* User List */}
            <div className="lg:col-span-3 space-y-3">
              {getFilteredUsers().map((user) => (
                <div
                  key={user._id}
                  className="p-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] flex flex-wrap justify-between items-center gap-4"
                >
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)]">
                      {user.name}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {user.email}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {user.university && (
                        <span className="text-xs px-2 py-0.5 bg-[var(--action-primary)]/10 text-[var(--action-primary)] rounded-full">
                          {user.university}
                        </span>
                      )}
                      {user.role === "team" && (
                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-bold">
                          TEAM MEMBER
                        </span>
                      )}
                      {(user.role === "admin" || user.isAdmin) && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-bold">
                          ADMIN
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Admin-only actions */}
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handlePasswordReset(user.email, user.name)
                        }
                        disabled={resettingPassword === user.email}
                        className="text-xs px-3 py-1.5 bg-[var(--color-warning-bg)]/20 hover:bg-[var(--color-warning-bg)]/30 text-[var(--color-warning-text)] rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        {resettingPassword === user.email ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          "🔑"
                        )}{" "}
                        Reset
                      </button>

                      <button
                        onClick={() => {
                          if (user.role === "team") {
                            handleUpdateRole(user._id, "user");
                          } else {
                            setInviteEmail(user.email);
                            setInviteModalOpen(true);
                          }
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                          user.role === "team"
                            ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {user.role === "team" ? (
                          <FaShieldHalved />
                        ) : (
                          <FaPaperPlane className="text-[10px]" />
                        )}
                        {user.role === "team" ? "Demote" : "Invite Team"}
                      </button>

                      <button
                        onClick={() => initDeleteUser(user)}
                        className="text-xs px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg font-medium transition-colors flex items-center gap-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className="p-8 text-center border-dashed border-2 border-[var(--border-default)] hover:border-[var(--action-primary)] transition-all cursor-pointer group"
              onClick={() => navigate("/notes")}
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 transition-transform">
                <FaCloudArrowUp />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                Upload Public Notes
              </h3>
              <p className="text-[var(--text-secondary)]">
                Share study materials with the community.
              </p>
            </Card>

            <Card
              className="p-8 text-center border-dashed border-2 border-[var(--border-default)] hover:border-[var(--action-primary)] transition-all cursor-pointer group"
              onClick={() => navigate("/learn")}
            >
              <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 transition-transform">
                <FaLightbulb />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                Manage Learning Concepts
              </h3>
              <p className="text-[var(--text-secondary)]">
                Create and edit educational content.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDashboard;
