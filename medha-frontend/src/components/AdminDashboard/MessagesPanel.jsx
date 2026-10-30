import React from "react";
import axios from "axios";
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
import Card from "../Common/Card";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export default function MessagesPanel({ admin }) {
  const {
    activeTab, getTypeIcon, getStatusBadge, getPriorityBadge, getFilteredUsers, getUniqueUniversities, getVerificationStats,
    fetchMessages, markAsRead, updateStatus, deleteMessage,
    stats, messages, selectedMessage, setSelectedMessage, filter, setFilter,
    users, loadingUsers, emailMode, setEmailMode, selectedUser, setSelectedUser,
    emailSubject, setEmailSubject, emailBody, setEmailBody, sendingEmail,
    userSearch, setUserSearch, userSort, setUserSort, universityFilter,
    setUniversityFilter, verificationFilter, setVerificationFilter,
    aiPrompt, setAiPrompt, generatingAI, showPreview, setShowPreview,
    handleGenerateAI, handleSendEmail, isFullAdmin, handlePasswordReset,
    resettingPassword, emailHistory, loadingHistory, selectedHistoryItem,
    setSelectedHistoryItem, teamMembers, loadingTeam, setDeleteModalUser,
    setInviteModalOpen, setInviteEmail, handleUpdateRole, audioFile,
    isTranscribing, transcriptionResult, transcriptionError, copied,
    handleAudioFileChange, handleTranscribe, handleCopyTranscription,
    suggestions, suggestionsStats, loadingSuggestions, suggestionsFilter,
    setSuggestionsFilter, fetchSuggestions, updateSuggestion, deleteSuggestion,
    headers, token,
  } = admin;

  return (
    <>
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
    </>
  );
}
