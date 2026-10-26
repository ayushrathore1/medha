import React, { useState } from "react";
import axios from "axios";
import { FaPencil, FaFloppyDisk, FaArrowUpRightFromSquare, FaLock } from "react-icons/fa6";
import useAuthGuard from "../../hooks/useAuthGuard";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const QuestionAILinks = ({ 
  question, 
  subjectName, 
  year, 
  isAdmin,
  onLinksUpdated 
}) => {
  const { isAuthenticated, requireAuth } = useAuthGuard();
  const [isEditing, setIsEditing] = useState(false);
  const [editChatgptLink, setEditChatgptLink] = useState(question.chatgptLink || "");
  const [editClaudeLink, setEditClaudeLink] = useState(question.claudeLink || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const trimmedChatgptLink = editChatgptLink?.trim() || null;
      const trimmedClaudeLink = editClaudeLink?.trim() || null;

      await axios.put(
        `${BACKEND_URL}/api/rtu/subjects/${encodeURIComponent(subjectName)}/years/${year}/questions/${encodeURIComponent(question.qCode)}/ai-links`,
        {
          chatgptLink: trimmedChatgptLink,
          claudeLink: trimmedClaudeLink,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsEditing(false);
      onLinksUpdated && onLinksUpdated();
    } catch (error) {
      console.error("Error saving AI links:", error);
      alert("Failed to save links. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditChatgptLink(question.chatgptLink || "");
    setEditClaudeLink(question.claudeLink || "");
    setIsEditing(false);
  };

  if (isAdmin && isEditing) {
    return (
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[var(--text-tertiary)]">ChatGPT Link</label>
          <input
            type="url"
            value={editChatgptLink}
            onChange={(e) => setEditChatgptLink(e.target.value)}
            placeholder="https://chatgpt.com/share/..."
            className="px-2 py-1 text-xs bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--action-primary)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[var(--text-tertiary)]">Claude Link</label>
          <input
            type="url"
            value={editClaudeLink}
            onChange={(e) => setEditClaudeLink(e.target.value)}
            placeholder="https://claude.ai/share/..."
            className="px-2 py-1 text-xs bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--action-primary)]"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1 px-3 py-1 text-xs font-bold bg-[var(--action-primary)] text-white rounded hover:bg-[var(--action-hover)] transition-colors disabled:opacity-50"
          >
            <FaFloppyDisk size={10} /> {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-3 py-1 text-xs font-bold bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded hover:bg-[var(--bg-tertiary)] transition-colors border border-[var(--border-default)]"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {/* ChatGPT Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (question.chatgptLink) {
            requireAuth(() => {
              window.open(question.chatgptLink, '_blank', 'noopener,noreferrer');
            }, 'AI Solutions');
          }
        }}
        disabled={!question.chatgptLink}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white transition-all shadow-sm ${
          question.chatgptLink
            ? 'bg-gradient-to-r from-[#74AA9C] to-[#5a9485] hover:from-[#5a9485] hover:to-[#4a7d6f] hover:shadow-md cursor-pointer'
            : 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-50'
        }`}
        title={question.chatgptLink ? "Open ChatGPT conversation" : "ChatGPT link not available"}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
        </svg>
        ChatGPT
        {question.chatgptLink && (isAuthenticated ? <FaArrowUpRightFromSquare size={8} /> : <FaLock size={8} className="text-yellow-300" />)}
      </button>

      {/* Claude Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (question.claudeLink) {
            requireAuth(() => {
              window.open(question.claudeLink, '_blank', 'noopener,noreferrer');
            }, 'AI Solutions');
          }
        }}
        disabled={!question.claudeLink}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white transition-all shadow-sm ${
          question.claudeLink
            ? 'bg-gradient-to-r from-[#d97757] to-[#c15f3c] hover:from-[#c15f3c] hover:to-[#a84d2a] hover:shadow-md cursor-pointer'
            : 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-50'
        }`}
        title={question.claudeLink ? "Open Claude conversation" : "Claude link not available"}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5 3C19.433 3 21 4.567 21 6.5v11c0 1.933-1.567 3.5-3.5 3.5h-11C4.567 21 3 19.433 3 17.5v-11C3 4.567 4.567 3 6.5 3h11zm-5.5 4a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zm-4 3a1 1 0 0 0-1 1v5a1 1 0 0 0 2 0v-5a1 1 0 0 0-1-1zm8 0a1 1 0 0 0-1 1v5a1 1 0 0 0 2 0v-5a1 1 0 0 0-1-1z"/>
        </svg>
        Claude
        {question.claudeLink && (isAuthenticated ? <FaArrowUpRightFromSquare size={8} /> : <FaLock size={8} className="text-yellow-300" />)}
      </button>

      {/* Admin Edit Button */}
      {isAdmin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="flex items-center gap-1 px-2 py-1 text-xs font-bold bg-[var(--bg-secondary)] text-[var(--text-tertiary)] rounded hover:bg-[var(--bg-tertiary)] transition-colors border border-[var(--border-default)]"
          title="Edit AI links"
        >
          <FaPencil size={10} /> Edit Links
        </button>
      )}
    </div>
  );
};

export default QuestionAILinks;
