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


export default function TeamPanel({ admin }) {
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
                <span className="font-bold text-sm">Invite Team Member</span>
                <span className="text-xs mt-1">Send an invitation email</span>
              </div>
            )}
          </div>

          {isFullAdmin ? (
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Assign team role</h3>
              <p className="mb-4 text-sm text-gray-600">
                Super-admin only. Promote a registered user to <strong>team</strong> so they can manage
                curriculum (semesters, subjects, units, topics, notes/links). They cannot assign roles.
              </p>
              <div className="mb-3">
                <input
                  type="search"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users by name or email"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                />
              </div>
              <div className="max-h-80 space-y-2 overflow-y-auto">
                {(getFilteredUsers ? getFilteredUsers() : users)
                  .filter((u) => u.role === "user" || !u.role)
                  .slice(0, 40)
                  .map((u) => (
                    <div
                      key={u._id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">{u.name}</p>
                        <p className="truncate text-xs text-gray-500">{u.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUpdateRole(u._id, "team")}
                        className="shrink-0 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-700"
                      >
                        Make team member
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <p className="mt-8 text-sm text-gray-500">
              Team members can edit curriculum. Only a super-admin can invite or promote users.
            </p>
          )}
        </Card>
      )}

      {/* ======================= TRANSCRIBE TAB ======================= */}
    </>
  );
}
