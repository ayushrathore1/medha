import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaYoutube,
  FaChartBar,
  FaFileLines,
  FaWandMagicSparkles,
} from "react-icons/fa6";

const tabs = [
  {
    key: "youtube",
    label: "YT Lectures",
    icon: FaYoutube,
    description: "Chapter-wise video lectures",
    color: "#FF0000",
    bgColor: "rgba(255, 0, 0, 0.08)",
    borderColor: "rgba(255, 0, 0, 0.15)",
  },
  {
    key: "pyq",
    label: "PYQ Analysis",
    icon: FaChartBar,
    description: "Unit weightage & past papers",
    color: "#7DC67A",
    bgColor: "rgba(125, 198, 122, 0.08)",
    borderColor: "rgba(125, 198, 122, 0.15)",
  },
  {
    key: "notes",
    label: "Notes",
    icon: FaFileLines,
    description: "Community & uploaded notes",
    color: "#8B5CF6",
    bgColor: "rgba(139, 92, 246, 0.08)",
    borderColor: "rgba(139, 92, 246, 0.15)",
  },
  {
    key: "ai",
    label: "AI Recommendations",
    icon: FaWandMagicSparkles,
    description: "AI-curated learning resources",
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.08)",
    borderColor: "rgba(245, 158, 11, 0.15)",
  },
];

const SubjectTabCards = ({ subjectName, onPYQClick }) => {
  const navigate = useNavigate();
  const encodedName = encodeURIComponent(subjectName);

  const handleTabClick = (tabKey) => {
    switch (tabKey) {
      case "youtube":
        navigate(`/rtu-exams/subject/${encodedName}/youtube`);
        break;
      case "pyq":
        if (onPYQClick) onPYQClick();
        break;
      case "notes":
        navigate(`/rtu-exams/subject/${encodedName}/notes`);
        break;
      case "ai":
        navigate(`/recommendations?subject=${encodedName}`);
        break;
      default:
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -10, height: 0 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      style={{
        background: "rgba(125, 198, 122, 0.06)",
        border: "1.5px solid rgba(125, 198, 122, 0.15)",
        borderRadius: 20,
        padding: "24px 20px",
        marginTop: 8,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14,
        }}
      >
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
              whileHover={{
                y: -4,
                boxShadow: `0 8px 24px ${tab.borderColor}`,
                borderColor: tab.color,
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleTabClick(tab.key)}
              style={{
                background: "var(--bg-tertiary)",
                border: `1.5px solid var(--border-default)`,
                borderRadius: 16,
                padding: "20px 16px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                transition: "all 0.2s ease",
                fontFamily: "inherit",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: tab.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={22} style={{ color: tab.color }} />
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                {tab.label}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--text-tertiary)",
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                {tab.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SubjectTabCards;
