import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaInbox,
  FaEnvelopeOpen,
  FaBug,
  FaLightbulb,
} from "react-icons/fa6";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function useAdminDashboard() {
  const navigate = useNavigate();
  // Global Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFullAdmin, setIsFullAdmin] = useState(false); // True only for actual admins, not team members
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("curriculum"); // curriculum | notes-review | email | history | team | transcribe

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
        timeout: 15000,
      });
      if (!res.data.isAdmin) {
        setLoading(false);
        navigate("/subjects");
        return;
      }
      setIsAdmin(true);
      setIsFullAdmin(res.data.isFullAdmin || false);
      await Promise.allSettled([
        fetchUsers(),
        fetchEmailHistory(),
        fetchTeamMembers(),
      ]);
    } catch (error) {
      navigate("/subjects");
    } finally {
      setLoading(false);
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

  return {
    isAdmin,
    isFullAdmin,
    loading,
    activeTab,
    setActiveTab,
    suggestions,
    suggestionsStats,
    loadingSuggestions,
    suggestionsFilter,
    setSuggestionsFilter,
    audioFile,
    isTranscribing,
    transcriptionResult,
    transcriptionError,
    copied,
    messages,
    stats,
    selectedMessage,
    setSelectedMessage,
    filter,
    setFilter,
    users,
    loadingUsers,
    emailMode,
    setEmailMode,
    selectedUser,
    setSelectedUser,
    emailSubject,
    setEmailSubject,
    emailBody,
    setEmailBody,
    sendingEmail,
    userSearch,
    setUserSearch,
    userSort,
    setUserSort,
    universityFilter,
    setUniversityFilter,
    verificationFilter,
    setVerificationFilter,
    aiPrompt,
    setAiPrompt,
    generatingAI,
    showPreview,
    setShowPreview,
    emailHistory,
    loadingHistory,
    selectedHistoryItem,
    setSelectedHistoryItem,
    teamMembers,
    loadingTeam,
    deleteModalUser,
    setDeleteModalUser,
    deleteConfirmation,
    setDeleteConfirmation,
    isDeleting,
    inviteModalOpen,
    setInviteModalOpen,
    inviteEmail,
    setInviteEmail,
    resettingPassword,
    token,
    headers,
    getTypeIcon,
    getStatusBadge,
    getPriorityBadge,
    getFilteredUsers,
    getUniqueUniversities,
    getVerificationStats,
    fetchMessages,
    markAsRead,
    updateStatus,
    deleteMessage,
    handleGenerateAI,
    fetchStats,
    fetchUsers,
    handleSendEmail,
    fetchEmailHistory,
    handlePasswordReset,
    fetchTeamMembers,
    handleDeleteUser,
    handleUpdateRole,
    handleAudioFileChange,
    handleTranscribe,
    handleCopyTranscription,
    clearTranscription,
    hasUserReceivedCurrentEmail,
    initDeleteUser,
    loadVerificationReminderTemplate,
    fetchSuggestions,
    updateSuggestion,
    deleteSuggestion,
  };
}
