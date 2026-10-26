import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBuildingColumns, FaLock } from "react-icons/fa6";

import { useTour } from "../context/TourContext";
import { AuthContext } from "../AuthContext";
import "../styles/responsive-pages.css";

const SEMESTERS = [
  {
    sem: 3,
    label: "3rd Semester",
    active: true,
    description: "CS / AIDS · RTU",
    color: "#7DC67A",
    subjects: 7,
  },
  {
    sem: 4,
    label: "4th Semester",
    active: true,
    description: "CS / AIDS · RTU",
    color: "#8B5CF6",
    subjects: 6,
  },
];

const Dashboard = () => {
  const { isGuestMode } = useTour();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState("Good Morning");
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const handleSemClick = (sem) => {
    if (!sem.active) return;
    navigate(`/semester/${sem.sem}`);
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 sm:px-8 bg-transparent">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] tracking-tight mb-2">
            {greeting},{" "}
            {isGuestMode ? "Alex" : user?.name || "Student"}!{" "}
            <span className="inline-block animate-wave origin-bottom-right">
              👋
            </span>
          </h1>
          <p className="text-base md:text-lg text-[var(--text-secondary)] font-medium">
            Choose your semester to get started.
          </p>
        </motion.div>

        {/* Semester Cards */}
        <div className="dashboard-sem-grid">
          {SEMESTERS.map((sem, idx) => (
            <motion.div
              key={sem.sem}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              whileHover={
                sem.active
                  ? {
                      y: -8,
                      boxShadow: `0 20px 50px ${sem.color}25`,
                      borderColor: sem.color,
                    }
                  : {}
              }
              whileTap={sem.active ? { scale: 0.97 } : {}}
              onClick={() => handleSemClick(sem)}
              className="sem-card"
              style={{
                position: "relative",
                background: "var(--bg-tertiary)",
                border: "1.5px solid var(--border-default)",
                borderRadius: 28,
                padding: "40px 32px",
                cursor: sem.active ? "pointer" : "not-allowed",
                transition: "all 0.3s ease",
                opacity: sem.active ? 1 : 0.55,
                textAlign: "center",
                overflow: "hidden",
              }}
            >
              {/* Background glow */}
              {sem.active && (
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 160,
                    height: 160,
                    borderRadius: "50%",
                    background: `${sem.color}08`,
                    filter: "blur(40px)",
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Icon */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 22,
                  background: sem.active
                    ? `linear-gradient(135deg, ${sem.color}, ${sem.color}cc)`
                    : "var(--bg-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  boxShadow: sem.active
                    ? `0 8px 24px ${sem.color}30`
                    : "none",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {sem.active ? (
                  <FaBuildingColumns size={30} style={{ color: "#fff" }} />
                ) : (
                  <FaLock size={24} style={{ color: "var(--text-tertiary)" }} />
                )}
              </div>

              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  margin: "0 0 8px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {sem.label}
              </h2>

              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--text-tertiary)",
                  margin: "0 0 16px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {sem.description}
              </p>

              {/* CTA pill */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 20px",
                  borderRadius: 100,
                  background: sem.active
                    ? `${sem.color}12`
                    : "var(--bg-secondary)",
                  color: sem.active ? sem.color : "var(--text-tertiary)",
                  fontSize: 13,
                  fontWeight: 700,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {sem.active ? (
                  <>
                    {sem.subjects} Subjects · Explore →
                  </>
                ) : (
                  "Coming Soon"
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
