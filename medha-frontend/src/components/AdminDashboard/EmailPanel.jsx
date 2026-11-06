import React from "react";
import {
  FaPaperPlane,
  FaUser,
  FaArrowDownAZ,
  FaCalendarDays,
  FaMagnifyingGlass,
  FaWandMagicSparkles,
  FaEye,
  FaShieldHalved,
  FaTrash,
  FaSpinner,
  FaXmark,
  FaKey,
} from "react-icons/fa6";

export default function EmailPanel({ admin }) {
  const {
    activeTab,
    getFilteredUsers,
    getUniqueUniversities,
    getVerificationStats,
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
    handleGenerateAI,
    handleSendEmail,
    isFullAdmin,
    handlePasswordReset,
    resettingPassword,
    setInviteModalOpen,
    setInviteEmail,
    handleUpdateRole,
    hasUserReceivedCurrentEmail,
    initDeleteUser,
    loadVerificationReminderTemplate,
  } = admin;

  if (activeTab !== "email") return null;

  const stats = getVerificationStats();

  return (
    <>
      <div className="admin-email">
        {/* Users column */}
        <section className="admin-email-users">
          <header className="admin-email-users-head">
            <h2>
              <FaUser aria-hidden /> Users
              <span>
                {getFilteredUsers().length}/{users.length}
              </span>
            </h2>

            <div className="admin-email-mini-stats">
              <div className="admin-email-mini admin-email-mini--ok">
                <strong>{stats.verified}</strong>
                <span>Verified</span>
              </div>
              <div className="admin-email-mini admin-email-mini--warn">
                <strong>{stats.unverified}</strong>
                <span>Unverified</span>
              </div>
              <div className="admin-email-mini">
                <strong>{stats.total}</strong>
                <span>Total</span>
              </div>
            </div>

            <div className="admin-email-search">
              <FaMagnifyingGlass aria-hidden />
              <input
                type="text"
                placeholder="Search name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            <select
              value={universityFilter}
              onChange={(e) => setUniversityFilter(e.target.value)}
              className="admin-email-select"
            >
              <option value="">All Universities</option>
              {getUniqueUniversities().map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </select>

            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="admin-email-select"
            >
              <option value="">All Verification Status</option>
              <option value="verified">Verified only</option>
              <option value="unverified">Unverified only</option>
            </select>

            <div className="admin-email-sort">
              <button
                type="button"
                className={userSort === "name" ? "is-on" : ""}
                onClick={() => setUserSort("name")}
              >
                <FaArrowDownAZ aria-hidden /> Name
              </button>
              <button
                type="button"
                className={userSort === "newest" ? "is-on" : ""}
                onClick={() => setUserSort("newest")}
              >
                <FaCalendarDays aria-hidden /> Newest
              </button>
            </div>
          </header>

          <div className="admin-email-user-list">
            {loadingUsers ? (
              <div className="admin-email-loading">
                <FaSpinner className="animate-spin" />
              </div>
            ) : (
              getFilteredUsers().map((user) => {
                const alreadyReceived = hasUserReceivedCurrentEmail(user.email);
                const selected =
                  selectedUser?._id === user._id && emailMode === "individual";
                return (
                  <div
                    key={user._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setEmailMode("individual");
                      setSelectedUser(user);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setEmailMode("individual");
                        setSelectedUser(user);
                      }
                    }}
                    className={`admin-email-user${selected ? " is-selected" : ""}${alreadyReceived ? " is-sent" : ""}`}
                  >
                    <div className="admin-email-user-top">
                      <strong>{user.name}</strong>
                      <div className="admin-email-badges">
                        {alreadyReceived ? (
                          <span className="admin-email-badge admin-email-badge--sent">
                            Sent
                          </span>
                        ) : null}
                        <span
                          className={`admin-email-badge ${user.emailVerified ? "admin-email-badge--ok" : "admin-email-badge--warn"}`}
                        >
                          {user.emailVerified ? "Verified" : "Unverified"}
                        </span>
                      </div>
                    </div>
                    <p className="admin-email-user-email">{user.email}</p>
                    <div className="admin-email-user-foot">
                      {user.university ? (
                        <span className="admin-email-uni">{user.university}</span>
                      ) : (
                        <span />
                      )}
                      <div className="admin-email-user-actions">
                        <button
                          type="button"
                          title="Send password reset"
                          disabled={resettingPassword === user.email}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePasswordReset(user.email, user.name);
                          }}
                        >
                          {resettingPassword === user.email ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaKey />
                          )}
                          Reset
                        </button>
                        {isFullAdmin ? (
                          <button
                            type="button"
                            title={
                              user.role === "team"
                                ? "Demote to user"
                                : "Invite to team"
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              if (user.role === "team") {
                                handleUpdateRole(user._id, "user");
                              } else {
                                setInviteEmail(user.email);
                                setInviteModalOpen(true);
                              }
                            }}
                          >
                            {user.role === "team" ? (
                              <FaShieldHalved />
                            ) : (
                              <FaPaperPlane />
                            )}
                            {user.role === "team" ? "Team" : "Invite"}
                          </button>
                        ) : null}
                        {isFullAdmin ? (
                          <button
                            type="button"
                            className="is-danger"
                            title="Delete user"
                            onClick={(e) => {
                              e.stopPropagation();
                              initDeleteUser(user);
                            }}
                          >
                            <FaTrash />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Compose column */}
        <section className="admin-email-compose">
          <header className="admin-email-compose-head">
            <h2>
              <FaPaperPlane aria-hidden /> Compose
            </h2>

            <div className="admin-email-modes">
              <label>
                <input
                  type="radio"
                  name="email-mode"
                  checked={emailMode === "individual"}
                  onChange={() => setEmailMode("individual")}
                />
                Single user
              </label>
              <label>
                <input
                  type="radio"
                  name="email-mode"
                  checked={emailMode === "all"}
                  onChange={() => setEmailMode("all")}
                />
                All users
              </label>
              <label className="is-warn">
                <input
                  type="radio"
                  name="email-mode"
                  checked={emailMode === "unverified"}
                  onChange={() => setEmailMode("unverified")}
                />
                Unverified only ({stats.unverified})
              </label>
            </div>

            {emailMode === "unverified" ? (
              <button
                type="button"
                className="admin-email-template-btn"
                onClick={loadVerificationReminderTemplate}
              >
                Load verification reminder template
              </button>
            ) : null}

            <div className="admin-email-to">
              <span>To</span>
              {emailMode === "all" ? (
                <em className="admin-email-to-pill">All users ({users.length})</em>
              ) : emailMode === "unverified" ? (
                <em className="admin-email-to-pill is-warn">
                  Unverified ({stats.unverified})
                </em>
              ) : selectedUser ? (
                <em className="admin-email-to-pill is-ok">
                  {selectedUser.name} &lt;{selectedUser.email}&gt;
                </em>
              ) : (
                <em className="admin-email-to-hint">
                  Select a user from the list
                </em>
              )}
            </div>

            <input
              type="text"
              className="admin-email-subject"
              placeholder="Subject..."
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
          </header>

          <div className="admin-email-ai">
            <FaWandMagicSparkles aria-hidden />
            <input
              type="text"
              placeholder="Ask AI to write this email..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerateAI()}
            />
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={generatingAI || !aiPrompt}
            >
              {generatingAI ? <FaSpinner className="animate-spin" /> : "Generate"}
            </button>
          </div>

          <textarea
            className="admin-email-body"
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            placeholder="Paste HTML email content here, or ask AI to generate it..."
          />

          <footer className="admin-email-actions">
            <p>
              {emailMode === "all"
                ? "Bulk send may take a moment."
                : "Preview before sending."}
            </p>
            <button
              type="button"
              className="desk-ghost-btn"
              onClick={() => setShowPreview(true)}
              disabled={!emailBody}
            >
              <FaEye /> Preview
            </button>
            <button
              type="button"
              className="desk-solid-btn"
              onClick={handleSendEmail}
              disabled={
                sendingEmail ||
                (emailMode === "individual" && !selectedUser) ||
                !emailSubject
              }
            >
              {sendingEmail ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaPaperPlane />
              )}
              {sendingEmail ? "Sending..." : "Send email"}
            </button>
          </footer>
        </section>
      </div>

      {showPreview ? (
        <div
          className="admin-email-modal-backdrop"
          onClick={() => setShowPreview(false)}
          role="presentation"
        >
          <div
            className="admin-email-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Email preview"
          >
            <header>
              <div>
                <span>Email preview</span>
                <h3>{emailSubject || "No subject"}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                aria-label="Close preview"
              >
                <FaXmark />
              </button>
            </header>
            <div className="admin-email-modal-body">
              <div
                className="admin-email-preview-frame"
                dangerouslySetInnerHTML={{
                  __html: emailBody
                    .replace(
                      /\$\{userName\}/g,
                      selectedUser?.name ||
                        (emailMode === "all" ? "Student" : "...")
                    )
                    .replace(
                      /\{\{name\}\}/g,
                      selectedUser?.name ||
                        (emailMode === "all" ? "Student" : "...")
                    ),
                }}
              />
            </div>
            <footer>
              Rendering can vary slightly across email clients.
            </footer>
          </div>
        </div>
      ) : null}
    </>
  );
}
