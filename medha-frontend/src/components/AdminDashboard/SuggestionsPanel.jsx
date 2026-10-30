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


export default function SuggestionsPanel({ admin }) {
  const {
    suggestions,
    suggestionsStats,
    loadingSuggestions,
    suggestionsFilter,
    setSuggestionsFilter,
    fetchSuggestions,
    updateSuggestion,
    deleteSuggestion,
    headers,
  } = admin;

  return (
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
  );
}

function SuggestionsTab({ suggestions, stats, loading, filter, setFilter, onRefresh, onUpdate, onDelete, headers }) {
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
}

