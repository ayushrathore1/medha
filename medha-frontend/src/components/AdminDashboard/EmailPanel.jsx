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


export default function EmailPanel({ admin }) {
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
    hasUserReceivedCurrentEmail, initDeleteUser, loadVerificationReminderTemplate,
  } = admin;

  return (
    <>
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
    </>
  );
}
