import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaInbox,
  FaEnvelopeOpen,
  FaBug,
  FaLightbulb,
  FaCircleCheck,
  FaClock,
  FaSpinner,
  FaTrash,
  FaXmark,
  FaFilter,
  FaArrowsRotate,
  FaPaperPlane,
  FaUser,
  FaArrowDownAZ,
  FaCalendarDays,
  FaMagnifyingGlass,
  FaWandMagicSparkles,
  FaEye,
  FaUsers,
  FaShieldHalved,
  FaUserMinus,
  FaPlus,
  FaMicrophone,
  FaCopy,
  FaCheck,
  FaUpload,
  FaFileAudio,
  FaCommentDots,
} from "react-icons/fa6";
import Card from "../components/Common/Card";
import Loader from "../components/Common/Loader";
import DeleteUserModal from "../components/Admin/DeleteUserModal";
import InviteTeamModal from "../components/Admin/InviteTeamModal";
import "../styles/responsive-pages.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  // Global Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFullAdmin, setIsFullAdmin] = useState(false); // True only for actual admins, not team members
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("messages"); // 'messages', 'email', 'history', 'team', 'transcribe', 'suggestions'

  // Suggestions State
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsStats, setSuggestionsStats] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsFilter, setSuggestionsFilter] = useState(""); // status filter

  // Transcription State
  const [audioFile, setAudioFile] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState(null);
  const [transcriptionError, setTranscriptionError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Messages State
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState({ status: "", type: "", isRead: "" });

  // Email System State
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [emailMode, setEmailMode] = useState("individual"); // 'all', 'individual', or 'unverified'
  const [selectedUser, setSelectedUser] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userSort, setUserSort] = useState("newest"); // 'name' or 'newest'
  const [universityFilter, setUniversityFilter] = useState(""); // University filter
  const [verificationFilter, setVerificationFilter] = useState(""); // 'verified', 'unverified', ''

  // AI Generator State
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatingAI, setGeneratingAI] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Email History State
  const [emailHistory, setEmailHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null); // For viewing recipients

  // Team & User Management State
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [deleteModalUser, setDeleteModalUser] = useState(null); // { id, name, email }
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  // Password Reset State
  const [resettingPassword, setResettingPassword] = useState(null); // email of user being reset

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/messages/check-admin`, {
        headers,
      });
      if (!res.data.isAdmin) {
        navigate("/dashboard");
        return;
      }
      setIsAdmin(true);
      setIsFullAdmin(res.data.isFullAdmin || false); // Track if user is a full admin
      fetchMessages();
      fetchStats();
      // We'll fetch users only when Email tab is active or pre-fetch now
      fetchStats();
      // We'll fetch users only when Email tab is active or pre-fetch now
      // We'll fetch users only when Email tab is active or pre-fetch now
      fetchUsers();
      fetchEmailHistory();
      fetchTeamMembers();
      fetchSuggestions();
    } catch (error) {
      navigate("/dashboard");
    }
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;
    setGeneratingAI(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/admin/generate-email`,
        { prompt: aiPrompt },
        { headers }
      );

      // Update both subject and body
      if (res.data.subject) setEmailSubject(res.data.subject);
      if (res.data.html) setEmailBody(res.data.html);

      setAiPrompt(""); // Clear prompt after success
    } catch (error) {
      console.error("Error generating with AI:", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setGeneratingAI(false);
    }
  };

  // ==================== MESSAGES LOGIC ====================
  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append("status", filter.status);
      if (filter.type) params.append("type", filter.type);
      if (filter.isRead) params.append("isRead", filter.isRead);

      const res = await axios.get(
        `${BACKEND_URL}/api/messages/admin/all?${params}`,
        { headers }
      );
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/messages/admin/stats`, {
        headers,
      });
      setStats(res.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `${BACKEND_URL}/api/messages/admin/${id}/read`,
        {},
        { headers }
      );
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${BACKEND_URL}/api/messages/admin/${id}/status`,
        { status },
        { headers }
      );
      fetchMessages();
      fetchStats();
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    try {
      await axios.delete(`${BACKEND_URL}/api/messages/admin/${id}`, {
        headers,
      });
      fetchMessages();
      fetchStats();
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "bug_report":
        return <FaBug className="text-red-500" />;
      case "feature_request":
        return <FaLightbulb className="text-yellow-500" />;
      case "feedback":
        return <FaEnvelopeOpen className="text-blue-500" />;
      default:
        return <FaInbox className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-400",
      in_progress: "bg-blue-500/20 text-blue-400",
      resolved: "bg-green-500/20 text-green-400",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status] || "bg-gray-500/20 text-gray-400"}`}
      >
        {(status || "").replace("_", " ").toUpperCase()}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: "bg-green-500",
      medium: "bg-yellow-500",
      high: "bg-red-500",
    };
    return (
      <span
        className={`w-2 h-2 rounded-full ${styles[priority] || "bg-gray-500"}`}
      ></span>
    );
  };

  // ==================== EMAIL SYSTEM LOGIC ====================
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/users`, {
        headers,
      });
      setUsers(res.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSendEmail = async () => {
    // Guard against double submissions
    if (sendingEmail) return;

    if (!emailSubject || !emailBody) {
      alert("Please provide both subject and body.");
      return;
    }
    if (emailMode === "individual" && !selectedUser) {
      alert("Please select a user to send the email to.");
      return;
    }

    // Different confirmation messages based on mode
    const recipientText =
      emailMode === "all"
        ? `ALL USERS (${users.length})`
        : emailMode === "unverified"
          ? `UNVERIFIED USERS (${getVerificationStats().unverified})`
          : selectedUser?.email;

    if (
      !window.confirm(
        `Are you sure you want to send this email to ${recipientText}?`
      )
    ) {
      return;
    }

    // Set sending state AFTER confirm but before API call
    setSendingEmail(true);
    try {
      await axios.post(
        `${BACKEND_URL}/api/admin/send-email`,
        {
          mode: emailMode,
          targetUserId: selectedUser?._id,
          subject: emailSubject,
          htmlBody: emailBody,
        },
        { headers }
      );

      alert("Email(s) sent successfully!");
      setEmailSubject("");
      setEmailBody("");
      // Refresh history after sending
      fetchEmailHistory();
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Check console for details.");
    } finally {
      setSendingEmail(false);
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

    // Verification Filter
    if (verificationFilter === "verified") {
      result = result.filter((u) => u.emailVerified === true);
    } else if (verificationFilter === "unverified") {
      result = result.filter((u) => !u.emailVerified);
    }

    // Sort
    if (userSort === "name") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else {
      // Newest
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  };

  // Get unique universities from users
  const getUniqueUniversities = () => {
    const universities = [
      ...new Set(users.map((u) => u.university).filter(Boolean)),
    ];
    return universities.sort();
  };

  // Get verification stats
  const getVerificationStats = () => {
    const verified = users.filter((u) => u.emailVerified === true).length;
    const unverified = users.filter((u) => !u.emailVerified).length;
    return { verified, unverified, total: users.length };
  };

  // Default email template for non-verified users
  const loadVerificationReminderTemplate = () => {
    setEmailSubject("Complete Your MEDHA Account Verification 🔐");
    setEmailBody(`<div style="font-family: 'Inter', Arial, sans-serif; background: #f8fafc; padding: 32px 24px; text-align: center;">
  <div style="background: #fff; border-radius: 16px; max-width: 500px; margin: auto; padding: 40px 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    <div style="font-size: 48px; margin-bottom: 16px;">📧</div>
    <h2 style="color: #1e293b; margin: 0 0 8px 0; font-size: 24px;">Complete Your Verification</h2>
    <p style="color: #4F46E5; font-size: 14px; margin: 0 0 24px 0; font-weight: 600;">MEDHA - Your AI Study Companion</p>
    
    <p style="color: #475569; font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
      Hey <b>{{name}}</b>! 👋<br><br>
      We noticed your MEDHA account isn't verified yet. Verify your email to unlock all features and keep your account secure!
    </p>
    
    <a href="https://medharevisionapp.pages.dev/verify-email" style="display: inline-block; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px; margin-bottom: 24px;">
      Verify My Email →
    </a>
    
    <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 24px 0 0 0;">
      If you're having trouble, just reply to this email.<br>
      We're always here to help! 💜
    </p>
    
    <hr style="margin: 24px 0; border: none; border-top: 1px solid #e2e8f0;">
    <p style="color: #94a3b8; font-size: 12px; margin: 0;">Team MEDHA 🎓</p>
  </div>
</div>`);
    setEmailMode("unverified");
  };

  const fetchEmailHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/history`, {
        headers,
      });
      setEmailHistory(res.data || []);
    } catch (error) {
      console.error("Error fetching email history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Check if a user has already received the current email being composed
  const hasUserReceivedCurrentEmail = (userEmail) => {
    if (!emailSubject || !emailBody || !userEmail) return false;

    // Find matching email in history by subject and body
    const matchingLog = emailHistory.find(
      (log) => log.subject === emailSubject && log.htmlBody === emailBody
    );

    if (!matchingLog || !matchingLog.recipients) return false;

    return matchingLog.recipients.includes(userEmail.toLowerCase());
  };

  // Handle password reset for a user (admin only)
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

  // ==================== TEAM & USER MANAGEMENT LOGIC ====================
  const fetchTeamMembers = async () => {
    setLoadingTeam(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/admin/team`, { headers });
      setTeamMembers(res.data || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoadingTeam(false);
    }
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
      setTeamMembers(
        teamMembers.filter((tm) => tm._id !== deleteModalUser._id)
      );
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
      const res = await axios.put(
        `${BACKEND_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers }
      );

      // Update local state
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );

      if (newRole === "user") {
        setTeamMembers(teamMembers.filter((tm) => tm._id !== userId));
      } else {
        fetchTeamMembers(); // Refresh team list to include new member details properly
      }

      alert(`Role updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating role:", error);
      alert(error.response?.data?.message || "Failed to update role.");
    }
  };

  // ==================== TRANSCRIPTION LOGIC ====================
  const handleAudioFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (25MB max)
      if (file.size > 25 * 1024 * 1024) {
        alert("File too large. Maximum size is 25MB.");
        return;
      }
      setAudioFile(file);
      setTranscriptionResult(null);
      setTranscriptionError(null);
    }
  };

  const handleTranscribe = async () => {
    if (!audioFile) {
      alert("Please select an audio file first.");
      return;
    }

    setIsTranscribing(true);
    setTranscriptionError(null);
    setTranscriptionResult(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioFile);

      const res = await axios.post(
        `${BACKEND_URL}/api/admin/transcribe`,
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
          timeout: 120000, // 2 minutes timeout
        }
      );

      if (res.data.success) {
        setTranscriptionResult(res.data);
      } else {
        setTranscriptionError(res.data.message || "Transcription failed");
      }
    } catch (error) {
      console.error("Transcription error:", error);
      setTranscriptionError(
        error.response?.data?.message ||
          "Failed to transcribe audio. Please try again."
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleCopyTranscription = async () => {
    if (transcriptionResult?.transcription) {
      try {
        await navigator.clipboard.writeText(transcriptionResult.transcription);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
        alert("Failed to copy to clipboard");
      }
    }
  };

  const clearTranscription = () => {
    setAudioFile(null);
    setTranscriptionResult(null);
    setTranscriptionError(null);
    // Reset file input
    const fileInput = document.getElementById("audio-file-input");
    if (fileInput) fileInput.value = "";
  };

  // ==================== SUGGESTIONS LOGIC ====================
  const fetchSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/suggestions/admin/all`, { headers });
      setSuggestions(res.data.suggestions || []);
      setSuggestionsStats(res.data.stats || null);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const updateSuggestion = async (id, data) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/suggestions/admin/${id}`, data, { headers });
      fetchSuggestions();
    } catch (error) {
      console.error("Error updating suggestion:", error);
    }
  };

  const deleteSuggestion = async (id) => {
    if (!window.confirm("Delete this suggestion?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/suggestions/admin/${id}`, { headers });
      fetchSuggestions();
    } catch (error) {
      console.error("Error deleting suggestion:", error);
    }
  };

  // ==================== RENDER ====================

  if (loading) return <Loader fullScreen />;
  if (!isAdmin) return null;

  return (
    <div
      className="min-h-screen pt-20 px-4 sm:px-6 pb-12"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header & Tabs */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Manage everything from here
            </p>
          </div>

          <div className="admin-tabs">
            <button
              onClick={() => setActiveTab("messages")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === "messages" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200"}`}
            >
              Messages & Feedback
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === "email" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200"}`}
            >
              Email Console
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === "history" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200"}`}
            >
              <FaClock className="inline mr-2" /> History
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === "team" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200"}`}
            >
              <FaUsers className="inline mr-2" /> Team
            </button>
            <button
              onClick={() => setActiveTab("transcribe")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === "transcribe" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200"}`}
            >
              <FaMicrophone className="inline mr-2" /> Transcribe
            </button>
            <button
              onClick={() => setActiveTab("suggestions")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === "suggestions" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200"}`}
            >
              <FaCommentDots className="inline mr-2" /> Suggestions
            </button>
          </div>
        </header>

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

        {/* ======================= MESSAGES TAB ======================= */}
        {activeTab === "messages" && (
          <>
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {/* ... (existing stats cards are fine, commonly white cards) ... */}
                <Card className="text-center p-4">
                  <div className="text-3xl font-bold text-purple-600">
                    {stats.total}
                  </div>
                  <div
                    className="text-sm text-gray-500"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Total
                  </div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.unread}
                  </div>
                  <div
                    className="text-sm text-gray-500"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Unread
                  </div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-3xl font-bold text-yellow-600">
                    {stats.pending}
                  </div>
                  <div
                    className="text-sm text-gray-500"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Pending
                  </div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-3xl font-bold text-orange-600">
                    {stats.featureRequests}
                  </div>
                  <div
                    className="text-sm text-gray-500"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Features
                  </div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-3xl font-bold text-red-600">
                    {stats.bugReports}
                  </div>
                  <div
                    className="text-sm text-gray-500"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Bugs
                  </div>
                </Card>
              </div>
            )}

            {/* Filters */}
            <Card className="mb-6 p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <FaFilter style={{ color: "var(--text-secondary)" }} />
                <select
                  value={filter.status}
                  onChange={(e) =>
                    setFilter({ ...filter, status: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg bg-bg-primary border outline-none focus:ring-1 focus:ring-purple-500"
                  style={{
                    borderColor: "var(--accent-secondary)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select
                  value={filter.type}
                  onChange={(e) =>
                    setFilter({ ...filter, type: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg bg-bg-primary border outline-none focus:ring-1 focus:ring-purple-500"
                  style={{
                    borderColor: "var(--accent-secondary)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">All Types</option>
                  <option value="feedback">Feedback</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="bug_report">Bug Report</option>
                  <option value="general">General</option>
                </select>
                <select
                  value={filter.isRead}
                  onChange={(e) =>
                    setFilter({ ...filter, isRead: e.target.value })
                  }
                  className="px-3 py-2 rounded-lg bg-bg-primary border outline-none focus:ring-1 focus:ring-purple-500"
                  style={{
                    borderColor: "var(--accent-secondary)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">All</option>
                  <option value="false">Unread</option>
                  <option value="true">Read</option>
                </select>
                <button
                  onClick={fetchMessages}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 shadow-sm"
                >
                  <FaArrowsRotate /> Refresh
                </button>
              </div>
            </Card>

            {/* Messages List */}
            <div className="space-y-3">
              {messages.length === 0 ? (
                <Card className="text-center py-12">
                  <FaInbox className="text-5xl mx-auto mb-4 opacity-50 text-gray-300" />
                  <p style={{ color: "var(--text-secondary)" }}>
                    No messages found
                  </p>
                </Card>
              ) : (
                messages.map((msg) => (
                  <Card
                    key={msg._id}
                    className={`cursor-pointer transition-all hover:shadow-md border ${!msg.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/30" : "border-gray-100"}`}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (!msg.isRead) markAsRead(msg._id);
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* ... (content same) ... */}
                      <div className="text-2xl">{getTypeIcon(msg.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="font-bold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {msg.userName}
                          </span>
                          <span
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            ({msg.userEmail})
                          </span>
                          {getPriorityBadge(msg.priority)}
                        </div>
                        <h3
                          className="font-semibold mb-1 truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {msg.subject}
                        </h3>
                        <p
                          className="text-sm truncate"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {msg.message}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {getStatusBadge(msg.status)}
                        <div
                          className="text-xs mt-2"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </>
        )}

        {/* ======================= EMAIL CONSOLE TAB ======================= */}
        {activeTab === "email" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80vh]">
            {/* Left Col: User List */}
            <Card className="lg:col-span-1 flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-[var(--border-default)]">
                <h2
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  <FaUser className="text-[var(--action-primary)]" /> Users (
                  {getFilteredUsers().length}/{users.length})
                </h2>

                {/* Verification Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-[var(--color-success-bg)]/20 rounded-lg p-2 text-center border border-[var(--color-success-bg)]/30">
                    <div className="text-lg font-bold text-[var(--color-success-text)]">
                      {getVerificationStats().verified}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      Verified
                    </div>
                  </div>
                  <div className="bg-[var(--color-danger-bg)]/20 rounded-lg p-2 text-center border border-[var(--color-danger-bg)]/30">
                    <div className="text-lg font-bold text-[var(--color-danger-text)]">
                      {getVerificationStats().unverified}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      Unverified
                    </div>
                  </div>
                  <div className="bg-[var(--action-primary)]/10 rounded-lg p-2 text-center border border-[var(--action-primary)]/20">
                    <div className="text-lg font-bold text-[var(--action-primary)]">
                      {getVerificationStats().total}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      Total
                    </div>
                  </div>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                  <FaMagnifyingGlass className="absolute left-3 top-3 text-[var(--text-tertiary)]" />
                  <input
                    type="text"
                    placeholder="Search name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border-default)] focus:outline-none focus:border-[var(--action-primary)] bg-[var(--bg-tertiary)] focus:bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors"
                  />
                </div>

                {/* University Filter */}
                <select
                  value={universityFilter}
                  onChange={(e) => setUniversityFilter(e.target.value)}
                  className="w-full mb-3 px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)] text-sm"
                >
                  <option value="">All Universities</option>
                  {getUniqueUniversities().map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                </select>

                {/* Verification Filter */}
                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  className="w-full mb-3 px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)] text-sm"
                >
                  <option value="">All Verification Status</option>
                  <option value="verified">✅ Verified Only</option>
                  <option value="unverified">❌ Unverified Only</option>
                </select>

                {/* Sort Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setUserSort("name")}
                    className={`flex-1 py-1 text-sm rounded border transition-colors ${userSort === "name" ? "bg-[var(--action-primary)]/10 text-[var(--action-primary)] border-[var(--action-primary)]/30" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-default)] hover:bg-[var(--bg-tertiary)]"}`}
                  >
                    <FaArrowDownAZ className="inline mr-1" /> Name
                  </button>
                  <button
                    onClick={() => setUserSort("newest")}
                    className={`flex-1 py-1 text-sm rounded border transition-colors ${userSort === "newest" ? "bg-[var(--action-primary)]/10 text-[var(--action-primary)] border-[var(--action-primary)]/30" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-default)] hover:bg-[var(--bg-tertiary)]"}`}
                  >
                    <FaCalendarDays className="inline mr-1" /> Newest
                  </button>
                </div>
              </div>

              {/* User List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-[var(--bg-primary)]/50">
                {loadingUsers ? (
                  <div className="flex justify-center py-8">
                    <FaSpinner className="animate-spin text-2xl text-[var(--action-primary)]" />
                  </div>
                ) : (
                  getFilteredUsers().map((user) => {
                    const alreadyReceived = hasUserReceivedCurrentEmail(
                      user.email
                    );
                    return (
                      <div
                        key={user._id}
                        onClick={() => {
                          setEmailMode("individual");
                          setSelectedUser(user);
                        }}
                        className={`p-3 rounded-lg cursor-pointer border transition-all ${selectedUser?._id === user._id && emailMode === "individual" ? "bg-[var(--bg-secondary)] border-[var(--action-primary)] shadow-sm ring-1 ring-[var(--action-primary)]" : alreadyReceived ? "bg-[var(--action-hover)]/10 border-[var(--action-hover)]/30" : "bg-[var(--bg-secondary)] border-[var(--border-default)] hover:border-[var(--action-primary)]/50 hover:shadow-sm"}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div
                            className="font-semibold text-sm truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {user.name}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {alreadyReceived && (
                              <span className="text-xs px-2 py-0.5 bg-[var(--action-hover)]/20 text-[var(--action-hover)] rounded-full font-medium">
                                ✓ Sent
                              </span>
                            )}
                            {user.emailVerified ? (
                              <span className="text-xs px-2 py-0.5 bg-[var(--color-success-bg)]/20 text-[var(--color-success-text)] rounded-full font-medium">
                                Verified
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 bg-[var(--color-danger-bg)]/20 text-[var(--color-danger-text)] rounded-full font-medium">
                                Unverified
                              </span>
                            )}
                          </div>
                        </div>
                        <div
                          className="text-xs truncate"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {user.email}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          {user.university && (
                            <div
                              className="text-xs font-medium"
                              style={{ color: "var(--action-primary)" }}
                            >
                              {user.university}
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePasswordReset(user.email, user.name);
                            }}
                            disabled={resettingPassword === user.email}
                            className="text-xs px-2 py-1 bg-[var(--color-warning-bg)]/20 hover:bg-[var(--color-warning-bg)]/30 text-[var(--color-warning-text)] rounded font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                            title="Send password reset link"
                          >
                            {resettingPassword === user.email ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              "🔑"
                            )}
                            Reset
                          </button>

                          {/* Role Button - Only show for full admins */}
                          {isFullAdmin && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (user.role === "team") {
                                  handleUpdateRole(user._id, "user");
                                } else {
                                  setInviteEmail(user.email);
                                  setInviteModalOpen(true);
                                }
                              }}
                              className={`text-xs px-2 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                                user.role === "team"
                                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                              title={
                                user.role === "team"
                                  ? "Demote to User"
                                  : "Invite to Team"
                              }
                            >
                              {user.role === "team" ? (
                                <FaShieldHalved />
                              ) : (
                                <FaPaperPlane className="text-[10px]" />
                              )}
                              {user.role === "team" ? "Team" : "Invite"}
                            </button>
                          )}

                          {/* Delete Button - Only show for full admins */}
                          {isFullAdmin && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                initDeleteUser(user);
                              }}
                              className="text-xs px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded font-medium transition-colors flex items-center gap-1"
                              title="Delete User"
                            >
                              <FaTrash size={10} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>

            {/* Right Col: Compose */}
            <Card className="lg:col-span-2 flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-[var(--border-default)] bg-[var(--bg-tertiary)]">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-[var(--text-primary)]">
                  <FaPaperPlane className="text-[var(--action-primary)]" />{" "}
                  Compose Email
                </h2>

                {/* Mode Toggle */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <label className="flex items-center cursor-pointer gap-2">
                    <input
                      type="radio"
                      name="mode"
                      checked={emailMode === "individual"}
                      onChange={() => setEmailMode("individual")}
                      className="accent-[var(--action-primary)] w-4 h-4"
                    />
                    <span className="font-medium text-[var(--text-secondary)]">
                      Single User
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer gap-2">
                    <input
                      type="radio"
                      name="mode"
                      checked={emailMode === "all"}
                      onChange={() => setEmailMode("all")}
                      className="accent-[var(--action-primary)] w-4 h-4"
                    />
                    <span className="font-medium text-[var(--text-secondary)]">
                      All Users
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer gap-2">
                    <input
                      type="radio"
                      name="mode"
                      checked={emailMode === "unverified"}
                      onChange={() => setEmailMode("unverified")}
                      className="accent-[var(--color-danger-bg)] w-4 h-4"
                    />
                    <span className="font-medium text-[var(--color-danger-text)]">
                      ❌ Unverified Only ({getVerificationStats().unverified})
                    </span>
                  </label>
                </div>

                {/* Quick Template Button for Unverified */}
                {emailMode === "unverified" && (
                  <button
                    onClick={loadVerificationReminderTemplate}
                    className="mb-4 px-4 py-2 bg-[var(--color-danger-bg)]/20 hover:bg-[var(--color-danger-bg)]/30 text-[var(--color-danger-text)] rounded-lg text-sm font-medium border border-[var(--color-danger-bg)]/30 transition-colors"
                  >
                    📧 Load Verification Reminder Template
                  </button>
                )}

                {/* Recipient Display */}
                <div className="mb-4">
                  <span className="font-medium mr-2 text-[var(--text-tertiary)]">
                    To:
                  </span>
                  {emailMode === "all" ? (
                    <span className="bg-[var(--action-primary)]/20 text-[var(--action-primary)] border border-[var(--action-primary)]/30 px-3 py-1 rounded text-sm font-bold">
                      ALL USERS ({users.length})
                    </span>
                  ) : emailMode === "unverified" ? (
                    <span className="bg-[var(--color-danger-bg)]/20 text-[var(--color-danger-text)] border border-[var(--color-danger-bg)]/30 px-3 py-1 rounded text-sm font-bold">
                      UNVERIFIED USERS ({getVerificationStats().unverified})
                    </span>
                  ) : selectedUser ? (
                    <span className="bg-[var(--action-hover)]/20 text-[var(--action-hover)] border border-[var(--action-hover)]/30 px-3 py-1 rounded text-sm font-bold">
                      {selectedUser.name} &lt;{selectedUser.email}&gt;
                    </span>
                  ) : (
                    <span className="text-[var(--color-danger-text)] italic text-sm">
                      Please select a user from the list
                    </span>
                  )}
                </div>

                {/* Subject Input */}
                <input
                  type="text"
                  placeholder="Subject..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full text-lg p-3 rounded border-none focus:ring-1 focus:ring-[var(--action-primary)] mb-0 font-medium"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
                  }}
                />
              </div>

              {/* AI Generator & Body Input */}
              <div
                className="flex-1 flex flex-col p-0 overflow-hidden"
                style={{ backgroundColor: "var(--bg-primary)" }}
              >
                {/* AI Prompt Bar */}
                <div className="p-3 flex gap-2 items-center border-b border-[var(--border-default)]">
                  <FaWandMagicSparkles className="text-[var(--color-warning-text)]" />
                  <input
                    type="text"
                    placeholder="Ask AI to write this email (e.g., 'Announce the new Chatbot feature')..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerateAI()}
                    className="flex-1 bg-transparent border-none text-sm focus:outline-none"
                    style={{ color: "var(--text-primary)" }}
                  />
                  <button
                    onClick={handleGenerateAI}
                    disabled={generatingAI || !aiPrompt}
                    className="px-3 py-1 bg-[var(--action-primary)] hover:bg-[var(--action-hover)] rounded text-xs font-bold text-white uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    {generatingAI ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      "Generate"
                    )}
                  </button>
                </div>

                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Paste your HTML email content here or ask AI to generate it..."
                  className="w-full flex-1 p-4 bg-transparent border-none resize-none focus:outline-none font-mono text-sm"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>

              {/* Footer Action */}
              <div
                className="p-4 border-t border-[var(--border-default)] flex justify-end items-center gap-3"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <div
                  className="text-xs italic"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {emailMode === "all"
                    ? "Note: Massive bulk operations may take time."
                    : "Preview before sending."}
                </div>

                <button
                  onClick={() => setShowPreview(true)}
                  disabled={!emailBody}
                  className="px-4 py-2 rounded-lg font-bold hover:shadow transition-colors disabled:opacity-50 flex items-center gap-2 border"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    borderColor: "var(--accent-secondary)",
                  }}
                >
                  <FaEye /> Preview
                </button>

                <button
                  onClick={handleSendEmail}
                  disabled={
                    sendingEmail ||
                    (emailMode === "individual" && !selectedUser) ||
                    !emailSubject
                  }
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sendingEmail ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPaperPlane />
                  )}
                  {sendingEmail ? "Sending..." : "Send Email"}
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* ======================= HISTORY TAB ======================= */}
      {activeTab === "history" && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-[var(--border-default)] flex justify-between items-center bg-[var(--bg-tertiary)]">
            <h2
              className="text-xl font-bold flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <FaClock className="text-[var(--action-primary)]" /> Sent Email
              History
            </h2>
            <button
              onClick={fetchEmailHistory}
              className="p-2 hover:bg-[var(--bg-primary)] rounded-full transition-colors"
              title="Refresh History"
            >
              <FaArrowsRotate
                className={
                  loadingHistory
                    ? "animate-spin text-[var(--action-primary)]"
                    : "text-[var(--text-tertiary)]"
                }
              />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Subject</th>
                  <th className="p-4 font-semibold text-center">Times Sent</th>
                  <th className="p-4 font-semibold text-center">Recipients</th>
                  <th className="p-4 font-semibold text-right">Last Sent</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {loadingHistory ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8 text-center text-[var(--text-tertiary)]"
                    >
                      <FaSpinner className="animate-spin inline text-2xl" />{" "}
                      Loading history...
                    </td>
                  </tr>
                ) : emailHistory.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8 text-center text-[var(--text-tertiary)] italic"
                    >
                      No email history found. Start sending emails to see logs
                      here.
                    </td>
                  </tr>
                ) : (
                  emailHistory.map((log) => (
                    <tr
                      key={log._id}
                      className="hover:bg-[var(--bg-tertiary)]/50 transition-colors"
                    >
                      <td
                        className="p-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {log.subject}
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-1 bg-[var(--action-hover)]/10 text-[var(--action-hover)] rounded-full text-xs font-bold">
                          {log.sentCount}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedHistoryItem(log)}
                          className="px-3 py-1 bg-[var(--color-success-bg)]/20 text-[var(--color-success-text)] hover:bg-[var(--color-success-bg)]/30 rounded-full text-xs font-bold transition-colors cursor-pointer"
                          title="Click to view recipients"
                        >
                          {log.recipients?.length || log.totalRecipients || 0}{" "}
                          📧
                        </button>
                      </td>
                      <td className="p-4 text-right text-sm text-[var(--text-tertiary)]">
                        {new Date(log.lastSentAt).toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEmailSubject(log.subject);
                              setEmailBody(log.htmlBody); // Load into state
                              setEmailMode("all"); // Default to dummy mode for preview
                              setShowPreview(true);
                            }}
                            className="text-[var(--action-primary)] hover:text-[var(--action-hover)] text-sm font-bold flex items-center gap-1"
                            title="Preview content"
                          >
                            <FaEye /> View
                          </button>
                          <button
                            onClick={() => {
                              setEmailSubject(log.subject);
                              setEmailBody(log.htmlBody);
                              setActiveTab("email"); // Switch to Compose tab
                              // Optional: specific mode setting if desired, currently stays as is or user sets it
                            }}
                            className="text-[var(--action-hover)] hover:text-[var(--action-primary)] text-sm font-bold flex items-center gap-1"
                            title="Load this template to Composer"
                          >
                            <FaPaperPlane className="transform rotate-12" /> Use
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Recipients Modal */}
      {selectedHistoryItem && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedHistoryItem(null)}
        >
          <div
            className="max-w-2xl w-full max-h-[80vh] flex flex-col bg-[var(--bg-primary)] rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="p-4 border-b text-white shadow-sm"
              style={{ backgroundColor: "var(--color-success-bg)" }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                    Email Recipients
                  </span>
                  <h3 className="text-lg font-bold truncate max-w-md">
                    {selectedHistoryItem.subject}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedHistoryItem(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaXmark />
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="p-4 border-b border-[var(--border-default)] bg-[var(--bg-tertiary)] flex gap-4">
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold text-[var(--color-success-text)]">
                  {selectedHistoryItem.recipients?.length || 0}
                </div>
                <div className="text-xs text-[var(--text-tertiary)]">
                  Delivered
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold text-[var(--text-secondary)]">
                  {users.length - (selectedHistoryItem.recipients?.length || 0)}
                </div>
                <div className="text-xs text-[var(--text-tertiary)]">
                  Not Received
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold text-[var(--action-primary)]">
                  {users.length}
                </div>
                <div className="text-xs text-[var(--text-tertiary)]">
                  Total Users
                </div>
              </div>
            </div>

            {/* Recipients List */}
            <div className="flex-1 overflow-y-auto p-4">
              {selectedHistoryItem.recipients &&
              selectedHistoryItem.recipients.length > 0 ? (
                <>
                  <h4 className="text-sm font-bold text-[var(--color-success-text)] mb-3 flex items-center gap-2">
                    <FaCheckCircle /> Received (
                    {selectedHistoryItem.recipients.length})
                  </h4>
                  <div className="space-y-2 mb-6">
                    {selectedHistoryItem.recipients.map((email, idx) => {
                      const user = users.find(
                        (u) => u.email?.toLowerCase() === email.toLowerCase()
                      );
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 bg-[var(--color-success-bg)]/10 rounded-lg border border-[var(--color-success-bg)]/20"
                        >
                          <FaCheckCircle className="text-[var(--color-success-text)] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate text-[var(--text-primary)]">
                              {user?.name || "Unknown"}
                            </div>
                            <div className="text-xs truncate text-[var(--text-tertiary)]">
                              {email}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Users who didn't receive */}
                  <h4 className="text-sm font-bold text-[var(--color-danger-text)] mb-3 flex items-center gap-2">
                    <FaXmark /> Not Received (
                    {
                      users.filter(
                        (u) =>
                          !selectedHistoryItem.recipients.includes(
                            u.email?.toLowerCase()
                          )
                      ).length
                    }
                    )
                  </h4>
                  <div className="space-y-2">
                    {users
                      .filter(
                        (u) =>
                          !selectedHistoryItem.recipients.includes(
                            u.email?.toLowerCase()
                          )
                      )
                      .map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center gap-3 p-2 bg-[var(--color-danger-bg)]/10 rounded-lg border border-[var(--color-danger-bg)]/20"
                        >
                          <FaXmark className="text-[var(--color-danger-bg)] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate text-[var(--text-primary)]">
                              {user.name}
                            </div>
                            <div className="text-xs truncate text-[var(--text-tertiary)]">
                              {user.email}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setEmailMode("individual");
                              setEmailSubject(selectedHistoryItem.subject);
                              setEmailBody(selectedHistoryItem.htmlBody);
                              setActiveTab("email");
                              setSelectedHistoryItem(null);
                            }}
                            className="px-2 py-1 bg-[var(--action-primary)] hover:bg-[var(--action-hover)] text-white text-xs rounded font-bold transition-colors"
                          >
                            Send
                          </button>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <div className="text-center text-[var(--text-tertiary)] py-8">
                  <p>No recipient data available for this email.</p>
                  <p className="text-sm mt-2">
                    Recipient tracking was added in a recent update.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--border-default)] bg-[var(--bg-tertiary)] flex justify-end">
              <button
                onClick={() => setSelectedHistoryItem(null)}
                className="px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-default)] text-[var(--text-secondary)] rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TEAM TAB ======================= */}
      {activeTab === "team" && (
        <Card className="p-6 min-h-[60vh]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2
                className="text-2xl font-bold flex items-center gap-2"
                style={{ color: "var(--text-primary)" }}
              >
                <FaShieldHalved className="text-purple-600" /> MEDHA Team
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>
                Manage team members who can help with content and verified
                resources.
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">
                {teamMembers.length}
              </div>
              <div className="text-xs text-gray-500">Active Members</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member._id}
                className="p-4 rounded-xl border-2 border-purple-100 bg-purple-50/30 flex items-start gap-4 relative group hover:border-purple-300 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 text-xl font-bold overflow-hidden">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{member.email}</p>

                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-purple-200 text-purple-800 rounded-full font-bold uppercase">
                      {member.role}
                    </span>
                    {member.university && (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full truncate max-w-[120px]">
                        {member.university}
                      </span>
                    )}
                  </div>
                </div>

                {isFullAdmin && (
                  <button
                    onClick={() => handleUpdateRole(member._id, "user")}
                    className="absolute top-2 right-2 p-2 bg-white text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                    title="Remove from Team"
                  >
                    <FaUserMinus />
                  </button>
                )}
              </div>
            ))}

            {/* Add Member Card - Only show for full admins */}
            {isFullAdmin && (
              <div
                className="p-4 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 min-h-[120px] cursor-pointer hover:border-purple-400 hover:text-purple-500 hover:bg-purple-50 transition-all"
                onClick={() => setInviteModalOpen(true)}
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2 group-hover:bg-purple-100 transition-colors">
                  <FaPlus />
                </div>
                <span className="font-bold text-sm">Add Team Member</span>
                <span className="text-xs mt-1">Send an invitation email</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ======================= TRANSCRIBE TAB ======================= */}
      {activeTab === "transcribe" && (
        <Card className="p-6 min-h-[60vh]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2
                className="text-2xl font-bold flex items-center gap-2"
                style={{ color: "var(--text-primary)" }}
              >
                <FaMicrophone className="text-purple-600" /> Audio Transcription
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>
                Upload an audio file in any language to get the transcription.
                Powered by Whisper AI.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  audioFile
                    ? "border-purple-400 bg-purple-50"
                    : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/30"
                }`}
              >
                <input
                  type="file"
                  id="audio-file-input"
                  accept="audio/*,.mp3,.wav,.m4a,.mp4,.webm,.ogg,.flac"
                  onChange={handleAudioFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {audioFile ? (
                  <div className="space-y-3">
                    <FaFileAudio className="mx-auto text-4xl text-purple-600" />
                    <div>
                      <p className="font-bold text-gray-900">
                        {audioFile.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearTranscription();
                      }}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FaUpload className="mx-auto text-4xl text-gray-400" />
                    <div>
                      <p className="font-bold text-gray-700">
                        Drop audio file here or click to browse
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Supports: MP3, WAV, M4A, MP4, WebM, OGG, FLAC (max 25MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-blue-800 mb-2">
                  🌍 Multi-language Support
                </h4>
                <p className="text-sm text-blue-700">
                  Whisper AI automatically detects the language and transcribes
                  in any language including Hindi, English, Spanish, French,
                  German, Chinese, Japanese, Arabic, and many more.
                </p>
              </div>

              <button
                onClick={handleTranscribe}
                disabled={!audioFile || isTranscribing}
                className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  !audioFile || isTranscribing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {isTranscribing ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Transcribing...
                  </>
                ) : (
                  <>
                    <FaMicrophone />
                    Transcribe Audio
                  </>
                )}
              </button>
            </div>

            {/* Result Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-700">
                  Transcription Result
                </h3>
                {transcriptionResult && (
                  <div className="flex items-center gap-2">
                    {transcriptionResult.language && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">
                        {transcriptionResult.language.toUpperCase()}
                      </span>
                    )}
                    {transcriptionResult.duration && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                        {transcriptionResult.duration}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div
                className={`relative min-h-[300px] rounded-xl border-2 p-4 ${
                  transcriptionError
                    ? "border-red-300 bg-red-50"
                    : transcriptionResult
                      ? "border-green-300 bg-green-50/30"
                      : "border-gray-200 bg-gray-50"
                }`}
              >
                {isTranscribing ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <FaSpinner className="text-4xl text-purple-600 animate-spin" />
                    <p className="text-gray-600 font-medium">
                      Processing audio...
                    </p>
                    <p className="text-sm text-gray-500">
                      This may take a minute for longer files
                    </p>
                  </div>
                ) : transcriptionError ? (
                  <div className="text-center py-8">
                    <FaXmark className="mx-auto text-4xl text-red-500 mb-3" />
                    <p className="text-red-700 font-medium">
                      {transcriptionError}
                    </p>
                  </div>
                ) : transcriptionResult ? (
                  <div className="h-full">
                    <pre className="whitespace-pre-wrap text-gray-800 font-sans text-sm leading-relaxed max-h-[400px] overflow-y-auto">
                      {transcriptionResult.transcription}
                    </pre>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <FaFileAudio className="text-4xl mb-3" />
                    <p>Transcription will appear here</p>
                  </div>
                )}
              </div>

              {transcriptionResult && (
                <button
                  onClick={handleCopyTranscription}
                  className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    copied
                      ? "bg-green-600 text-white"
                      : "bg-gray-800 text-white hover:bg-gray-900"
                  }`}
                >
                  {copied ? (
                    <>
                      <FaCheck />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <FaCopy />
                      Copy Transcription
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Email Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="max-w-4xl w-full max-h-[90vh] flex flex-col rounded-xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: "var(--bg-primary)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="p-4 border-b flex justify-between items-center"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-default)",
              }}
            >
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Email Preview
                </span>
                <h3
                  className="text-lg font-bold truncate max-w-md"
                  style={{ color: "var(--text-primary)" }}
                >
                  {emailSubject || "No Subject"}
                </h3>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 rounded-full transition-colors hover:bg-[var(--bg-tertiary)]"
              >
                <FaXmark style={{ color: "var(--text-secondary)" }} />
              </button>
            </div>

            {/* Modal Content - The actual email preview */}
            <div
              className="flex-1 overflow-y-auto flex justify-center py-8"
              style={{ backgroundColor: "var(--bg-tertiary)" }}
            >
              {/* Container for the email - acts as the email client viewport */}
              <div
                className="email-preview-content bg-white shadow-sm w-full max-w-[600px] min-h-[400px]"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                dangerouslySetInnerHTML={{
                  __html: emailBody
                    .replace(
                      /\$\{userName\}/g,
                      selectedUser?.name ||
                        (emailMode === "all" ? "Student" : "...")
                    )
                    .replace(
                      /{{name}}/g,
                      selectedUser?.name ||
                        (emailMode === "all" ? "Student" : "...")
                    ),
                }}
              />
            </div>

            <div
              className="p-3 border-t text-center text-xs"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-default)",
                color: "var(--text-secondary)",
              }}
            >
              Note: Actual rendering may vary slightly across different email
              clients.
            </div>
          </div>
        </div>
      )}

      {/* Message Detail Modal (For Messages Tab) */}
      {selectedMessage && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl"
            style={{ backgroundColor: "var(--bg-primary)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="p-6 border-b"
              style={{ borderColor: "var(--accent-secondary)" }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    {getTypeIcon(selectedMessage.type)}
                  </div>
                  <div>
                    <h2
                      className="text-xl font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {selectedMessage.subject}
                    </h2>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      From: {selectedMessage.userName} (
                      {selectedMessage.userEmail})
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedMessage(null)}>
                  <FaXmark style={{ color: "var(--text-secondary)" }} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex gap-2 mb-4 flex-wrap">
                {getStatusBadge(selectedMessage.status)}
                <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400">
                  {selectedMessage.type.replace("_", " ").toUpperCase()}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>

              <div
                className="p-4 rounded-lg mb-6"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <p
                  style={{
                    color: "var(--text-primary)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedMessage.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => updateStatus(selectedMessage._id, "pending")}
                  className="px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-600 text-sm font-medium"
                >
                  <FaClock className="inline mr-2" /> Pending
                </button>
                <button
                  onClick={() =>
                    updateStatus(selectedMessage._id, "in_progress")
                  }
                  className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-600 text-sm font-medium"
                >
                  <FaSpinner className="inline mr-2" /> In Progress
                </button>
                <button
                  onClick={() => updateStatus(selectedMessage._id, "resolved")}
                  className="px-4 py-2 rounded-lg bg-green-500/20 text-green-600 text-sm font-medium"
                >
                  <FaCheckCircle className="inline mr-2" /> Resolved
                </button>
                <button
                  onClick={() => deleteMessage(selectedMessage._id)}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-600 text-sm font-medium"
                >
                  <FaTrash className="inline mr-2" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* ======================= SUGGESTIONS TAB ======================= */}
        {activeTab === "suggestions" && (
          <SuggestionsTab
            suggestions={suggestions}
            stats={suggestionsStats}
            loading={loadingSuggestions}
            filter={suggestionsFilter}
            setFilter={setSuggestionsFilter}
            onRefresh={fetchSuggestions}
            onUpdate={updateSuggestion}
            onDelete={deleteSuggestion}
            headers={headers}
          />
        )}
    </div>
  );
};

/* ─── Suggestions Tab Content (rendered inside AdminDashboard) ─── */
const SuggestionsTab = ({ suggestions, stats, loading, filter, setFilter, onRefresh, onUpdate, onDelete, headers }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const getStatusColor = (status) => {
    const map = {
      new: "bg-blue-500/20 text-blue-600",
      noted: "bg-yellow-500/20 text-yellow-600",
      planned: "bg-purple-500/20 text-purple-600",
      done: "bg-green-500/20 text-green-600",
      wontdo: "bg-gray-500/20 text-gray-500",
    };
    return map[status] || "bg-gray-500/20 text-gray-500";
  };

  const getEmojiLabel = (emoji) => {
    const map = { "🔥": "fire", "💡": "idea", "🐛": "bug", "😤": "frustrated", "🙏": "request", "💜": "love" };
    return map[emoji] || "";
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const filtered = filter
    ? suggestions.filter((s) => s.status === filter)
    : suggestions;

  return (
    <>
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="text-center p-4 cursor-pointer" onClick={() => setFilter("")}>
            <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Total</div>
          </Card>
          <Card className="text-center p-4 cursor-pointer" onClick={() => setFilter("")}>
            <div className="text-3xl font-bold text-blue-600">{stats.unread}</div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Unread</div>
          </Card>
          <Card className="text-center p-4 cursor-pointer" onClick={() => setFilter("new")}>
            <div className="text-3xl font-bold text-cyan-600">{stats.new}</div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>New</div>
          </Card>
          <Card className="text-center p-4 cursor-pointer" onClick={() => setFilter("planned")}>
            <div className="text-3xl font-bold text-violet-600">{stats.planned}</div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Planned</div>
          </Card>
          <Card className="text-center p-4 cursor-pointer" onClick={() => setFilter("done")}>
            <div className="text-3xl font-bold text-green-600">{stats.done}</div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Done</div>
          </Card>
        </div>
      )}

      {/* Toolbar */}
      <Card className="mb-6 p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 items-center">
            <FaFilter style={{ color: "var(--text-secondary)" }} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border outline-none text-sm"
              style={{ borderColor: "var(--accent-secondary)", color: "var(--text-primary)", background: "var(--bg-primary)" }}
            >
              <option value="">All</option>
              <option value="new">New</option>
              <option value="noted">Noted</option>
              <option value="planned">Planned</option>
              <option value="done">Done</option>
              <option value="wontdo">Won't Do</option>
            </select>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold"
          >
            <FaArrowsRotate size={12} /> Refresh
          </button>
        </div>
      </Card>

      {/* List */}
      {loading ? (
        <div className="text-center py-12" style={{ color: "var(--text-tertiary)" }}>
          <FaSpinner className="animate-spin mx-auto mb-2" size={24} />
          Loading suggestions...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center p-12">
          <FaCommentDots size={32} className="mx-auto mb-3" style={{ color: "var(--text-tertiary)", opacity: 0.4 }} />
          <p className="font-semibold" style={{ color: "var(--text-secondary)" }}>No suggestions yet</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
            Share <b>yoursite.com/suggest</b> to start collecting feedback
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <Card key={s._id} className={`p-5 transition-all ${!s.isRead ? "border-l-4 border-l-purple-500" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Emoji + time */}
                  <div className="flex items-center gap-2 mb-2">
                    {s.emoji && (
                      <span className="text-lg" title={getEmojiLabel(s.emoji)}>{s.emoji}</span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatusColor(s.status)}`}>
                      {s.status?.toUpperCase()}
                    </span>
                    {!s.isRead && (
                      <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                    )}
                    <span className="text-xs ml-auto flex-shrink-0" style={{ color: "var(--text-tertiary)" }}>
                      {timeAgo(s.createdAt)}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-primary)" }}>
                    {s.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: "1px solid var(--border-default)" }}>
                {!s.isRead && (
                  <button
                    onClick={() => onUpdate(s._id, { isRead: true })}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <FaEye className="inline mr-1" /> Mark Read
                  </button>
                )}
                <select
                  value={s.status}
                  onChange={(e) => onUpdate(s._id, { status: e.target.value })}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border outline-none"
                  style={{ borderColor: "var(--border-default)", color: "var(--text-primary)", background: "var(--bg-primary)" }}
                >
                  <option value="new">New</option>
                  <option value="noted">Noted</option>
                  <option value="planned">Planned</option>
                  <option value="done">Done</option>
                  <option value="wontdo">Won't Do</option>
                </select>
                <button
                  onClick={() => onDelete(s._id)}
                  className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                >
                  <FaTrash className="inline mr-1" /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
