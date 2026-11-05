import { API_BASE } from "../../config/api";
const MAX_NOTE_UPLOAD_BYTES = 25 * 1024 * 1024;

/* ── Resolve file URLs (local disk vs Cloudinary) ── */
const resolveFileUrl = (url) => {
  if (!url) return "";
  // Cloudinary URLs are already absolute
  if (url.startsWith("http")) return url;
  // Local file paths need the backend base URL prepended
  return `${API_BASE}${url}`;
};

/* ── Subject Color Map ──────────────────────────────────────── */
const SUBJECT_MAP = {
  OOPs:  { bg:"#E8D2BF", tagBg:"#FFF3E8", tagColor:"#C04A00", tagBorder:"rgba(192,74,0,0.2)" },
  DBMS:  { bg:"#C8DDB8", tagBg:"#F0FAF0", tagColor:"#4A9E47", tagBorder:"rgba(74,158,71,0.2)" },
  DSA:   { bg:"#D2D8D8", tagBg:"#F0F4F4", tagColor:"#3D7A8A", tagBorder:"rgba(61,122,138,0.2)" },
  CN:    { bg:"#E2D4ED", tagBg:"#F5F0FF", tagColor:"#6D28D9", tagBorder:"rgba(109,40,217,0.2)" },
  OS:    { bg:"#FDE68A", tagBg:"#FFFBEB", tagColor:"#B45309", tagBorder:"rgba(180,83,9,0.2)" },
  Math:  { bg:"#BFDBFE", tagBg:"#EFF6FF", tagColor:"#1D4ED8", tagBorder:"rgba(29,78,216,0.2)" },
  COA:   { bg:"#FECDD3", tagBg:"#FFF1F2", tagColor:"#BE123C", tagBorder:"rgba(190,18,60,0.2)" },
  EVS:   { bg:"#BBF7D0", tagBg:"#F0FDF4", tagColor:"#166534", tagBorder:"rgba(22,101,52,0.2)" },
};

const getSubjectColor = (name) => {
  if (!name) return SUBJECT_MAP.OOPs;
  const key = Object.keys(SUBJECT_MAP).find(k => name.toLowerCase().includes(k.toLowerCase()));
  if (key) return SUBJECT_MAP[key];
  // Generate from hash
  const colors = Object.values(SUBJECT_MAP);
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const SEMESTERS = ["All","1st","2nd","3rd","4th","5th","6th","7th","8th"];
const NOTE_TYPES = [
  { key:"all", label:"All Notes", icon:"📚" },
  { key:"pyq", label:"PYQ Papers", icon:"📄" },
  { key:"handwritten", label:"Handwritten", icon:"📝" },
  { key:"typed", label:"Typed", icon:"💻" },
  { key:"diagrams", label:"Diagrams", icon:"📊" },
];
const UPLOAD_TYPES = ["📄 PYQ Paper","📝 Handwritten Notes","💻 Typed Notes","📊 Diagrams"];

/* ── helpers ── */
const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  return date.toLocaleDateString("en-IN", { day:"numeric", month:"short" });
};

/* ── shared styles ── */
const chipStyle = (active) => ({
  padding: "8px 16px",
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 600,
  background: active ? "#1F1F1F" : "white",
  color: active ? "white" : "#6B6B6B",
  border: `1.5px solid ${active ? "#1F1F1F" : "#E5E5E5"}`,
  cursor: "pointer",
  transition: "all 150ms",
  fontFamily: "inherit",
});

const labelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: "#7DC67A",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: 8,
  display: "block",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  border: "1.5px solid #E5E5E5",
  borderRadius: 12,
  fontSize: 15,
  color: "#1F1F1F",
  background: "#F6F6F6",
  outline: "none",
  transition: "border-color 200ms, box-shadow 200ms",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
};

const inputFocus = (e) => {
  e.target.style.borderColor = "#7DC67A";
  e.target.style.boxShadow = "0 0 0 3px rgba(125,198,122,0.1)";
  e.target.style.background = "white";
};
const inputBlur = (e) => {
  e.target.style.borderColor = "#E5E5E5";
  e.target.style.boxShadow = "none";
  e.target.style.background = "#F6F6F6";
};

export {
  API_BASE,
  MAX_NOTE_UPLOAD_BYTES,
  resolveFileUrl,
  SUBJECT_MAP,
  getSubjectColor,
  SEMESTERS,
  NOTE_TYPES,
  UPLOAD_TYPES,
  formatDate,
  chipStyle,
  labelStyle,
  inputStyle,
  inputFocus,
  inputBlur,
};
