/**
 * QuestionPanel Component
 * Displays practice question details with hints and navigation
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLightbulb,
  FaCode,
  FaChevronLeft,
  FaChevronRight,
  FaTag,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaUsers,
  FaEye,
  FaEyeSlash,
  FaBookOpen,
} from "react-icons/fa";

const difficultyConfig = {
  easy: {
    color: "text-emerald-400",
    bg: "bg-gradient-to-r from-emerald-500/20 to-green-500/10",
    border: "border-emerald-500/40",
    label: "Easy",
    glow: "shadow-emerald-500/20",
  },
  medium: {
    color: "text-amber-400",
    bg: "bg-gradient-to-r from-amber-500/20 to-yellow-500/10",
    border: "border-amber-500/40",
    label: "Medium",
    glow: "shadow-amber-500/20",
  },
  hard: {
    color: "text-rose-400",
    bg: "bg-gradient-to-r from-rose-500/20 to-red-500/10",
    border: "border-rose-500/40",
    label: "Hard",
    glow: "shadow-rose-500/20",
  },
};

const categoryNames = {
  "classes-objects": "Classes & Objects",
  inheritance: "Inheritance",
  polymorphism: "Polymorphism",
  encapsulation: "Encapsulation",
  abstraction: "Abstraction",
  "constructors-destructors": "Constructors & Destructors",
  "operator-overloading": "Operator Overloading",
  templates: "Templates",
  "exception-handling": "Exception Handling",
  "file-handling": "File Handling",
  stl: "STL",
  pointers: "Pointers & Memory",
  "basic-syntax": "Basic Syntax",
  "arrays-strings": "Arrays & Strings",
  functions: "Functions",
  other: "Other",
};

const QuestionPanel = ({
  question,
  userProgress,
  onGetHint,
  onViewSolution,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  isLoadingHint = false,
  currentHint = null,
  showSolution = false,
  solution = null,
}) => {
  const [showHints, setShowHints] = useState(false);
  const [showTestCases, setShowTestCases] = useState(true);
  const [hintsRevealed, setHintsRevealed] = useState(0);

  if (!question) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#0f0f23] to-[#0a0a15] rounded-2xl border border-[#2a2a4a]">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 flex items-center justify-center mb-4 border border-cyan-500/30">
          <FaBookOpen size={28} className="text-cyan-400" />
        </div>
        <p className="text-gray-400 text-lg">
          Select a question to start practicing
        </p>
        <p className="text-gray-600 text-sm mt-2">
          Choose from the challenges list to begin
        </p>
      </div>
    );
  }

  const difficulty =
    difficultyConfig[question.difficulty] || difficultyConfig.medium;
  const categoryName = categoryNames[question.category] || question.category;

  const handleGetHint = () => {
    if (onGetHint) {
      onGetHint(hintsRevealed);
      setHintsRevealed(hintsRevealed + 1);
      setShowHints(true);
    }
  };

  return (
    <motion.div
      className="h-full flex flex-col bg-gradient-to-b from-[#0f0f23] to-[#0a0a15] rounded-2xl border border-[#2a2a4a] overflow-hidden shadow-2xl shadow-black/20"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {/* Header - Premium */}
      <div className="p-5 border-b border-[#2a2a4a] bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${difficulty.bg} ${difficulty.color} ${difficulty.border} border shadow-lg ${difficulty.glow}`}
            >
              {difficulty.label}
            </span>
            <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30">
              {question.language === "cpp" ? "C++" : "C"}
            </span>
          </div>

          {userProgress?.status === "solved" && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
              <FaCheckCircle />
              Solved
            </span>
          )}
        </div>

        <h2 className="text-xl font-bold text-white mb-3">{question.title}</h2>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5">
            <FaTag size={10} className="text-violet-400" />
            {categoryName}
          </span>
          {question.successRate !== undefined && (
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5">
              <FaUsers size={10} className="text-cyan-400" />
              {question.successRate}% success
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-5 space-y-5">
        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></span>
            Description
          </h3>
          <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
            {question.description}
          </p>
        </div>

        {/* Concepts */}
        {question.concepts && question.concepts.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full"></span>
              Concepts
            </h3>
            <div className="flex flex-wrap gap-2">
              {question.concepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 text-xs rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/10 text-violet-300 border border-violet-500/30"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Test Cases */}
        <div>
          <button
            onClick={() => setShowTestCases(!showTestCases)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-3 hover:text-white transition-colors"
          >
            <span className="w-1 h-4 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></span>
            {showTestCases ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
            Test Cases ({question.testCases?.length || 0})
          </button>

          <AnimatePresence>
            {showTestCases && question.testCases && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3 overflow-hidden"
              >
                {question.testCases.map((tc, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl bg-[#0d0d1a] border border-[#2a2a4a] ${
                      tc.isHidden ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-400">
                        Test Case {idx + 1} {tc.isHidden && "(Hidden)"}
                      </span>
                    </div>
                    {!tc.isHidden ? (
                      <div className="space-y-2 text-sm font-mono">
                        <div className="flex items-start gap-2">
                          <span className="text-gray-500 min-w-[60px]">
                            Input:
                          </span>
                          <span className="text-cyan-300">
                            {tc.input || "(empty)"}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-gray-500 min-w-[60px]">
                            Expected:
                          </span>
                          <span className="text-emerald-400">
                            {tc.expectedOutput}
                          </span>
                        </div>
                        {tc.description && (
                          <p className="text-gray-500 text-xs mt-2 italic">
                            {tc.description}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        Hidden test case - output will be verified during
                        submission
                      </p>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hints Section */}
        <div>
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-3 hover:text-white transition-colors"
          >
            <span className="w-1 h-4 bg-gradient-to-b from-amber-500 to-yellow-600 rounded-full"></span>
            <FaLightbulb className="text-amber-400" />
            Hints{" "}
            {question.hints?.length
              ? `(${question.hints.length} available)`
              : ""}
          </button>

          <AnimatePresence>
            {showHints && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3 overflow-hidden"
              >
                {currentHint ? (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/30">
                    <p className="text-gray-200">{currentHint.hint}</p>
                    <p className="text-xs text-amber-400/70 mt-3">
                      Hint {currentHint.hintNumber} of {currentHint.totalHints}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Click the button below to reveal a hint
                  </p>
                )}

                <button
                  onClick={handleGetHint}
                  disabled={isLoadingHint}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-400 hover:from-amber-500/30 hover:to-yellow-500/20 rounded-xl transition-all border border-amber-500/30 disabled:opacity-50"
                >
                  <FaLightbulb />
                  {isLoadingHint
                    ? "Loading..."
                    : currentHint
                      ? "Get Another Hint"
                      : "Get Hint"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Solution Section */}
        {showSolution && solution && (
          <div className="border-t border-[#2a2a4a] pt-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-3">
              <span className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></span>
              <FaCode className="text-cyan-400" />
              Solution
            </h3>
            <div className="p-4 rounded-xl bg-[#0d0d1a] border border-[#2a2a4a]">
              <pre className="font-mono text-sm text-gray-200 whitespace-pre-wrap overflow-auto max-h-96">
                {solution.solution}
              </pre>
            </div>
            {solution.explanation && (
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/5 border border-violet-500/30">
                <h4 className="text-sm font-semibold text-violet-300 mb-2 flex items-center gap-2">
                  <FaBookOpen size={12} />
                  Explanation
                </h4>
                <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                  {solution.explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Navigation - Premium */}
      <div className="p-4 border-t border-[#2a2a4a] bg-gradient-to-r from-[#1a1a2e] to-[#16213e] flex items-center justify-between">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <FaChevronLeft />
          Previous
        </button>

        <button
          onClick={onViewSolution}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/20 rounded-xl transition-all border border-cyan-500/30"
        >
          <FaEye />
          {showSolution ? "Hide Solution" : "View Solution"}
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
          <FaChevronRight />
        </button>
      </div>
    </motion.div>
  );
};

export default QuestionPanel;
