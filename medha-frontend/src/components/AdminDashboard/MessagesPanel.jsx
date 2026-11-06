import React from "react";
import { FaInbox, FaFilter, FaArrowsRotate } from "react-icons/fa6";

export default function MessagesPanel({ admin }) {
  const {
    activeTab,
    getTypeIcon,
    getStatusBadge,
    getPriorityBadge,
    fetchMessages,
    markAsRead,
    stats,
    messages,
    setSelectedMessage,
    filter,
    setFilter,
  } = admin;

  return (
    <>
        {activeTab === "messages" && (
          <>
            {stats && (
              <div className="admin-msg-stats">
                <div className="admin-msg-stat">
                  <strong>{stats.total}</strong>
                  <span>Total</span>
                </div>
                <div className="admin-msg-stat admin-msg-stat--blue">
                  <strong>{stats.unread}</strong>
                  <span>Unread</span>
                </div>
                <div className="admin-msg-stat admin-msg-stat--amber">
                  <strong>{stats.pending}</strong>
                  <span>Pending</span>
                </div>
                <div className="admin-msg-stat admin-msg-stat--orange">
                  <strong>{stats.featureRequests}</strong>
                  <span>Features</span>
                </div>
                <div className="admin-msg-stat admin-msg-stat--rose">
                  <strong>{stats.bugReports}</strong>
                  <span>Bugs</span>
                </div>
              </div>
            )}

            <div className="admin-msg-filters">
              <FaFilter className="admin-msg-filter-icon" aria-hidden />
              <select
                value={filter.status}
                onChange={(e) =>
                  setFilter({ ...filter, status: e.target.value })
                }
                className="admin-msg-select"
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
                className="admin-msg-select"
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
                className="admin-msg-select"
              >
                <option value="">All</option>
                <option value="false">Unread</option>
                <option value="true">Read</option>
              </select>
              <button
                type="button"
                onClick={fetchMessages}
                className="desk-solid-btn admin-msg-refresh"
              >
                <FaArrowsRotate /> Refresh
              </button>
            </div>

            <div className="admin-msg-list">
              {messages.length === 0 ? (
                <div className="admin-msg-empty">
                  <FaInbox />
                  <p>No messages found</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <button
                    type="button"
                    key={msg._id}
                    className={`admin-msg-row${!msg.isRead ? " is-unread" : ""}`}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (!msg.isRead) markAsRead(msg._id);
                    }}
                  >
                    <div className="admin-msg-type" aria-hidden>
                      {getTypeIcon(msg.type)}
                    </div>
                    <div className="admin-msg-body">
                      <div className="admin-msg-meta">
                        <strong>{msg.userName}</strong>
                        <span>{msg.userEmail}</span>
                        {getPriorityBadge(msg.priority)}
                      </div>
                      <h3>{msg.subject}</h3>
                      <p>{msg.message}</p>
                    </div>
                    <div className="admin-msg-side">
                      {getStatusBadge(msg.status)}
                      <time>
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                  </button>
                ))
              )}
            </div>
          </>
        )}

        {/* ======================= EMAIL CONSOLE TAB ======================= */}
    </>
  );
}
