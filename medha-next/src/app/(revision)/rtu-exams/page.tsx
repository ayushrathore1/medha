"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiPost } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Book, Calendar, ChevronDown, ChevronRight, GraduationCap, Sparkles, TrendingUp, Wand2 } from "lucide-react";
import { MultiYearToggle, UnitWeightageBar, AIPredictionPanel } from "@/components/rtu-exams/rtu-components";

const SEM_4_SUBJECTS = [
  { name: "Discrete Mathematics Structure" },
  { name: "Technical Communication" },
  { name: "Microprocessor & Interfaces" },
  { name: "Database Management System" },
  { name: "Theory Of Computation" },
  { name: "Data Communication & Computer Networks" },
];

const KNOWN_UNIVERSITIES = ["RTU", "GGSIPU", "DTU", "AKTU"];

interface Subject {
  _id?: string;
  name: string;
  difficulty?: string;
  total?: number;
  viewed?: number;
}

interface MultiYearData {
  years: number[];
  totalPaperMarks: number;
  aggregatedUnits: Array<{
    unitSerial: number;
    unitName: string;
    averageMarks: number;
    perYear: Record<number, number>;
  }>;
  repeatedQuestions: Array<{
    text: string;
    count: number;
    unitSerial: number;
    unitName: string;
    avgMarks: number;
    years: number[];
  }>;
  topTopics: Array<{
    topic: string;
    count: number;
    unitSerial: number;
    unitName: string;
    totalMarks: number;
    years: number[];
    questions?: Array<{ year: number; marks: number; qCode: string; text: string }>;
  }>;
}

interface UnitWeightageData {
  totalPaperMarks: number;
  chatgptLink: string | null;
  claudeLink: string | null;
  units: Array<{
    unitSerial: number;
    unitName: string;
    totalMarks: number;
    weightagePercentage: number;
    weightageRatio: string;
    youtubePlaylistUrl?: string;
    questions: Array<{ qCode: string; text: string; marks: number; topic?: string; chatgptLink?: string | null; claudeLink?: string | null }>;
  }>;
}

interface AIPrediction {
  yearsAnalyzed: number[];
  cached: boolean;
  predictions: Array<{ topic: string; reason: string; priority: string; confidence: number }>;
}

function RTUExamsContent() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [viewState, setViewState] = useState<"semesters" | "subjects" | "multiYear" | "unitWeightage">("semesters");
  const [selectedSem, setSelectedSem] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);

  const [multiYearData, setMultiYearData] = useState<MultiYearData | null>(null);
  const [unitWeightageData, setUnitWeightageData] = useState<UnitWeightageData | null>(null);
  const [weightageLoading, setWeightageLoading] = useState(false);

  // AI predictions state
  const [aiPrediction, setAiPrediction] = useState<AIPrediction | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showAiPanel, setShowAiPanel] = useState(false);

  // Tabs for multi-year
  const [activeTab, setActiveTab] = useState<"questions" | "importance" | "repeated" | "topics">("questions");
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);

  // Sync URL params on mount
  useEffect(() => {
    const paramSem = searchParams.get("sem");
    const paramSubject = searchParams.get("subject");
    const paramYear = searchParams.get("year");
    const paramView = searchParams.get("view");

    if (paramSubject && paramYear) {
      const yr = parseInt(paramYear, 10);
      setSelectedSubject({ name: paramSubject });
      if (paramSem) setSelectedSem(parseInt(paramSem, 10));
      setSelectedYear(yr);
      setViewState("unitWeightage");
      fetchUnitWeightage(paramSubject, yr);
    } else if (paramSubject && paramView === "pyq") {
      setSelectedSubject({ name: paramSubject });
      if (paramSem) setSelectedSem(parseInt(paramSem, 10));
      setViewState("multiYear");
      fetchAvailableYears(paramSubject);
    } else if (paramSubject && paramSem) {
      const sem = parseInt(paramSem, 10);
      setSelectedSem(sem);
      setSelectedSubject({ name: paramSubject });
      setViewState("multiYear");
      fetchSubjects(sem);
      fetchAvailableYears(paramSubject);
    } else if (paramSem) {
      const sem = parseInt(paramSem, 10);
      setSelectedSem(sem);
      setViewState("subjects");
      fetchSubjects(sem);
    } else {
      setViewState("semesters");
    }
  }, [searchParams]);

  // Sync URL helpers
  const syncUrl = (params: { sem?: number | null; subject?: string | null; view?: string | null; year?: number | null }) => {
    const p = new URLSearchParams();
    if (params.sem) p.set("sem", params.sem.toString());
    if (params.subject) p.set("subject", params.subject);
    if (params.view) p.set("view", params.view);
    if (params.year) p.set("year", params.year.toString());
    router.replace(`/rtu-exams?${p.toString()}`);
  };

  const fetchSubjects = async (sem = 3) => {
    try {
      setLoading(true);
      if (sem === 4) {
        setSubjects(SEM_4_SUBJECTS);
      } else {
        const res = await apiGet<{ topics: Subject[] }>("/api/rtu/3rd-sem");
        setSubjects(res.topics || []);
      }
    } catch (error) {
      console.error("Error fetching RTU subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableYears = async (subjectName: string) => {
    try {
      setLoading(true);
      const res = await apiGet<{ success: boolean; years: number[] }>(
        `/api/rtu/subjects/${encodeURIComponent(subjectName)}/years`
      );
      if (res.success) {
        setAvailableYears(res.years);
      }
    } catch (error) {
      console.error("Error fetching available years:", error);
      setAvailableYears([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnitWeightage = async (subjectName: string, year: number) => {
    try {
      setWeightageLoading(true);
      const res = await apiGet<UnitWeightageData & { success: boolean }>(
        `/api/rtu/subjects/${encodeURIComponent(subjectName)}/years/${year}/weightage`
      );
      if (res.success) {
        setUnitWeightageData(res);
      }
    } catch (error) {
      console.error("Error fetching unit weightage:", error);
      setUnitWeightageData(null);
    } finally {
      setWeightageLoading(false);
    }
  };

  const fetchMultiYearWeightage = async (subjectName: string, years: number[]) => {
    try {
      setWeightageLoading(true);
      const res = await apiGet<MultiYearData & { success: boolean }>(
        `/api/rtu/subjects/${encodeURIComponent(subjectName)}/multi-year-weightage?years=${years.join(",")}`
      );
      if (res.success) {
        setMultiYearData(res);
      }
    } catch (error) {
      console.error("Error fetching multi-year weightage:", error);
      setMultiYearData(null);
    } finally {
      setWeightageLoading(false);
    }
  };

  const fetchAiPrediction = async (subjectName: string, years: number[]) => {
    try {
      setAiLoading(true);
      setAiError(null);
      setShowAiPanel(true);

      const res = await apiPost<AIPrediction & { success: boolean }>(
        `/api/rtu/subjects/${encodeURIComponent(subjectName)}/ai-predict-topics`,
        { years }
      );

      if (res.success) {
        setAiPrediction(res);
      } else {
        setAiError("Prediction failed.");
      }
    } catch (error: any) {
      const msg = error.message || "AI prediction failed. Try again later.";
      setAiError(msg);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubjectClick = async (subject: Subject) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setSelectedSubject(subject);
    setViewState("multiYear");
    syncUrl({ sem: selectedSem, subject: subject.name, view: "pyq" });
    setShowAiPanel(false);
    setAiPrediction(null);
    setAiError(null);
    await fetchAvailableYears(subject.name);
  };

  useEffect(() => {
    if (availableYears.length > 0 && viewState === "multiYear" && selectedSubject) {
      setSelectedYears(availableYears);
      fetchMultiYearWeightage(selectedSubject.name, availableYears);
    }
  }, [availableYears, viewState, selectedSubject]);

  const handleYearSelect = async (year: number) => {
    setSelectedYear(year);
    setViewState("unitWeightage");
    syncUrl({ sem: selectedSem, subject: selectedSubject?.name, year });
    if (selectedSubject) {
      await fetchUnitWeightage(selectedSubject.name, year);
    }
  };

  const handleYearToggle = async (yearOrAll: number | "all", soloMode?: boolean) => {
    if (!selectedSubject) return;

    if (yearOrAll === "all") {
      setSelectedYears([...availableYears]);
      await fetchMultiYearWeightage(selectedSubject.name, availableYears);
      return;
    }

    if (soloMode) {
      setSelectedYears([yearOrAll]);
      await fetchMultiYearWeightage(selectedSubject.name, [yearOrAll]);
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
        return prev;
      }
      fetchMultiYearWeightage(selectedSubject!.name, next);
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
      if (selectedSem) fetchSubjects(selectedSem);
    } else if (viewState === "subjects") {
      setViewState("semesters");
      setSelectedSem(null);
      syncUrl({});
    }
  };

  const getSemLabel = (sem: number | null) => {
    if (sem === 1) return "1st";
    if (sem === 2) return "2nd";
    if (sem === 3) return "3rd";
    if (sem === 4) return "4th";
    return `${sem}th`;
  };

  const getHeaderTitle = () => {
    switch (viewState) {
      case "semesters":
        return "PYQ Archives";
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
        return "Access university previous year papers, weightage distributions, and AI predictions.";
      case "subjects":
        return "Select a subject to begin unit weightage analysis.";
      case "multiYear":
        return "Aggregate analysis across years or get AI-powered exam guides.";
      case "unitWeightage":
        return `Unit-wise question breakdown for ${unitWeightageData?.totalPaperMarks || 98} marks paper.`;
      default:
        return "";
    }
  };

  if (loading && subjects.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-8 max-w-7xl mx-auto">
      {/* Back navigation */}
      {viewState !== "semesters" && (
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-semibold text-sm transition-all mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back
        </button>
      )}

      {/* Header */}
      <motion.div
        key={viewState}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--secondary)] border border-[var(--border)] text-xs font-semibold text-[var(--primary)] mb-3">
          <GraduationCap size={14} /> PYQ Exam Analysis
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-[var(--foreground)] tracking-tight mb-2">{getHeaderTitle()}</h1>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed font-medium">{getHeaderSubtitle()}</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Semesters View */}
        {viewState === "semesters" && (
          <motion.div
            key="semesters"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {[
              { sem: 3, label: "3rd Semester", color: "#7DC67A", subjects: 7, desc: "CS / AIDS · RTU Syllabus" },
              { sem: 4, label: "4th Semester", color: "#8B5CF6", subjects: 6, desc: "CS / AIDS · RTU Syllabus" },
            ].map((s, idx) => (
              <motion.div
                key={s.sem}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(125,198,122,0.1)", borderColor: s.color }}
                onClick={() => {
                  setSelectedSem(s.sem);
                  fetchSubjects(s.sem);
                  setViewState("subjects");
                  syncUrl({ sem: s.sem });
                }}
                className="p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] cursor-pointer text-center relative overflow-hidden transition-all"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md"
                  style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}dd)`, boxShadow: `0 8px 20px ${s.color}25` }}
                >
                  <Book size={28} className="text-white" />
                </div>
                <h2 className="text-xl font-extrabold text-[var(--foreground)] mb-2">{s.label}</h2>
                <p className="text-xs text-[var(--muted-foreground)] mb-6">{s.desc}</p>
                <div
                  className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={{ background: `${s.color}15`, color: s.color }}
                >
                  {s.subjects} Subjects <ChevronRight size={12} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Subjects View */}
        {viewState === "subjects" && (
          <motion.div
            key="subjects"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {subjects.map((sub, idx) => {
              const hasAnalysis = [
                "Discrete Mathematics Structure",
                "Technical Communication",
                "Microprocessor & Interfaces",
                "Database Management System",
                "Theory Of Computation",
                "Data Communication & Computer Networks",
                "Advanced Engineering Mathematics",
                "Data Structures and Algorithms",
                "Object Oriented Programming",
                "Digital Electronics",
                "Software Engineering",
                "Managerial Economics and Financial Accounting",
              ].includes(sub.name);

              return (
                <motion.div
                  key={sub.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  whileHover={{ y: -4, borderColor: "var(--primary)", boxShadow: "0 10px 25px rgba(99,102,241,0.06)" }}
                  onClick={() => handleSubjectClick(sub)}
                  className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary)]/5 rounded-full blur-xl pointer-events-none" />

                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-4 border border-[var(--primary)]/10">
                      <Book size={18} />
                    </div>
                    <h3 className="font-extrabold text-base text-[var(--foreground)] leading-snug mb-3">{sub.name}</h3>
                  </div>

                  {hasAnalysis && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/15 text-[10px] font-bold self-start mt-4">
                      <TrendingUp size={10} /> Includes Weightage Analysis
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Multi-Year view */}
        {viewState === "multiYear" && (
          <motion.div key="multiYear" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex flex-col items-center gap-4 mb-8">
              <MultiYearToggle
                years={availableYears}
                selectedYears={selectedYears}
                onToggleYear={handleYearToggle}
                loading={loading}
              />

              {availableYears.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (!showAiPanel) {
                      fetchAiPrediction(selectedSubject!.name, selectedYears.length > 0 ? selectedYears : availableYears);
                    } else {
                      setShowAiPanel(false);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer border-none ${
                    showAiPanel
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] border-2 border-[var(--primary)]"
                      : "bg-gradient-to-r from-[var(--primary)] to-[#d46936] text-white shadow-[var(--primary)]/25 hover:shadow-lg"
                  }`}
                >
                  <Wand2 size={14} />
                  {showAiPanel ? "Hide AI Prediction" : "AI Predict Important Topics"}
                </motion.button>
              )}
            </div>

            {showAiPanel && (
              <div className="max-w-4xl mx-auto">
                <AIPredictionPanel
                  predictions={aiPrediction?.predictions}
                  yearsAnalyzed={aiPrediction?.yearsAnalyzed}
                  loading={aiLoading}
                  error={aiError}
                  cached={aiPrediction?.cached}
                  onClose={() => setShowAiPanel(false)}
                  onRetry={() => fetchAiPrediction(selectedSubject!.name, selectedYears)}
                />
              </div>
            )}

            {weightageLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
              </div>
            ) : multiYearData ? (
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-center gap-2 bg-[var(--secondary)] p-1 rounded-2xl border border-[var(--border)] mb-6 max-w-md mx-auto">
                  {[
                    { key: "questions", icon: "📝", label: "Papers" },
                    { key: "importance", icon: "📊", label: "Importance" },
                    { key: "repeated", icon: "🔁", label: "Repeated Qs" },
                    { key: "topics", icon: "📌", label: "Top Topics" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === tab.key
                          ? "bg-[var(--primary)] text-white shadow-sm"
                          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <span className="mr-1">{tab.icon}</span> {tab.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "questions" && (
                    <motion.div
                      key="questionsView"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="bg-[var(--secondary)] rounded-2xl p-5 mb-6 border border-[var(--border)] relative overflow-hidden">
                        <h3 className="font-extrabold text-base text-[var(--foreground)]">Aggregated Question Papers</h3>
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Select a specific year paper below to see unit-by-unit questions and detailed weightage analysis.</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {multiYearData.years.sort().map((year) => (
                          <motion.button
                            key={year}
                            whileHover={{ y: -3, borderColor: "var(--primary)", boxShadow: "0 6px 15px rgba(99,102,241,0.06)" }}
                            onClick={() => handleYearSelect(year)}
                            className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-left cursor-pointer transition-all flex flex-col justify-between"
                          >
                            <div className="font-black text-xl text-[var(--foreground)]">{year}</div>
                            <span className="text-[10px] font-bold text-[var(--primary)] mt-3">Explore Questions →</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "importance" && (
                    <motion.div
                      key="importanceView"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="bg-[var(--secondary)] rounded-2xl p-5 border border-[var(--border)]">
                        <h3 className="font-extrabold text-base text-[var(--foreground)]">Aggregated Unit Weightage</h3>
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Average marks weightage distribution sorted across selected papers ({selectedYears.join(", ")}).</p>
                      </div>

                      {multiYearData.aggregatedUnits.map((unit) => {
                        const barColors = ["#7DC67A", "#8B5CF6", "#3b82f6", "#f59e0b", "#ef4444", "#06b6d4"];
                        return (
                          <div key={unit.unitSerial} className="p-5 bg-[var(--card)] border border-[var(--border)] rounded-2xl">
                            <div className="flex justify-between items-center mb-3">
                              <div>
                                <span className="text-xs font-bold text-[var(--muted-foreground)] mr-1.5">Unit {unit.unitSerial}</span>
                                <span className="font-extrabold text-sm text-[var(--foreground)]">{unit.unitName}</span>
                              </div>
                              <span className="font-extrabold text-xs text-[var(--primary)] bg-[var(--primary)]/10 px-2.5 py-1 rounded-lg">
                                Avg: {unit.averageMarks} Marks
                              </span>
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                              {Object.entries(unit.perYear).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([year, marks], i) => (
                                <div key={year} className="flex items-center gap-3">
                                  <span className="text-xs font-bold text-[var(--muted-foreground)] w-10 text-right">{year}</span>
                                  <div className="flex-1 h-3 rounded-full bg-[var(--secondary)] overflow-hidden">
                                    <div
                                      className="h-full rounded-full"
                                      style={{
                                        width: `${(marks / (multiYearData.totalPaperMarks || 98)) * 100}%`,
                                        background: barColors[i % barColors.length],
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs font-extrabold text-[var(--foreground)] w-6 text-right">{marks}m</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}

                  {activeTab === "repeated" && (
                    <motion.div
                      key="repeatedView"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="bg-[var(--secondary)] rounded-2xl p-5 border border-[var(--border)]">
                        <h3 className="font-extrabold text-base text-[var(--foreground)]">🔁 Most Repeated Questions</h3>
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">High-frequency questions asked multiple times across exam papers.</p>
                      </div>

                      {multiYearData.repeatedQuestions && multiYearData.repeatedQuestions.length > 0 ? (
                        multiYearData.repeatedQuestions.map((q, idx) => (
                          <div key={idx} className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-500/10 text-red-500 border border-red-500/20">
                                {"🔥".repeat(Math.min(q.count, 3))} Asked {q.count}x
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--secondary)] text-[var(--muted-foreground)] border border-[var(--border)]">
                                Unit {q.unitSerial} · {q.unitName}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--primary)]/10 text-[var(--primary)]">
                                Avg {q.avgMarks}m
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-[var(--foreground)] leading-relaxed mb-3">{q.text}</p>
                            <div className="flex gap-1.5 flex-wrap">
                              {q.years.map((yr) => (
                                <span key={yr} className="px-2 py-0.5 text-[10px] font-bold bg-[var(--secondary)] text-[var(--muted-foreground)] rounded border border-[var(--border)]">{yr}</span>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-12 text-center rounded-2xl bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)]">
                          <p className="font-bold text-sm">No repeated questions found across selected years.</p>
                          <p className="text-xs">Try selecting more years above.</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "topics" && (
                    <motion.div
                      key="topicsView"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="bg-[var(--secondary)] rounded-2xl p-5 border border-[var(--border)]">
                        <h3 className="font-extrabold text-base text-[var(--foreground)]">📌 Most Tested Topics</h3>
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Exam topics ranked by frequency and aggregated marks weightage.</p>
                      </div>

                      {multiYearData.topTopics && multiYearData.topTopics.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {multiYearData.topTopics.map((t, idx) => {
                            const isExpanded = expandedTopic === idx;
                            const heat = t.count >= 4 ? 3 : t.count >= 3 ? 2 : 1;
                            const heatColor = heat >= 3 ? "text-red-500 bg-red-500/10 border-red-500/20" : heat >= 2 ? "text-amber-500 bg-amber-500/10 border-amber-500/20" : "text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)]/20";

                            return (
                              <div key={idx} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden transition-all">
                                <div
                                  onClick={() => setExpandedTopic(isExpanded ? null : idx)}
                                  className="p-5 cursor-pointer flex justify-between items-start gap-4 hover:bg-[var(--secondary)]/40 transition-all select-none"
                                >
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-extrabold text-sm text-[var(--foreground)] leading-snug">{t.topic}</h4>
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                      <span className="px-2 py-0.5 rounded bg-[var(--secondary)] text-[var(--muted-foreground)] border border-[var(--border)] text-[10px] font-bold">
                                        Unit {t.unitSerial} · {t.unitName}
                                      </span>
                                      <span className="px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-bold">
                                        {t.totalMarks} total marks
                                      </span>
                                      {t.years.map((yr) => (
                                        <span key={yr} className="px-1.5 py-0.5 text-[9px] font-bold bg-[var(--secondary)] text-[var(--muted-foreground)] rounded border border-[var(--border)]">{yr}</span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${heatColor}`}>
                                      {"🔥".repeat(heat)} {t.count}x
                                    </span>
                                    <ChevronDown
                                      size={14}
                                      className={`text-[var(--muted-foreground)] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                    />
                                  </div>
                                </div>

                                <AnimatePresence>
                                  {isExpanded && t.questions && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden border-t border-[var(--border)] bg-[var(--secondary)]/10"
                                    >
                                      <div className="p-5 space-y-3.5">
                                        {t.questions.map((q, qi) => (
                                          <div key={qi} className="pb-3 border-b border-dashed border-[var(--border)] last:border-none last:pb-0">
                                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] rounded">{q.year}</span>
                                              <span className="px-2 py-0.5 text-[10px] font-bold bg-[var(--primary)]/15 text-[var(--primary)] rounded">{q.marks} marks</span>
                                              <span className="text-[10px] font-bold text-[var(--muted-foreground)]">{q.qCode}</span>
                                            </div>
                                            <p className="text-xs font-medium text-[var(--foreground)] leading-relaxed">{q.text}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-12 text-center rounded-2xl bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)]">
                          No topic analysis available.
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null}
          </motion.div>
        )}

        {/* Single year unit weightage detail */}
        {viewState === "unitWeightage" && (
          <motion.div key="unitWeightage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {weightageLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
              </div>
            ) : unitWeightageData ? (
              <div className="max-w-4xl mx-auto">
                <div className="bg-[var(--secondary)] rounded-2xl p-5 mb-6 border border-[var(--border)]">
                  <h3 className="font-extrabold text-base text-[var(--foreground)]">Unit Weightage & Exam Strategy</h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Focus on units with higher weightage percentage to maximize your preparation. Select units to see questions.</p>
                </div>

                <div className="space-y-4">
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
                      isAdmin={user?.role === "admin"}
                      onQuestionsUpdated={() => fetchUnitWeightage(selectedSubject!.name, selectedYear!)}
                      onLinksUpdated={() => fetchUnitWeightage(selectedSubject!.name, selectedYear!)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-xl mx-auto">
                <p className="font-bold text-sm text-[var(--muted-foreground)]">No data available for this paper yet.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-16 border-t border-[var(--border)] pt-8 text-center max-w-md mx-auto">
        <p className="text-xs text-[var(--muted-foreground)] font-medium mb-3">Syllabus or papers missing for your branch?</p>
        <button
          onClick={() => router.push("/suggest")}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[var(--primary)] text-white text-xs font-bold hover:opacity-90 transition-all shadow-md cursor-pointer border-none"
        >
          Request missing subjects
        </button>
      </div>
    </div>
  );
}

export default function RTUExamsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    }>
      <RTUExamsContent />
    </Suspense>
  );
}
