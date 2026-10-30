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


export default function TranscribePanel({ admin }) {
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
                  <FaCircleCheck className="inline mr-2" /> Resolved
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
    </>
  );
}
