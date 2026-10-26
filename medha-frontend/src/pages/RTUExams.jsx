import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import MultiYearToggle from "../components/RTUExams/MultiYearToggle";
import UnitWeightageBar from "../components/RTUExams/UnitWeightageBar";
import AIPredictionPanel from "../components/RTUExams/AIPredictionPanel";
import SubjectTabCards from "../components/RTUExams/SubjectTabCards";
import {
  FaArrowLeft,
  FaLayerGroup,
  FaCircleCheck,
  FaChartBar,
  FaEnvelope,
  FaBuildingColumns,
  FaBook,
  FaWandMagicSparkles,
} from "react-icons/fa6";


import { useTour } from "../context/TourContext";
import useAuthGuard from "../hooks/useAuthGuard";

// 4th semester subjects (hardcoded — no backend API endpoint yet)
const SEM_4_SUBJECTS = [
  { name: "Discrete Mathematics Structure" },
  { name: "Technical Communication" },
  { name: "Microprocessor & Interfaces" },
  { name: "Database Management System" },
  { name: "Theory Of Computation" },
  { name: "Data Communication & Computer Networks" },
];

const RTUExams = () => {
  const { isGuestMode } = useTour();
  const { requireAuth } = useAuthGuard();
  const navigate = useNavigate();
  
  
  const [viewState, setViewState] = useState("semesters");
  const [selectedSem, setSelectedSem] = useState(null);
  const [subjects, setSubjects] = useState(
    isGuestMode
      ? [
          {
            name: "Digital Electronics",
            difficulty: "medium",
            total: 10,
            viewed: 5,
          },
          {
            name: "Software Engineering",
            difficulty: "hard",
            total: 8,
            viewed: 2,
          },
          {
            name: "Data Structures",
            difficulty: "easy",
            total: 12,
            viewed: 12,
          },
        ]
      : []
  );
  const [loading, setLoading] = useState(!isGuestMode);

  const [selectedSubject, setSelectedSubject] = useState(
    isGuestMode ? { name: "Digital Electronics", difficulty: "medium" } : null
  );
  const [availableYears, setAvailableYears] = useState(
    isGuestMode ? [2024, 2023, 2022] : []
  );
  const [selectedYear, setSelectedYear] = useState(isGuestMode ? 2024 : null);
  const [selectedYears, setSelectedYears] = useState(isGuestMode ? [2024, 2023, 2022] : []);
  const [unitWeightageData, setUnitWeightageData] = useState(
    isGuestMode
      ? {
          totalPaperMarks: 98,
          chatgptLink: null,
          claudeLink: null,
          units: [
            {
              unitSerial: 1,
              unitName: "Number Systems & Boolean Algebra",
              totalMarks: 28,
              weightagePercentage: 28.5,
              weightageRatio: "28/98",
              youtubePlaylistUrl: null,
              questions: [
                {
                  qCode: "Q1(a)",
                  text: "Convert the decimal number 156.375 to binary and hexadecimal.",
                  marks: 7,
                },
                {
                  qCode: "Q2(b)",
                  text: "Simplify the Boolean expression: F = AB'C + ABC' + A'BC using K-Map.",
                  marks: 7,
                },
              ],
            },
            {
              unitSerial: 2,
              unitName: "Combinational Logic Circuits",
              totalMarks: 21,
              weightagePercentage: 21.4,
              weightageRatio: "21/98",
              youtubePlaylistUrl: null,
              questions: [
                {
                  qCode: "Q3(a)",
                  text: "Design a 4-bit binary adder using full adders.",
                  marks: 7,
                },
              ],
            },
            {
              unitSerial: 3,
              unitName: "Sequential Logic Circuits",
              totalMarks: 21,
              weightagePercentage: 21.4,
              weightageRatio: "21/98",
              youtubePlaylistUrl: null,
              questions: [
                {
                  qCode: "Q4(a)",
                  text: "Explain the working of a JK Flip-Flop with truth table and timing diagram.",
                  marks: 7,
                },
              ],
            },
          ],
        }
      : null
  );
  const [yearsLoading, setYearsLoading] = useState(false);
  const [weightageLoading, setWeightageLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // For admin image upload capability

  // Multi-year + AI state
  const [multiYearData, setMultiYearData] = useState(null);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [activeTab, setActiveTab] = useState("questions"); // 'questions' | 'importance' | 'repeated' | 'topics'
  const [expandedTopic, setExpandedTopic] = useState(null); // index of expanded topic card

  const [searchParams, setSearchParams] = useSearchParams();

  // ── Sync URL → State on mount / URL change ──
  useEffect(() => {
    if (isGuestMode) return;

    const paramSem = searchParams.get("sem");
    const paramSubject = searchParams.get("subject");
    const paramYear = searchParams.get("year");
    const paramView = searchParams.get("view");

    if (paramSubject && paramYear) {
      // Deepest: unit weightage
      const yr = parseInt(paramYear, 10);
      setSelectedSubject({ name: paramSubject });
      if (paramSem) setSelectedSem(parseInt(paramSem, 10));
      setSelectedYear(yr);
      setViewState("unitWeightage");
      setLoading(false);
      fetchUnitWeightage(paramSubject, yr);
    } else if (paramSubject && paramView === "pyq") {
      // Multi-year analysis view
      setSelectedSubject({ name: paramSubject });
      if (paramSem) setSelectedSem(parseInt(paramSem, 10));
      setViewState("multiYear");
      setLoading(false);
      fetchAvailableYears(paramSubject);
    } else if (paramSubject && paramSem) {
      // Direct subject link → go to analysis
      const sem = parseInt(paramSem, 10);
      setSelectedSem(sem);
      setSelectedSubject({ name: paramSubject });
      setViewState("multiYear");
      fetchSubjects(sem);
      fetchAvailableYears(paramSubject);
    } else if (paramSem) {
      // Subjects list for a semester
      const sem = parseInt(paramSem, 10);
      setSelectedSem(sem);
      setViewState("subjects");
      fetchSubjects(sem);
    } else {
      // Default: semesters
      setViewState("semesters");
      setLoading(false);
    }

    const token = localStorage.getItem("token");
    if (token) checkAdminStatus();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helper: update URL params without full re-render ──
  const syncUrl = (params) => {
    const p = new URLSearchParams();
    if (params.sem) p.set("sem", params.sem);
    if (params.subject) p.set("subject", params.subject);
    if (params.view) p.set("view", params.view);
    if (params.year) p.set("year", params.year);
    setSearchParams(p, { replace: true });
  };

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.get(`${baseUrl}/api/messages/check-admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Admin status check result:", res.data);
      setIsAdmin(res.data.isAdmin || false);
    } catch (e) {
      console.error("Admin status check failed:", e);
      setIsAdmin(false);
    }
  };

  const fetchSubjects = async (sem = 3) => {
    try {
      setLoading(true);
      if (sem === 4) {
        // 4th sem uses hardcoded subjects (no backend endpoint yet)
        setSubjects(SEM_4_SUBJECTS);
      } else {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await axios.get(`${baseUrl}/api/rtu/3rd-sem`, { headers });
        setSubjects(res.data.topics);
      }
    } catch (error) {
      console.error("Error fetching RTU subjects:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableYears = async (subjectName) => {
    try {
      setYearsLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.get(
        `${baseUrl}/api/rtu/subjects/${encodeURIComponent(subjectName)}/years`,
        { headers }
      );

      if (res.data.success) {
        setAvailableYears(res.data.years);
      }
    } catch (error) {
      console.error("Error fetching available years:", error);
      setAvailableYears([]);
    } finally {
      setYearsLoading(false);
    }
  };

  const fetchUnitWeightage = async (subjectName, year) => {
    try {
      setWeightageLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.get(
        `${baseUrl}/api/rtu/subjects/${encodeURIComponent(subjectName)}/years/${year}/weightage`,
        { headers }
      );

      if (res.data.success) {
        setUnitWeightageData(res.data);
      }
    } catch (error) {
      console.error("Error fetching unit weightage:", error);
      setUnitWeightageData(null);
    } finally {
      setWeightageLoading(false);
    }
  };

  const fetchMultiYearWeightage = async (subjectName, years) => {
    try {
      setWeightageLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.get(
        `${baseUrl}/api/rtu/subjects/${encodeURIComponent(subjectName)}/multi-year-weightage?years=${years.join(",")}`,
        { headers }
      );

      if (res.data.success) {
        setMultiYearData(res.data);
      }
    } catch (error) {
      console.error("Error fetching multi-year weightage:", error);
      setMultiYearData(null);
    } finally {
      setWeightageLoading(false);
    }
  };

  const fetchAiPrediction = async (subjectName, years) => {
    try {
      setAiLoading(true);
      setAiError(null);
      setShowAiPanel(true);
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.post(
        `${baseUrl}/api/rtu/subjects/${encodeURIComponent(subjectName)}/ai-predict-topics`,
        { years },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setAiPrediction(res.data);
      } else {
        setAiError(res.data.message || "Prediction failed");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "AI prediction failed. Try again later.";
      setAiError(msg);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubjectClick = async (subject) => {
    setSelectedSubject(subject);
    setViewState("multiYear");
    syncUrl({ sem: selectedSem, subject: subject.name, view: "pyq" });
    // Reset AI state
    setShowAiPanel(false);
    setAiPrediction(null);
    setAiError(null);
    if (!isGuestMode) {
      await fetchAvailableYears(subject.name);
    }
  };

  const handlePYQClick = async () => {
    setViewState("multiYear");
    syncUrl({ sem: selectedSem, subject: selectedSubject?.name, view: "pyq" });
    // Reset AI state when entering analysis
    setShowAiPanel(false);
    setAiPrediction(null);
    setAiError(null);
    if (!isGuestMode && selectedSubject) {
      await fetchAvailableYears(selectedSubject.name);
    }
  };

  // Auto-select all years + fetch multi-year data when availableYears changes
  useEffect(() => {
    if (availableYears.length > 0 && viewState === "multiYear" && selectedSubject && !isGuestMode) {
      setSelectedYears(availableYears);
      fetchMultiYearWeightage(selectedSubject.name, availableYears);
    }
  }, [availableYears]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleYearSelect = async (year) => {
    setSelectedYear(year);
    setViewState("unitWeightage");
    syncUrl({ sem: selectedSem, subject: selectedSubject?.name, year });
    if (!isGuestMode) {
      await fetchUnitWeightage(selectedSubject.name, year);
    }
  };

  const handleYearToggle = async (yearOrAll, soloMode) => {
    if (yearOrAll === "all") {
      setSelectedYears([...availableYears]);
      if (!isGuestMode && selectedSubject) {
        await fetchMultiYearWeightage(selectedSubject.name, availableYears);
      }
      return;
    }
    if (soloMode) {
      // Solo select one year
      setSelectedYears([yearOrAll]);
      if (!isGuestMode && selectedSubject) {
        await fetchMultiYearWeightage(selectedSubject.name, [yearOrAll]);
      }
      return;
    }
    setSelectedYears((prev) => {
      const isSelected = prev.includes(yearOrAll);
      let next;
      if (isSelected && prev.length > 1) {
        next = prev.filter((y) => y !== yearOrAll);
      } else if (!isSelected) {
        next = [...prev, yearOrAll].sort();
      } else {
        return prev; // Can't deselect the last one
      }
      if (!isGuestMode && selectedSubject) {
        fetchMultiYearWeightage(selectedSubject.name, next);
      }
      return next;
    });
  };

  const handleBack = () => {
    if (viewState === "unitWeightage") {
      setViewState("multiYear");
      setSelectedYear(null);
      setUnitWeightageData(null);
      syncUrl({ sem: selectedSem, subject: selectedSubject?.name, view: "pyq" });
    } else if (viewState === "multiYear") {
      setViewState("subjects");
      setSelectedSubject(null);
      setAvailableYears([]);
      setSelectedYears([]);
      setMultiYearData(null);
      setShowAiPanel(false);
      setActiveTab("questions");
      syncUrl({ sem: selectedSem });
      // Always re-fetch subjects to ensure list is populated
      if (selectedSem) fetchSubjects(selectedSem);
    } else if (viewState === "subjects") {
      setViewState("semesters");
      setSelectedSem(null);
      syncUrl({});
    }
  };

  const handleDifficultyChange = async (topicName, difficulty) => {
    setSubjects((prev) =>
      prev.map((sub) => (sub.name === topicName ? { ...sub, difficulty } : sub))
    );

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/flashcards/topic/${encodeURIComponent(topicName)}/difficulty`,
        { difficulty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error updating difficulty:", error);
      fetchSubjects();
    }
  };

  const getSemLabel = (sem) => {
    if (sem === 1) return "1st";
    if (sem === 2) return "2nd";
    if (sem === 3) return "3rd";
    return `${sem}th`;
  };

  const getHeaderTitle = () => {
    switch (viewState) {
      case "semesters":
        return "The Archives";
      case "subjects":
        return `${getSemLabel(selectedSem)} Semester`;
      case "multiYear":
        return selectedSubject?.name || "PYQ Analysis";
      case "unitWeightage":
        return `${selectedSubject?.name} (${selectedYear})`;
      default:
        return "PYQ Analysis";
    }
  };

  const getHeaderSubtitle = () => {
    switch (viewState) {
      case "semesters":
        return "Access previous year papers and smart analysis.";
      case "subjects":
        return "Choose a subject to explore.";
      case "multiYear":
        return "Toggle years to compare analysis across papers.";
      case "unitWeightage":
        return `Analysis based on ${unitWeightageData?.totalPaperMarks || 98} marks paper`;
      default:
        return "";
    }
  };

  if (loading && subjects.length === 0) return <Loader fullScreen />;

  return (
    <div className="min-h-screen w-full px-3 py-6 sm:px-8 sm:py-8 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-12">
          {viewState !== "semesters" && (
            <div className="w-full flex justify-start mb-4">
              <Button
                onClick={handleBack}
                variant="ghost"
                className="bg-[var(--bg-secondary)] shadow-sm border border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
              >
                <FaArrowLeft className="mr-2" /> Back
              </Button>
            </div>
          )}

          <motion.div
            key={viewState}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="max-w-2xl"
            data-tour="rtu-exams"
          >
            <h1 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight mb-3">
              {getHeaderTitle()}
            </h1>
            <p className="text-base md:text-lg text-[var(--text-secondary)] font-medium">
              {getHeaderSubtitle()}
            </p>
          </motion.div>

        </div>



        <>
          <AnimatePresence mode="wait">
            {/* Semesters View */}
            {viewState === "semesters" && (
              <motion.div
                key="semesters"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="dashboard-sem-grid"
              >
                  {[
                    { sem: 3, label: "3rd Semester", color: "#7DC67A", subjects: 7 },
                    { sem: 4, label: "4th Semester", color: "#8B5CF6", subjects: 6 },
                  ].map((s, idx) => (
                    <motion.div
                      key={s.sem}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.12, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      whileHover={{ y: -8, boxShadow: `0 20px 50px ${s.color}25`, borderColor: s.color }}
                      whileTap={{ scale: 0.97 }}
                      data-tour={s.sem === 3 ? "rtu-semester" : undefined}
                      onClick={() => {
                        setSelectedSem(s.sem);
                        if (!isGuestMode) fetchSubjects(s.sem);
                        setViewState("subjects");
                        syncUrl({ sem: s.sem });
                      }}
                      className="sem-card"
                      style={{
                        position: "relative",
                        background: "var(--bg-tertiary)",
                        border: "1.5px solid var(--border-default)",
                        borderRadius: 28,
                        padding: "40px 32px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        textAlign: "center",
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: `${s.color}08`, filter: "blur(40px)", pointerEvents: "none" }} />
                      <div style={{ width: 72, height: 72, borderRadius: 22, background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: `0 8px 24px ${s.color}30`, position: "relative", zIndex: 1 }}>
                        <FaBuildingColumns size={30} style={{ color: "#fff" }} />
                      </div>
                      <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 8px", position: "relative", zIndex: 1 }}>{s.label}</h2>
                      <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-tertiary)", margin: "0 0 16px", position: "relative", zIndex: 1 }}>CS / AIDS · RTU</p>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 100, background: `${s.color}12`, color: s.color, fontSize: 13, fontWeight: 700, position: "relative", zIndex: 1 }}>
                        {s.subjects} Subjects · Explore →
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Subjects View */}
              {viewState === "subjects" && (
                <motion.div
                  data-tour="rtu-subjects"
                  key="subjects"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Subject Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject, idx) => {
                      const subjectColor = "#7DC67A";
                      const hasAnalysis = [
                        "Advanced Engineering Mathematics",
                        "Data Structures and Algorithms",
                        "Object Oriented Programming",
                        "Digital Electronics",
                        "Software Engineering",
                        "Technical Communication",
                        "Managerial Economics and Financial Accounting",
                        "Theory Of Computation",
                        "Microprocessor & Interfaces",
                        "Database Management System",
                        "Data Communication & Computer Networks",
                        "Discrete Mathematics Structure",
                      ].includes(subject.name);

                      return (
                        <motion.div
                          key={subject._id || subject.name}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                          whileHover={{ y: -6, boxShadow: `0 16px 40px ${subjectColor}20`, borderColor: subjectColor }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSubjectClick(subject)}
                          style={{
                            position: "relative",
                            background: "var(--bg-tertiary)",
                            border: "1.5px solid var(--border-default)",
                            borderRadius: 20,
                            padding: "28px 24px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            overflow: "hidden",
                          }}
                        >
                          {/* Background glow */}
                          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: `${subjectColor}06`, filter: "blur(30px)", pointerEvents: "none" }} />

                          <div style={{ position: "relative", zIndex: 1 }}>
                            {/* Icon */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                              <div style={{
                                width: 52, height: 52, borderRadius: 16,
                                background: "rgba(125, 198, 122, 0.1)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                <FaBook size={22} style={{ color: "var(--action-primary)" }} />
                              </div>
                            </div>

                            {/* Title */}
                            <h3 style={{
                              fontSize: 20, fontWeight: 700,
                              color: "var(--text-primary)",
                              margin: "0 0 8px", lineHeight: 1.3,
                            }}>
                              {subject.name}
                            </h3>

                            {/* Analysis badge */}
                            {hasAnalysis && (
                              <div style={{
                                display: "inline-flex", alignItems: "center", gap: 5,
                                padding: "4px 10px", borderRadius: 8,
                                background: "rgba(125,198,122,0.08)",
                                border: "1px solid rgba(125,198,122,0.15)",
                                fontSize: 11, fontWeight: 700,
                                color: "var(--action-primary)",
                              }}>
                                <FaChartBar size={10} /> Includes Analysis
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Multi-Year Analysis View */}
              {viewState === "multiYear" && (
                <motion.div
                  data-tour="rtu-years"
                  key="multiYear"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Year toggle pills + AI button */}
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <MultiYearToggle
                      years={availableYears}
                      selectedYears={selectedYears}
                      onToggleYear={handleYearToggle}
                      loading={yearsLoading}
                    />

                    {availableYears.length > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (!showAiPanel) {
                            requireAuth(
                              () => fetchAiPrediction(selectedSubject.name, selectedYears.length > 0 ? selectedYears : availableYears),
                              "AI Prediction"
                            );
                          } else {
                            setShowAiPanel(false);
                          }
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "10px 24px",
                          borderRadius: 100,
                          background: showAiPanel
                            ? "rgba(125,198,122,0.12)"
                            : "linear-gradient(135deg, #7DC67A, #5bb358)",
                          color: showAiPanel ? "var(--action-primary)" : "#fff",
                          border: showAiPanel
                            ? "2px solid var(--action-primary)"
                            : "2px solid transparent",
                          fontSize: 14,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          boxShadow: showAiPanel
                            ? "none"
                            : "0 6px 24px rgba(125,198,122,0.3)",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <FaWandMagicSparkles size={16} />
                        {showAiPanel ? "Hide AI Prediction" : "AI Predict Important Topics"}
                      </motion.button>
                    )}
                  </div>

                  {/* AI Prediction Panel */}
                  {showAiPanel && (
                    <div className="max-w-4xl mx-auto">
                      <AIPredictionPanel
                        predictions={aiPrediction?.predictions}
                        yearsAnalyzed={aiPrediction?.yearsAnalyzed}
                        loading={aiLoading}
                        error={aiError}
                        cached={aiPrediction?.cached}
                        onClose={() => setShowAiPanel(false)}
                        onRetry={() => fetchAiPrediction(selectedSubject.name, selectedYears.length > 0 ? selectedYears : availableYears)}
                      />
                    </div>
                  )}

                  {/* Multi-year aggregated analysis */}
                  {weightageLoading ? (
                    <div className="flex justify-center py-20">
                      <Loader />
                    </div>
                  ) : multiYearData ? (
                    <div className="max-w-4xl mx-auto">
                      {/* 4-Tab strip */}
                      <div style={{
                        display: "flex", justifyContent: "center", gap: 6, marginBottom: 20,
                        flexWrap: "wrap",
                      }}>
                        {[
                          { key: "questions", icon: "📝", label: "Papers" },
                          { key: "importance", icon: "📊", label: "Importance" },
                          { key: "repeated", icon: "🔁", label: "Repeated Q's" },
                          { key: "topics", icon: "📌", label: "Top Topics" },
                        ].map((tab) => (
                          <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                              padding: "10px 20px", borderRadius: 14,
                              fontSize: 13, fontWeight: 700, fontFamily: "inherit",
                              cursor: "pointer", transition: "all 0.2s",
                              border: activeTab === tab.key ? "2px solid var(--action-primary)" : "2px solid var(--border-default)",
                              background: activeTab === tab.key ? "rgba(125,198,122,0.1)" : "var(--bg-secondary)",
                              color: activeTab === tab.key ? "var(--action-primary)" : "var(--text-tertiary)",
                            }}
                          >
                            {tab.icon} {tab.label}
                          </button>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        {activeTab === "questions" && (
                          <motion.div
                            key="questionsView"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 mb-6 shadow-md border-2 border-[var(--action-primary)]/20 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--action-primary)]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                              <h3 className="text-xl font-bold text-[var(--text-primary)] relative z-10">Question Paper Analysis</h3>
                              <p className="text-[var(--text-secondary)] text-sm relative z-10 mt-1">Select a year to view unit-wise questions and their marks breakdown.</p>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                              {multiYearData.years.sort().map((year, idx) => (
                                <motion.button
                                  key={year}
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                                  whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(125,198,122,0.15)" }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => handleYearSelect(year)}
                                  style={{ padding: "24px 20px", borderRadius: 20, background: "var(--bg-secondary)", border: "1.5px solid var(--border-default)", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.3s ease" }}
                                >
                                  <div style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)", marginBottom: 4 }}>{year}</div>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-tertiary)" }}>View questions & marks →</div>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {activeTab === "importance" && (
                          <motion.div key="weightageView" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                            <div data-tour="rtu-weightage" className="bg-[var(--bg-secondary)] rounded-2xl p-6 mb-8 shadow-md border-2 border-[var(--action-primary)]/20 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--action-primary)]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                              <h3 className="text-xl font-bold text-[var(--text-primary)] relative z-10">Multi-Year Unit Weightage</h3>
                              <p className="text-[var(--text-secondary)] text-sm relative z-10 mt-1">Aggregated from {multiYearData.years.join(", ")} papers — sorted by average marks.</p>
                            </div>
                            {multiYearData.aggregatedUnits.map((unit, index) => {
                              const barColors = ["#7DC67A", "#8B5CF6", "#3b82f6", "#f59e0b", "#ef4444", "#06b6d4"];
                              return (
                                <motion.div key={unit.unitSerial} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.4 }} style={{ background: "var(--bg-secondary)", borderRadius: 20, padding: "20px 24px", marginBottom: 12, border: "1.5px solid var(--border-default)" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                    <div>
                                      <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-tertiary)", marginRight: 8 }}>Unit {unit.unitSerial}</span>
                                      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{unit.unitName}</span>
                                    </div>
                                    <span style={{ fontSize: 16, fontWeight: 900, color: "var(--action-primary)", background: "rgba(125,198,122,0.1)", padding: "4px 12px", borderRadius: 8 }}>Avg: {unit.averageMarks}</span>
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    {Object.entries(unit.perYear).sort(([a], [b]) => a - b).map(([year, marks], i) => (
                                      <div key={year} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-tertiary)", width: 40, textAlign: "right" }}>{year}</span>
                                        <div style={{ flex: 1, height: 22, borderRadius: 6, background: "var(--bg-tertiary)", overflow: "hidden", position: "relative" }}>
                                          <motion.div initial={{ width: 0 }} animate={{ width: `${(marks / (multiYearData.totalPaperMarks || 98)) * 100}%` }} transition={{ delay: index * 0.08 + i * 0.05, duration: 0.6, ease: "easeOut" }} style={{ height: "100%", borderRadius: 6, background: `${barColors[i % barColors.length]}`, opacity: 0.8 }} />
                                        </div>
                                        <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)", width: 30, textAlign: "right" }}>{marks}</span>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </motion.div>
                        )}

                        {activeTab === "repeated" && (
                          <motion.div key="repeatedView" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                            <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 mb-6 shadow-md border-2 border-[var(--action-primary)]/20 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--action-primary)]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                              <h3 className="text-xl font-bold text-[var(--text-primary)] relative z-10">🔁 Most Repeated Questions</h3>
                              <p className="text-[var(--text-secondary)] text-sm relative z-10 mt-1">Questions that appeared in multiple years — high chance of being asked again.</p>
                            </div>
                            {multiYearData.repeatedQuestions && multiYearData.repeatedQuestions.length > 0 ? (
                              multiYearData.repeatedQuestions.map((q, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06, duration: 0.4 }}
                                  style={{ background: "var(--bg-secondary)", borderRadius: 20, padding: "20px 24px", marginBottom: 12, border: "1.5px solid var(--border-default)" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                                    <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 800, background: q.count >= 3 ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", color: q.count >= 3 ? "#ef4444" : "#f59e0b", border: `1px solid ${q.count >= 3 ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)"}` }}>
                                      {"🔥".repeat(Math.min(q.count, 4))} Asked {q.count}x
                                    </span>
                                    <span style={{ padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "rgba(125,198,122,0.08)", color: "var(--action-primary)", border: "1px solid rgba(125,198,122,0.15)" }}>
                                      Unit {q.unitSerial} · {q.unitName}
                                    </span>
                                    <span style={{ padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "rgba(139,92,246,0.08)", color: "#8B5CF6", border: "1px solid rgba(139,92,246,0.15)" }}>
                                      ~{q.avgMarks} marks
                                    </span>
                                  </div>
                                  <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.6, margin: "0 0 10px" }}>{q.text}</p>
                                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                    {q.years.map((yr) => (
                                      <span key={yr} style={{ padding: "3px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>{yr}</span>
                                    ))}
                                  </div>
                                </motion.div>
                              ))
                            ) : (
                              <div style={{ textAlign: "center", padding: 40, color: "var(--text-tertiary)", fontSize: 15, fontWeight: 600 }}>
                                No repeated questions found across the selected years.<br /><span style={{ fontSize: 13 }}>Try selecting more years above.</span>
                              </div>
                            )}
                          </motion.div>
                        )}

                        {activeTab === "topics" && (
                          <motion.div key="topicsView" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                            <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 mb-6 shadow-md border-2 border-[var(--action-primary)]/20 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--action-primary)]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                              <h3 className="text-xl font-bold text-[var(--text-primary)] relative z-10">📌 Most Tested Topics</h3>
                              <p className="text-[var(--text-secondary)] text-sm relative z-10 mt-1">Topics ranked by how frequently they appear across {multiYearData.years.join(", ")} papers.</p>
                            </div>
                            {multiYearData.topTopics && multiYearData.topTopics.length > 0 ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {multiYearData.topTopics.map((t, idx) => {
                                  const heat = t.count >= 4 ? 3 : t.count >= 3 ? 2 : 1;
                                  const heatColor = heat >= 3 ? "#ef4444" : heat >= 2 ? "#f59e0b" : "#7DC67A";
                                  const isExpanded = expandedTopic === idx;
                                  return (
                                    <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05, duration: 0.4 }}
                                      style={{ background: "var(--bg-secondary)", borderRadius: 20, border: "1.5px solid var(--border-default)", position: "relative", overflow: "hidden" }}>
                                      <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: heatColor, borderRadius: "4px 0 0 4px" }} />
                                      {/* Clickable header */}
                                      <div
                                        onClick={() => setExpandedTopic(isExpanded ? null : idx)}
                                        style={{ padding: "20px 24px", cursor: "pointer", userSelect: "none" }}
                                      >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, flex: 1 }}>{t.topic}</div>
                                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <span style={{ padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 800, background: `${heatColor}15`, color: heatColor, border: `1px solid ${heatColor}30`, whiteSpace: "nowrap" }}>
                                              {"🔥".repeat(heat)} {t.count}x
                                            </span>
                                            <span style={{ fontSize: 16, color: "var(--text-tertiary)", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                                          </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                          <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: "rgba(125,198,122,0.08)", color: "var(--action-primary)", border: "1px solid rgba(125,198,122,0.15)" }}>
                                            Unit {t.unitSerial} · {t.unitName}
                                          </span>
                                          <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: "rgba(139,92,246,0.08)", color: "#8B5CF6" }}>
                                            {t.totalMarks} total marks
                                          </span>
                                          {t.years.map((yr) => (
                                            <span key={yr} style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>{yr}</span>
                                          ))}
                                          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", marginLeft: 4 }}>
                                            {isExpanded ? "Hide" : "View"} {t.questions?.length || 0} questions →
                                          </span>
                                        </div>
                                      </div>
                                      {/* Expandable questions */}
                                      <AnimatePresence>
                                        {isExpanded && t.questions && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            style={{ overflow: "hidden" }}
                                          >
                                            <div style={{ padding: "0 24px 20px", borderTop: "1px solid var(--border-default)" }}>
                                              {t.questions.map((q, qi) => (
                                                <div key={qi} style={{ padding: "12px 0", borderBottom: qi < t.questions.length - 1 ? "1px dashed var(--border-default)" : "none" }}>
                                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                                    <span style={{ padding: "2px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800, background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>{q.year}</span>
                                                    <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: "rgba(139,92,246,0.08)", color: "#8B5CF6" }}>{q.marks} marks</span>
                                                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)" }}>{q.qCode}</span>
                                                  </div>
                                                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.5, margin: 0 }}>{q.text}</p>
                                                </div>
                                              ))}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div style={{ textAlign: "center", padding: 40, color: "var(--text-tertiary)", fontSize: 15, fontWeight: 600 }}>No topic analysis available for the selected years.</div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : !yearsLoading && availableYears.length > 0 && (
                    <div className="text-center py-12">
                      <p className="text-[var(--text-tertiary)] font-medium">
                        Select years above to see the combined analysis
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Unit Weightage View (single year detail) */}
              {viewState === "unitWeightage" && (
                <motion.div
                  key="unitWeightage"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {weightageLoading ? (
                    <div className="flex justify-center py-20">
                      <Loader />
                    </div>
                  ) : unitWeightageData ? (
                    <div className="max-w-4xl mx-auto">
                      <div
                        data-tour="rtu-weightage"
                        className="bg-[var(--bg-secondary)] rounded-2xl p-6 mb-8 shadow-md border-2 border-[var(--action-primary)]/20 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--action-primary)]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] relative z-10">
                          Exam Strategy Analysis
                        </h3>
                        <p className="text-[var(--text-secondary)] text-sm relative z-10 mt-1">
                          Units are sorted by weightage. Focus on the top units
                          first to maximize your score.
                        </p>
                        <div className="mt-4 p-3 bg-[var(--color-warning-bg)]/10 border border-[var(--color-warning-bg)]/20 rounded-xl relative z-10">
                          <p className="text-xs text-[var(--color-warning-text)] font-medium">
                            <span className="font-bold">📋 Note:</span> The{" "}
                            {unitWeightageData?.totalPaperMarks || 98} marks
                            shown include all questions (including optional
                            ones). Students typically attempt only 70 marks
                            worth based on paper instructions.
                          </p>
                        </div>
                      </div>

                      {unitWeightageData.units.map((unit, index) => (
                        <UnitWeightageBar
                          key={unit.unitSerial}
                          unitSerial={unit.unitSerial}
                          unitName={unit.unitName}
                          totalMarks={unit.totalMarks}
                          weightagePercentage={unit.weightagePercentage}
                          weightageRatio={unit.weightageRatio}
                          youtubePlaylistUrl={unit.youtubePlaylistUrl}
                          questions={unit.questions}
                          index={index}
                          subjectName={selectedSubject?.name || ""}
                          year={selectedYear}
                          isAdmin={isAdmin}
                          chatgptLink={unitWeightageData.chatgptLink}
                          claudeLink={unitWeightageData.claudeLink}
                          onQuestionsUpdated={() =>
                            fetchUnitWeightage(
                              selectedSubject.name,
                              selectedYear
                            )
                          }
                          onLinksUpdated={() =>
                            fetchUnitWeightage(
                              selectedSubject.name,
                              selectedYear
                            )
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <p className="text-xl font-bold text-[var(--text-tertiary)]">
                        No analysis data available yet.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-20 text-center pb-8 border-t border-[var(--border-default)] pt-8 max-w-xl mx-auto">
              <p className="text-[var(--text-tertiary)] font-medium mb-4">
                Missing analysis for your year?
              </p>
              <button
                onClick={() => navigate("/suggest")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--action-primary)] to-[var(--action-hover)] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <FaEnvelope className="text-xl" />
                <span>Request via Messages</span>
              </button>
            </div>
          </>
      </div>
    </div>
  );
};

export default RTUExams;

