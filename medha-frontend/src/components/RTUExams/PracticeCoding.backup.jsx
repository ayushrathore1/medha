/**
 * PracticeCoding Component
 * Main component for C/C++ OOPs coding practice
 * Integrates CodeEditor, QuestionPanel, and OutputPanel
 */
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaCode,
  FaList,
  FaFilter,
  FaSearch,
  FaTrophy,
  FaCheckCircle,
  FaClock,
  FaFire,
  FaChevronDown,
  FaPlay,
  FaPaperPlane,
  FaRedo,
  FaArrowLeft,
  FaTerminal,
  FaBookOpen,
  FaLaptopCode,
} from "react-icons/fa";

import CodeEditor from "./CodeEditor";
import OutputPanel from "./OutputPanel";
import QuestionPanel from "./QuestionPanel";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

// Category configuration with icons and colors
const CATEGORIES = {
  all: {
    name: "All Questions",
    icon: "📚",
    color: "from-purple-500 to-indigo-500",
  },
  "classes-objects": {
    name: "Classes & Objects",
    icon: "🎯",
    color: "from-blue-500 to-cyan-500",
  },
  inheritance: {
    name: "Inheritance",
    icon: "🌳",
    color: "from-green-500 to-emerald-500",
  },
  polymorphism: {
    name: "Polymorphism",
    icon: "🔄",
    color: "from-purple-500 to-pink-500",
  },
  encapsulation: {
    name: "Encapsulation",
    icon: "📦",
    color: "from-orange-500 to-amber-500",
  },
  abstraction: {
    name: "Abstraction",
    icon: "🎨",
    color: "from-pink-500 to-rose-500",
  },
  "constructors-destructors": {
    name: "Constructors & Destructors",
    icon: "🏗️",
    color: "from-teal-500 to-cyan-500",
  },
  "operator-overloading": {
    name: "Operator Overloading",
    icon: "➕",
    color: "from-red-500 to-orange-500",
  },
  templates: {
    name: "Templates",
    icon: "📋",
    color: "from-indigo-500 to-purple-500",
  },
  "exception-handling": {
    name: "Exception Handling",
    icon: "⚠️",
    color: "from-yellow-500 to-orange-500",
  },
  "file-handling": {
    name: "File Handling",
    icon: "📁",
    color: "from-gray-500 to-slate-500",
  },
  stl: { name: "STL", icon: "📚", color: "from-blue-600 to-indigo-600" },
  pointers: {
    name: "Pointers & Memory",
    icon: "🎯",
    color: "from-red-600 to-pink-600",
  },
  "basic-syntax": {
    name: "Basic Syntax",
    icon: "📝",
    color: "from-green-600 to-teal-600",
  },
};

const DIFFICULTIES = [
  { value: "all", label: "All Levels", color: "text-[var(--text-secondary)]" },
  { value: "easy", label: "Easy", color: "text-green-400" },
  { value: "medium", label: "Medium", color: "text-yellow-400" },
  { value: "hard", label: "Hard", color: "text-red-400" },
];

const PracticeCoding = () => {
  // View state - "editor" shows the free code editor, "questions" shows the question list, "practice" shows question + editor
  const [view, setView] = useState("editor"); // "editor" | "questions" | "practice"

  // Questions state
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Code editor state
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [input, setInput] = useState("");

  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState("");
  const [stderr, setStderr] = useState("");
  const [compileOutput, setCompileOutput] = useState("");
  const [executionStatus, setExecutionStatus] = useState("idle");
  const [executionTime, setExecutionTime] = useState(null);
  const [memoryUsed, setMemoryUsed] = useState(null);
  const [testResults, setTestResults] = useState(null);

  // Hints and solution
  const [currentHint, setCurrentHint] = useState(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solution, setSolution] = useState(null);

  // User stats
  const [userStats, setUserStats] = useState(null);

  // LeetCode-style console tabs: "testcase" or "result"
  const [consoleTab, setConsoleTab] = useState("testcase");

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    try {
      setQuestionsLoading(true);
      const token = localStorage.getItem("token");

      const params = new URLSearchParams();
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (selectedDifficulty !== "all")
        params.append("difficulty", selectedDifficulty);

      const res = await axios.get(
        `${baseUrl}/api/practice/questions?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setQuestions(res.data.questions);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setQuestionsLoading(false);
    }
  }, [selectedCategory, selectedDifficulty]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/api/practice/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch user stats
  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/api/practice/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setUserStats(res.data.stats);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchCategories();
    fetchUserStats();
  }, [fetchQuestions]);

  // Select a question
  const handleSelectQuestion = async (question) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${baseUrl}/api/practice/questions/${question._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setSelectedQuestion(res.data.question);
        setCode(
          res.data.question.starterCode ||
            getDefaultCode(res.data.question.language)
        );
        setLanguage(res.data.question.language);
        setView("practice");

        // Reset execution state
        clearOutput();
        setCurrentHint(null);
        setShowSolution(false);
        setSolution(null);
      }
    } catch (error) {
      console.error("Error fetching question details:", error);
    }
  };

  // Get default starter code
  const getDefaultCode = (lang) => {
    if (lang === "cpp") {
      return `#include <iostream>
using namespace std;

int main() {
    // Write your C++ code here
    cout << "Hello, World!" << endl;
    
    return 0;
}`;
    }
    return `#include <stdio.h>

int main() {
    // Write your C code here
    printf("Hello, World!\\n");
    
    return 0;
}`;
  };

  // Initialize default code on mount
  useEffect(() => {
    if (!code) {
      setCode(getDefaultCode(language));
    }
  }, []);

  // Clear output
  const clearOutput = () => {
    setOutput("");
    setStderr("");
    setCompileOutput("");
    setExecutionStatus("idle");
    setExecutionTime(null);
    setMemoryUsed(null);
    setTestResults(null);
  };

  // Run code
  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      setExecutionStatus("running");
      setConsoleTab("result"); // Switch to result tab like LeetCode
      clearOutput();

      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${baseUrl}/api/practice/execute`,
        { code, language, input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setOutput(res.data.output);
        setStderr(res.data.stderr);
        setCompileOutput(res.data.compileOutput);
        setExecutionStatus(res.data.status);
        setExecutionTime(res.data.executionTime);
        setMemoryUsed(res.data.memoryUsed);

        // If input is required, switch back to testcase tab
        if (res.data.status === "input_required") {
          setConsoleTab("testcase");
        }
      }
    } catch (error) {
      console.error("Error running code:", error);
      setExecutionStatus("error");
      setStderr(error.response?.data?.message || "Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  };

  // Submit solution
  const handleSubmitSolution = async () => {
    if (!selectedQuestion) return;

    try {
      setIsSubmitting(true);
      setExecutionStatus("running");

      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${baseUrl}/api/practice/questions/${selectedQuestion._id}/submit`,
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setTestResults(res.data.results);
        setExecutionStatus(res.data.allPassed ? "success" : "error");
        setOutput(res.data.message);

        // Refresh stats if solved
        if (res.data.allPassed) {
          fetchUserStats();
          // Update question status locally
          setSelectedQuestion((prev) => ({
            ...prev,
            userProgress: {
              status: "solved",
              attempts: res.data.progress.totalAttempts,
            },
          }));
        }
      }
    } catch (error) {
      console.error("Error submitting solution:", error);
      setExecutionStatus("error");
      setStderr(error.response?.data?.message || "Failed to submit solution");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get hint
  const handleGetHint = async (hintIndex) => {
    if (!selectedQuestion) return;

    try {
      setIsLoadingHint(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${baseUrl}/api/practice/questions/${selectedQuestion._id}/hint`,
        { hintIndex },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setCurrentHint(res.data);
      }
    } catch (error) {
      console.error("Error getting hint:", error);
    } finally {
      setIsLoadingHint(false);
    }
  };

  // View solution
  const handleViewSolution = async () => {
    if (showSolution) {
      setShowSolution(false);
      return;
    }

    if (!selectedQuestion) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${baseUrl}/api/practice/questions/${selectedQuestion._id}/solution`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSolution(res.data);
        setShowSolution(true);
      }
    } catch (error) {
      console.error("Error getting solution:", error);
    }
  };

  // Reset code to starter
  const handleResetCode = () => {
    if (selectedQuestion) {
      setCode(selectedQuestion.starterCode || getDefaultCode(language));
    } else {
      setCode(getDefaultCode(language));
    }
  };

  // Switch language for free practice
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (!selectedQuestion) {
      setCode(getDefaultCode(newLang));
    }
  };

  // Navigate to next/previous question
  const currentIndex = questions.findIndex(
    (q) => q._id === selectedQuestion?._id
  );
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < questions.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      handleSelectQuestion(questions[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      handleSelectQuestion(questions[currentIndex + 1]);
    }
  };

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        q.title.toLowerCase().includes(query) ||
        q.description?.toLowerCase().includes(query) ||
        q.tags?.some((t) => t.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // Render Editor View - Main code editor without questions
  const renderEditorView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-[calc(100vh-180px)] flex flex-col gap-3 overflow-hidden"
    >
      {/* Premium Editor Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f0f23] via-[#1a1a2e] to-[#16213e] border border-[#2a2a4a] shadow-xl flex-shrink-0">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-cyan-500/5 to-blue-600/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-4">
            {/* MEDHA Branding */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <FaCode className="text-white text-lg" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a2e]"></div>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg tracking-tight">
                  MEDHA Practice
                </h3>
                <p className="text-xs text-cyan-400/80">
                  Code • Compile • Execute
                </p>
              </div>
            </div>

            {/* Language Selector - Premium Style */}
            <div className="flex items-center gap-1 bg-[#0d0d1a] rounded-xl p-1 border border-[#2a2a4a]">
              <button
                onClick={() => handleLanguageChange("cpp")}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  language === "cpp"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                C++
              </button>
              <button
                onClick={() => handleLanguageChange("c")}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  language === "c"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                C
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setView("questions")}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-violet-300 border border-violet-500/30 hover:border-violet-400/50 hover:from-violet-600/30 hover:to-purple-600/30 rounded-xl transition-all duration-300"
            >
              <FaBookOpen />
              Practice Problems
            </button>

            <button
              onClick={handleResetCode}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/10"
            >
              <FaRedo />
              Reset
            </button>

            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              <FaPlay className={isRunning ? "animate-pulse" : ""} />
              {isRunning ? "Executing..." : "Run Code"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor Area - Fills remaining height */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden">
        {/* Code Editor - scrolls internally */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 min-h-0 flex flex-col"
        >
          <div className="flex-1 min-h-0 rounded-2xl overflow-hidden border border-[#2a2a4a] shadow-2xl shadow-black/20">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              onRun={handleRunCode}
              isRunning={isRunning}
              minHeight="100%"
            />
          </div>
        </motion.div>

        {/* Right Side - LeetCode Style Console */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 min-h-0 flex flex-col"
        >
          <div className="flex-1 min-h-0 bg-[#1a1a2e] rounded-2xl border border-[#2a2a4a] flex flex-col overflow-hidden shadow-2xl shadow-black/20">
            {/* LeetCode-style Tab Header */}
            <div className="flex items-center justify-between px-2 py-2 bg-[#0f0f23] border-b border-[#2a2a4a]">
              <div className="flex items-center">
                {/* Testcase Tab */}
                <button
                  onClick={() => setConsoleTab("testcase")}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    consoleTab === "testcase"
                      ? "bg-[#2a2a4a] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#2a2a4a]/50"
                  }`}
                >
                  <span className="text-cyan-400">⌨</span>
                  Testcase
                </button>

                {/* Result Tab */}
                <button
                  onClick={() => setConsoleTab("result")}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    consoleTab === "result"
                      ? "bg-[#2a2a4a] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#2a2a4a]/50"
                  }`}
                >
                  {executionStatus === "success" && (
                    <span className="text-green-400">✓</span>
                  )}
                  {executionStatus === "running" && (
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                  )}
                  {(executionStatus === "compile_error" ||
                    executionStatus === "runtime_error" ||
                    executionStatus === "error") && (
                    <span className="text-red-400">✗</span>
                  )}
                  {executionStatus === "input_required" && (
                    <span className="text-amber-400">⚠</span>
                  )}
                  {executionStatus === "idle" && (
                    <span className="text-gray-500">○</span>
                  )}
                  Result
                </button>
              </div>

              <button
                onClick={clearOutput}
                className="text-xs text-gray-500 hover:text-white px-3 py-1.5 hover:bg-[#2a2a4a] rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <AnimatePresence mode="wait">
                {consoleTab === "testcase" ? (
                  /* Testcase Tab Content */
                  <motion.div
                    key="testcase"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 flex flex-col overflow-hidden p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-300">
                        Custom Input
                      </span>
                      <span className="text-xs text-gray-500">
                        Enter your test input below
                      </span>
                    </div>

                    {/* Input Area - LeetCode style */}
                    <div className="flex-1 min-h-0">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Enter input values here...\n\nExample:\n5 10\n\nOr for multiple inputs:\n3\nHello\nWorld\nTest`}
                        className="w-full h-full px-4 py-3 bg-[#0f0f23] border border-[#2a2a4a] rounded-xl text-sm font-mono text-gray-200 resize-none focus:outline-none focus:border-cyan-500/50 placeholder-gray-600 transition-colors"
                      />
                    </div>

                    {/* Quick tip */}
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <span className="text-cyan-400">💡</span>
                      <span>
                        Input will be passed to your program via stdin
                        (cin/scanf)
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  /* Result Tab Content */
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 overflow-auto p-4 font-mono text-sm"
                  >
                    {executionStatus === "running" ? (
                      /* Running State */
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400">Running your code...</p>
                      </div>
                    ) : output || stderr || compileOutput ? (
                      /* Results */
                      <div className="space-y-4">
                        {/* Status Header */}
                        <div
                          className={`flex items-center gap-3 p-4 rounded-xl border ${
                            executionStatus === "success"
                              ? "bg-green-500/10 border-green-500/30"
                              : executionStatus === "input_required"
                                ? "bg-amber-500/10 border-amber-500/30"
                                : "bg-red-500/10 border-red-500/30"
                          }`}
                        >
                          {executionStatus === "success" && (
                            <>
                              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <FaCheckCircle className="text-green-400 text-xl" />
                              </div>
                              <div>
                                <p className="text-green-400 font-semibold">
                                  Executed Successfully
                                </p>
                                <p className="text-xs text-gray-400">
                                  {executionTime &&
                                    `Runtime: ${executionTime}ms`}
                                  {memoryUsed && ` • Memory: ${memoryUsed}KB`}
                                </p>
                              </div>
                            </>
                          )}
                          {executionStatus === "input_required" && (
                            <>
                              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                <span className="text-amber-400 text-xl">
                                  ⚠️
                                </span>
                              </div>
                              <div>
                                <p className="text-amber-400 font-semibold">
                                  Input Required
                                </p>
                                <p className="text-xs text-gray-400">
                                  Your code needs input. Go to Testcase tab to
                                  add it.
                                </p>
                              </div>
                            </>
                          )}
                          {(executionStatus === "compile_error" ||
                            executionStatus === "runtime_error" ||
                            executionStatus === "error") && (
                            <>
                              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                                <span className="text-red-400 text-xl">✗</span>
                              </div>
                              <div>
                                <p className="text-red-400 font-semibold">
                                  {executionStatus === "compile_error"
                                    ? "Compilation Error"
                                    : "Runtime Error"}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Check the error details below
                                </p>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Input Echo - Show what input was used */}
                        {input && executionStatus !== "input_required" && (
                          <div>
                            <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">
                              Input
                            </div>
                            <pre className="p-3 bg-[#0f0f23] rounded-lg border border-[#2a2a4a] text-gray-300 whitespace-pre-wrap text-xs">
                              {input}
                            </pre>
                          </div>
                        )}

                        {/* Compilation Errors */}
                        {compileOutput && (
                          <div>
                            <div className="text-xs text-yellow-400 mb-2 font-semibold uppercase tracking-wider">
                              Compiler Output
                            </div>
                            <pre className="p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/20 text-yellow-300/80 whitespace-pre-wrap text-xs">
                              {compileOutput}
                            </pre>
                          </div>
                        )}

                        {/* Stderr */}
                        {stderr && executionStatus !== "input_required" && (
                          <div>
                            <div className="text-xs text-red-400 mb-2 font-semibold uppercase tracking-wider">
                              Error
                            </div>
                            <pre className="p-3 bg-red-500/5 rounded-lg border border-red-500/20 text-red-300/80 whitespace-pre-wrap text-xs">
                              {stderr}
                            </pre>
                          </div>
                        )}

                        {/* Output */}
                        {output && (
                          <div>
                            <div className="text-xs text-green-400 mb-2 font-semibold uppercase tracking-wider">
                              Output
                            </div>
                            <pre className="p-3 bg-[#0f0f23] rounded-lg border border-green-500/20 text-gray-200 whitespace-pre-wrap">
                              {output}
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Idle State */
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <FaTerminal className="text-4xl mb-3 opacity-30" />
                        <p className="font-medium">No output yet</p>
                        <p className="text-xs mt-1">
                          Run your code to see results
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-xs">
                          <kbd className="px-2 py-1 bg-[#2a2a4a] rounded text-cyan-400 font-mono">
                            Ctrl
                          </kbd>
                          <span>+</span>
                          <kbd className="px-2 py-1 bg-[#2a2a4a] rounded text-cyan-400 font-mono">
                            Enter
                          </kbd>
                          <span className="ml-2 text-gray-600">to run</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Compact Tips Bar */}
      <div className="flex items-center justify-center gap-6 px-4 py-2.5 bg-gradient-to-r from-[#0f0f23] to-[#1a1a2e] border border-[#2a2a4a] rounded-xl flex-shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <kbd className="px-2 py-1 bg-[#0d0d1a] rounded text-cyan-400 font-mono border border-[#2a2a4a]">
            Ctrl+Enter
          </kbd>
          <span className="text-gray-500">Run</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <kbd className="px-2 py-1 bg-[#0d0d1a] rounded text-cyan-400 font-mono border border-[#2a2a4a]">
            Tab
          </kbd>
          <span className="text-gray-500">Indent</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <kbd className="px-2 py-1 bg-[#0d0d1a] rounded text-cyan-400 font-mono border border-[#2a2a4a]">
            Ctrl+Z
          </kbd>
          <span className="text-gray-500">Undo</span>
        </div>
      </div>
    </motion.div>
  );

  // Render question list view
  const renderListView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Premium Navigation Bar */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#0f0f23] to-[#1a1a2e] rounded-2xl border border-[#2a2a4a]">
        <button
          onClick={() => setView("editor")}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/10"
        >
          <FaArrowLeft />
          Code Playground
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <FaBookOpen className="text-violet-400" />
          <span>Select a challenge to begin practicing</span>
        </div>
      </div>

      {/* Premium Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#0f0f23] to-[#1a1a2e] border border-purple-500/30 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25">
              <FaBookOpen className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {userStats?.totalQuestions || 0}
              </p>
              <p className="text-xs text-gray-400">Total Challenges</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#0f0f23] to-[#1a1a2e] border border-emerald-500/30 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25">
              <FaCheckCircle className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {userStats?.solved || 0}
              </p>
              <p className="text-xs text-gray-400">Completed</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#0f0f23] to-[#1a1a2e] border border-orange-500/30 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25">
              <FaFire className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {userStats?.totalAttempts || 0}
              </p>
              <p className="text-xs text-gray-400">Attempts</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#0f0f23] to-[#1a1a2e] border border-cyan-500/30 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
              <FaTrophy className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {userStats?.solved && userStats?.totalQuestions
                  ? Math.round(
                      (userStats.solved / userStats.totalQuestions) * 100
                    )
                  : 0}
                %
              </p>
              <p className="text-xs text-gray-400">Progress</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Premium Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-[#0f0f23] border border-[#2a2a4a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-5 py-3.5 bg-[#0f0f23] border border-[#2a2a4a] rounded-xl text-gray-300 hover:text-white hover:border-cyan-500/50 transition-all duration-300"
        >
          <FaFilter className="text-cyan-400" />
          Filters
          <FaChevronDown
            className={`transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Premium Filter Options */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-[#0f0f23] border border-[#2a2a4a] rounded-2xl">
              {/* Category filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty filter */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Difficulty
                </label>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff.value}
                      onClick={() => setSelectedDifficulty(diff.value)}
                      className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        selectedDifficulty === diff.value
                          ? `bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg`
                          : `bg-[#1a1a2e] ${diff.color} hover:bg-[#252545]`
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Questions List */}
      {questionsLoading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading challenges...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#0f0f23] rounded-2xl border border-[#2a2a4a]">
          <FaLaptopCode size={56} className="mx-auto mb-4 text-gray-600" />
          <p className="text-white text-lg font-medium">No challenges found</p>
          <p className="text-sm text-gray-500 mt-2">
            Try adjusting your filters or check back later for new challenges
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredQuestions.map((question, index) => {
            const diffConfig = {
              easy: {
                color: "text-emerald-400",
                bg: "from-emerald-500/20 to-green-500/10",
                border: "border-emerald-500/40",
                glow: "shadow-emerald-500/10",
              },
              medium: {
                color: "text-amber-400",
                bg: "from-amber-500/20 to-yellow-500/10",
                border: "border-amber-500/40",
                glow: "shadow-amber-500/10",
              },
              hard: {
                color: "text-rose-400",
                bg: "from-rose-500/20 to-red-500/10",
                border: "border-rose-500/40",
                glow: "shadow-rose-500/10",
              },
            }[question.difficulty] || {
              color: "text-gray-400",
              bg: "from-gray-500/20 to-gray-500/10",
              border: "border-gray-500/40",
              glow: "shadow-gray-500/10",
            };

            const isSolved = question.userProgress?.status === "solved";

            return (
              <motion.div
                key={question._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelectQuestion(question)}
                className={`group p-5 rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                  isSolved
                    ? "bg-gradient-to-br from-emerald-500/10 to-[#0f0f23] border-emerald-500/30 hover:border-emerald-400/50 shadow-lg shadow-emerald-500/5"
                    : "bg-gradient-to-br from-[#1a1a2e] to-[#0f0f23] border-[#2a2a4a] hover:border-cyan-500/50 shadow-lg shadow-black/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {isSolved && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                          <FaCheckCircle className="text-white text-xs" />
                        </div>
                      )}
                      <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {question.title}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                      {question.description}
                    </p>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r ${diffConfig.bg} ${diffConfig.color} ${diffConfig.border} border`}
                      >
                        {question.difficulty.charAt(0).toUpperCase() +
                          question.difficulty.slice(1)}
                      </span>
                      <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0d0d1a] text-gray-400 border border-[#2a2a4a]">
                        {CATEGORIES[question.category]?.name ||
                          question.category}
                      </span>
                      <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30">
                        {question.language === "cpp" ? "C++" : "C"}
                      </span>
                      {question.userProgress?.attempts > 0 && (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0d0d1a] text-gray-500 border border-[#2a2a4a]">
                          {question.userProgress.attempts} attempts
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="ml-4">
                    <button className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/20 border border-cyan-500/30 transition-all duration-300 group-hover:scale-105">
                      <FaCode />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );

  // Render practice view - TRUE FULLSCREEN OVERLAY
  const renderPracticeView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-[#0a0a15] flex flex-col"
    >
      {/* Minimal Top Bar with Back Button */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#0f0f23] to-[#1a1a2e] border-b border-[#2a2a4a] flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView("questions")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-lg transition-all shadow-lg shadow-violet-500/25"
          >
            <FaArrowLeft />
            Back
          </button>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
            <span className="text-cyan-400 font-semibold">
              {selectedQuestion?.title || "Challenge"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetCode}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all border border-white/10"
          >
            <FaRedo size={12} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/25"
          >
            <FaPlay size={12} className={isRunning ? "animate-pulse" : ""} />
            {isRunning ? "Running..." : "Run"}
          </button>

          <button
            onClick={handleSubmitSolution}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-400 hover:to-green-500 rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/25"
          >
            <FaPaperPlane
              size={12}
              className={isSubmitting ? "animate-pulse" : ""}
            />
            <span className="hidden sm:inline">
              {isSubmitting ? "Submitting..." : "Submit"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content - Fills all remaining space */}
      <div className="flex-1 flex flex-col lg:flex-row gap-2 p-2 min-h-0 overflow-hidden">
        {/* Left Panel - Question */}
        <div className="lg:w-2/5 h-full min-h-0 overflow-auto rounded-xl border border-[#2a2a4a] bg-[#0f0f23]">
          <QuestionPanel
            question={selectedQuestion}
            userProgress={selectedQuestion?.userProgress}
            onGetHint={handleGetHint}
            onViewSolution={handleViewSolution}
            onPrevious={handlePrevious}
            onNext={handleNext}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            isLoadingHint={isLoadingHint}
            currentHint={currentHint}
            showSolution={showSolution}
            solution={solution}
          />
        </div>

        {/* Right Panel - Editor & LeetCode-style Console */}
        <div className="lg:w-3/5 flex flex-col gap-2 h-full min-h-0 overflow-hidden">
          {/* Code Editor - Takes most space */}
          <div className="flex-[2] min-h-0 rounded-xl overflow-hidden border border-[#2a2a4a]">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              onRun={handleRunCode}
              isRunning={isRunning}
              minHeight="100%"
            />
          </div>

          {/* LeetCode-style Console Panel */}
          <div className="flex-1 min-h-[180px] bg-[#1a1a2e] rounded-xl border border-[#2a2a4a] flex flex-col overflow-hidden">
            {/* Tab Header */}
            <div className="flex items-center justify-between px-2 py-1.5 bg-[#0f0f23] border-b border-[#2a2a4a] flex-shrink-0">
              <div className="flex items-center">
                <button
                  onClick={() => setConsoleTab("testcase")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    consoleTab === "testcase"
                      ? "bg-[#2a2a4a] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="text-cyan-400">⌨</span>
                  Testcase
                </button>
                <button
                  onClick={() => setConsoleTab("result")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    consoleTab === "result"
                      ? "bg-[#2a2a4a] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {executionStatus === "success" && (
                    <span className="text-green-400">✓</span>
                  )}
                  {executionStatus === "running" && (
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
                  )}
                  {(executionStatus === "compile_error" ||
                    executionStatus === "runtime_error" ||
                    executionStatus === "error") && (
                    <span className="text-red-400">✗</span>
                  )}
                  {executionStatus === "input_required" && (
                    <span className="text-amber-400">⚠</span>
                  )}
                  {executionStatus === "idle" && (
                    <span className="text-gray-500">○</span>
                  )}
                  Result
                </button>
              </div>
              <button
                onClick={clearOutput}
                className="text-[10px] text-gray-500 hover:text-white px-2 py-1 hover:bg-[#2a2a4a] rounded transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto">
              {consoleTab === "testcase" ? (
                <div className="p-3 h-full">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter input values here..."
                    className="w-full h-full px-3 py-2 bg-[#0f0f23] border border-[#2a2a4a] rounded-lg text-xs font-mono text-gray-200 resize-none focus:outline-none focus:border-cyan-500/50 placeholder-gray-600"
                  />
                </div>
              ) : (
                <div className="p-3 font-mono text-xs">
                  {executionStatus === "running" ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : output || stderr || compileOutput ? (
                    <div className="space-y-2">
                      {executionStatus === "success" && (
                        <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-xs">
                          <FaCheckCircle /> Executed Successfully
                          {executionTime && (
                            <span className="text-gray-500 ml-2">
                              • {executionTime}ms
                            </span>
                          )}
                        </div>
                      )}
                      {executionStatus === "input_required" && (
                        <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-xs">
                          ⚠️ Input Required - Add input in Testcase tab
                        </div>
                      )}
                      {compileOutput && (
                        <pre className="text-yellow-300/80 whitespace-pre-wrap">
                          {compileOutput}
                        </pre>
                      )}
                      {stderr && executionStatus !== "input_required" && (
                        <pre className="text-red-300/80 whitespace-pre-wrap">
                          {stderr}
                        </pre>
                      )}
                      {output && (
                        <div>
                          <div className="text-gray-500 mb-1">Output:</div>
                          <pre className="text-gray-200 whitespace-pre-wrap">
                            {output}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-8">
                      Run your code to see results
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full h-full overflow-hidden">
      {/* Premium Header - Hidden in practice mode */}
      {view !== "practice" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          {/* MEDHA Practice Logo Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] border border-[#2a2a4a] shadow-xl mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <FaCode className="text-white text-xs" />
            </div>
            <span className="text-sm font-bold text-white">MEDHA Practice</span>
          </div>

          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            {view === "editor" ? "Code Playground" : "Practice Challenges"}
          </h2>
          <p className="text-[var(--text-secondary)] text-base max-w-xl mx-auto">
            {view === "editor"
              ? "Write, compile and execute C/C++ code instantly"
              : "Master OOP with curated challenges"}
          </p>
        </motion.div>
      )}

      {/* Content */}
      {view === "editor" && renderEditorView()}
      {view === "questions" && renderListView()}
      {view === "practice" && renderPracticeView()}
    </div>
  );
};

export default PracticeCoding;
