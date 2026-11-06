import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "../src/pages/Profile.jsx");
let s = fs.readFileSync(file, "utf8");

const startMarker = "          /* ================= READ MODE (Public Profile Layout) ================= */";
const endMarker = "        {/* Modals */}";
const i = s.indexOf(startMarker);
const j = s.indexOf(endMarker);

if (i < 0 || j < 0) {
  console.error("markers not found", { i, j, startLen: startMarker.length });
  // debug nearby
  const alt = s.indexOf("READ MODE");
  const alt2 = s.indexOf("Modals");
  console.error("alt", alt, alt2);
  if (alt >= 0) console.error(JSON.stringify(s.slice(alt - 40, alt + 80)));
  process.exit(1);
}

const replacement = `          /* ================= SOCIAL PROFILE ================= */
          <>
            <section className="profile-hero desk-panel">
              <div className="profile-hero-row">
                <div className="profile-avatar-wrap">
                  <div className="profile-avatar">
                    {getAvatarUrl() ? (
                      <img src={getAvatarUrl()} alt={userData?.name} />
                    ) : (
                      <span>{userData?.name?.charAt(0)}</span>
                    )}
                  </div>
                </div>
                <div className="profile-hero-main">
                  <div className="profile-name-row">
                    <h2>{userData?.name}</h2>
                    {userData?.role === "admin" ? <span className="profile-badge">Admin</span> : null}
                  </div>
                  <p className="profile-handle">@{(userData?.email || "student").split("@")[0]}</p>
                  <p className="profile-bio">
                    {[privacy.showUniversity ? userData?.university : null, userData?.branch]
                      .filter(Boolean)
                      .join(" · ") || "Add university & branch in Edit profile"}
                  </p>
                  <div className="profile-stats">
                    <div><strong>{libraryStats.total}</strong><span>Notes</span></div>
                    <div><strong>{stats.followers || 0}</strong><span>Followers</span></div>
                    <div><strong>{stats.following || 0}</strong><span>Following</span></div>
                    <div><strong>{stats.notesShared || 0}</strong><span>Shared</span></div>
                  </div>
                  <div className="profile-actions">
                    <button type="button" className="desk-solid-btn" onClick={() => setIsEditing(true)}>
                      <FaPen /> Edit profile
                    </button>
                    <button type="button" className="desk-ghost-btn" onClick={() => setLogoutOpen(true)}>
                      <FaArrowRightFromBracket /> Log out
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <div className="profile-metric-row">
              {[
                { value: libraryStats.total, label: "Your notes", tone: "green" },
                { value: libraryStats.inReview, label: "In review", tone: "blue" },
                { value: libraryStats.livePublic, label: "Live public", tone: "violet" },
                { value: getAuraTier(stats.notesShared).rank, label: "Aura rank", tone: "amber" },
              ].map((item) => (
                <div key={item.label} className={"profile-metric profile-metric--" + item.tone}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="desk-tabs profile-tabs">
              {[
                { id: "about", label: "About" },
                { id: "privacy", label: "Privacy" },
                { id: "account", label: "Account" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={"desk-tab" + (settingsTab === tab.id ? " is-on" : "")}
                  onClick={() => setSettingsTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {settingsTab === "about" && (
              <div className="profile-grid">
                <section className="desk-panel">
                  <div className="desk-panel-head">
                    <h2><FaAward /> Aura</h2>
                  </div>
                  <p className="profile-aura-line">
                    <span className="profile-aura-emoji">{getAuraTier(stats.notesShared).emoji}</span>
                    <strong>{getAuraTier(stats.notesShared).tier}</strong>
                    <span>· {getAuraTier(stats.notesShared).rank}</span>
                  </p>
                  <p className="desk-sub" style={{ marginTop: 8 }}>
                    {stats.notesShared || 0} notes shared publicly. Keep uploading to climb ranks.
                  </p>
                </section>
                <section className="desk-panel">
                  <div className="desk-panel-head">
                    <h2><FaBuildingColumns /> Academic</h2>
                  </div>
                  <div className="profile-kv">
                    <div><span>University</span><strong>{userData?.university || "Not set"}</strong></div>
                    <div><span>Branch</span><strong>{userData?.branch || "Not set"}</strong></div>
                    <div><span>Member since</span><strong>{new Date(userData?.createdAt || Date.now()).toLocaleDateString()}</strong></div>
                    {privacy.showEmail ? (
                      <div><span>Email</span><strong>{userData?.email}</strong></div>
                    ) : null}
                  </div>
                </section>
              </div>
            )}

            {settingsTab === "privacy" && (
              <section className="desk-panel">
                <div className="desk-panel-head">
                  <h2><FaShieldHalved /> Privacy & visibility</h2>
                </div>
                <p className="desk-sub" style={{ marginBottom: 16 }}>
                  Control what others can see on your profile.
                </p>
                {[
                  { key: "publicProfile", title: "Public profile", desc: "Anyone on Medha can view your profile page", Icon: FaEye },
                  { key: "showUniversity", title: "Show university & branch", desc: "Display academic details on your profile", Icon: FaBuildingColumns },
                  { key: "showEmail", title: "Show email", desc: "Let others see your email address", Icon: FaUser },
                  { key: "showActivity", title: "Show activity", desc: "Surface recent notes and contribution stats", Icon: FaFileLines },
                  { key: "allowFollows", title: "Allow follows", desc: "People can follow you and see your shared notes", Icon: FaUsers },
                ].map((row) => {
                  const Icon = row.Icon;
                  return (
                    <div key={row.key} className="privacy-row">
                      <span className="privacy-row-icon"><Icon size={16} /></span>
                      <span className="privacy-row-copy">
                        <strong>{row.title}</strong>
                        <span>{row.desc}</span>
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={privacy[row.key]}
                        className={"privacy-switch" + (privacy[row.key] ? " is-on" : "")}
                        onClick={() => updatePrivacy(row.key, !privacy[row.key])}
                      >
                        <span />
                      </button>
                    </div>
                  );
                })}
                {!privacy.publicProfile ? (
                  <p className="privacy-note"><FaLock /> Your profile is private. Only you can see full details.</p>
                ) : null}
              </section>
            )}

            {settingsTab === "account" && (
              <div className="profile-grid">
                <section className="desk-panel">
                  <div className="desk-panel-head">
                    <h2><FaGear /> Account</h2>
                  </div>
                  <div className="account-actions">
                    <button type="button" className="desk-ghost-btn" onClick={() => setIsEditing(true)}>
                      <FaPen /> Edit profile details
                    </button>
                    <button type="button" className="desk-ghost-btn" onClick={() => navigate("/uploads")}>
                      <FaFileLines /> Manage uploads
                    </button>
                    <button type="button" className="desk-ghost-btn" onClick={() => setLogoutOpen(true)}>
                      <FaArrowRightFromBracket /> Log out
                    </button>
                  </div>
                </section>
                <section className="desk-panel profile-danger">
                  <div className="desk-panel-head">
                    <h2><FaTrash /> Danger zone</h2>
                  </div>
                  <p className="desk-sub">Permanently delete your account and all associated data.</p>
                  <Button variant="danger" className="mt-4" onClick={() => setShowDeleteModal(true)}>
                    Delete account
                  </Button>
                </section>
              </div>
            )}
          </>
        )}

`;

// Keep the ") : (" that precedes the start marker
const before = s.slice(0, i);
const after = s.slice(j);
s = before + replacement + after;

s = s.replace(
  "Aura, academic context, uploads, and syllabus — all in one place.",
  "Your public presence, privacy controls, and account settings."
);

fs.writeFileSync(file, s);
console.log("patched ok, new length", s.length);
