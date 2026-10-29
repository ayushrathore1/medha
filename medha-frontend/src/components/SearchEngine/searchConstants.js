import { Sparkles } from "lucide-react";
import {
  FaYoutube,
  FaFileLines,
  FaChartBar,
  FaBook
} from "react-icons/fa6";

// ─── ELAYA DESIGN SKILLS SYSTEM CONSTANTS ───────────────────────
// Motion Base Curve: cubic-bezier(0.22, 1, 0.36, 1) per B7
export const BASE_EASE = [0.22, 1, 0.36, 1];

// Flat subject color mapping (no gradients, uniform full border per B4)
export const SUBJECT_COLORS = {
  "Discrete Mathematics Structure": { bg: "#E8D2BF", text: "#C04A00", border: "rgba(192,74,0,0.3)" },
  "Database Management System": { bg: "#C8DDB8", text: "#2E7D32", border: "rgba(46,125,50,0.3)" },
  "Data Structures and Algorithms": { bg: "#D2D8D8", text: "#00695C", border: "rgba(0,105,92,0.3)" },
  "Theory Of Computation": { bg: "#E2D4ED", text: "#6A1B9A", border: "rgba(106,27,154,0.3)" },
  "Digital Electronics": { bg: "#FECDD3", text: "#BE123C", border: "rgba(190,18,60,0.3)" },
  "Object Oriented Programming": { bg: "#FDE68A", text: "#B45309", border: "rgba(180,83,9,0.3)" },
  "Software Engineering": { bg: "#BFDBFE", text: "#1D4ED8", border: "rgba(29,78,216,0.3)" },
  "Data Communication & Computer Networks": { bg: "#BBF7D0", text: "#15803D", border: "rgba(21,128,61,0.3)" },
  "Microprocessor & Interfaces": { bg: "#FED7AA", text: "#C2410C", border: "rgba(194,65,12,0.3)" },
  "Technical Communication": { bg: "#DDD6FE", text: "#5B21B6", border: "rgba(91,33,182,0.3)" },
};

export const getSubjectBadgeStyle = (subjectName) => {
  if (!subjectName) return { bg: "rgba(125, 198, 122, 0.15)", text: "#7DC67A", border: "rgba(125, 198, 122, 0.35)" };
  const found = Object.keys(SUBJECT_COLORS).find(k =>
    subjectName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(subjectName.toLowerCase())
  );
  if (found) return SUBJECT_COLORS[found];
  return { bg: "rgba(139, 92, 246, 0.12)", text: "#8B5CF6", border: "rgba(139, 92, 246, 0.3)" };
};

export const SEMESTERS = [
  { id: "all", label: "All semesters", short: "All" },
  { id: "1st", label: "Semester 1", short: "1st" },
  { id: "2nd", label: "Semester 2", short: "2nd" },
  { id: "3rd", label: "Semester 3", short: "3rd" },
  { id: "4th", label: "Semester 4", short: "4th" },
  { id: "5th", label: "Semester 5", short: "5th" },
  { id: "6th", label: "Semester 6", short: "6th" },
  { id: "7th", label: "Semester 7", short: "7th" },
  { id: "8th", label: "Semester 8", short: "8th" },
];

export const CATEGORIES = [
  { id: "all", label: "All resources", short: "All", icon: Sparkles, color: "#7DC67A" },
  { id: "notes", label: "Notes and materials", short: "Notes", icon: FaFileLines, color: "#8B5CF6" },
  { id: "youtube", label: "YouTube lectures", short: "Videos", icon: FaYoutube, color: "#EF4444" },
  { id: "subjects", label: "Subjects and syllabus", short: "Syllabus", icon: FaBook, color: "#3B82F6" },
  { id: "pyq", label: "Previous year papers", short: "PYQs", icon: FaChartBar, color: "#10B981" },
];

export const LOCAL_STORAGE_KEY = "medha_recent_searches_v2";
export const VIEW_MODE_KEY = "medha_search_view_mode_v2";

// Tagline Reveal text per B11
export const TAGLINE_WORDS = "Built for Rajasthan Technical University engineers. Every unit, note, and exam solution organized in one place.".split(" ");
