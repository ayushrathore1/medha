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


export default function HistoryPanel({ admin }) {
  const {
    activeTab, getTypeIcon, getStatusBadge, getPriorityBadge, getFilteredUsers, getUniqueUniversities, getVerificationStats,
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
    headers, token, fetchEmailHistory, fetchTeamMembers, fetchUsers, fetchStats,
  } = admin;

  return (
    <>
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
    </>
  );
}
