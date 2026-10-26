/**
 * OutputPanel Component
 * Displays code execution output, errors, and compilation messages
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTerminal,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaClock,
  FaMemory,
  FaCopy,
  FaTrash,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";

const OutputPanel = ({
  output = "",
  stderr = "",
  compileOutput = "",
  status = "idle", // idle, running, success, error, compile_error, timeout, runtime_error
  executionTime = null,
  memoryUsed = null,
  testResults = null, // For submission results
  onClear,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("output"); // output, errors, tests

  // Copy output to clipboard
  const handleCopy = async () => {
    const text =
      activeTab === "output"
        ? output
        : activeTab === "errors"
          ? stderr || compileOutput
          : "";
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Status icon and color
  const getStatusConfig = () => {
    switch (status) {
      case "success":
        return {
          icon: <FaCheckCircle className="text-green-400" />,
          text: "Execution Successful",
          bg: "bg-green-500/10",
          border: "border-green-500/30",
        };
      case "error":
      case "runtime_error":
        return {
          icon: <FaTimesCircle className="text-red-400" />,
          text: "Runtime Error",
          bg: "bg-red-500/10",
          border: "border-red-500/30",
        };
      case "compile_error":
        return {
          icon: <FaExclamationTriangle className="text-orange-400" />,
          text: "Compilation Error",
          bg: "bg-orange-500/10",
          border: "border-orange-500/30",
        };
      case "timeout":
        return {
          icon: <FaClock className="text-yellow-400" />,
          text: "Time Limit Exceeded",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
        };
      case "running":
        return {
          icon: (
            <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          ),
          text: "Running...",
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
        };
      case "simulated":
        return {
          icon: <FaExclamationTriangle className="text-amber-400" />,
          text: "Simulated (API not configured)",
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
        };
      default:
        return {
          icon: <FaTerminal className="text-[var(--text-secondary)]" />,
          text: "Ready",
          bg: "bg-[var(--bg-secondary)]",
          border: "border-[var(--border-default)]",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const hasErrors = stderr || compileOutput;
  const hasTestResults = testResults && testResults.length > 0;

  return (
    <motion.div
      className={`rounded-xl overflow-hidden border ${statusConfig.border} ${statusConfig.bg} backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          {statusConfig.icon}
          <span className="font-medium text-[var(--text-primary)]">
            {statusConfig.text}
          </span>

          {/* Execution stats */}
          {(executionTime !== null || memoryUsed !== null) &&
            status === "success" && (
              <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] ml-4">
                {executionTime !== null && (
                  <span className="flex items-center gap-1">
                    <FaClock size={10} />
                    {executionTime.toFixed(2)}ms
                  </span>
                )}
                {memoryUsed !== null && (
                  <span className="flex items-center gap-1">
                    <FaMemory size={10} />
                    {(memoryUsed / 1024).toFixed(2)}MB
                  </span>
                )}
              </div>
            )}
        </div>

        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 rounded transition-colors"
                title="Copy output"
              >
                <FaCopy size={12} />
              </button>
              {onClear && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                  className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                  title="Clear output"
                >
                  <FaTrash size={12} />
                </button>
              )}
            </>
          )}
          {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Tabs */}
            {(hasErrors || hasTestResults) && (
              <div className="flex border-b border-[var(--border-default)] px-4">
                <button
                  onClick={() => setActiveTab("output")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "output"
                      ? "border-[var(--action-primary)] text-[var(--action-primary)]"
                      : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Output
                </button>
                {hasErrors && (
                  <button
                    onClick={() => setActiveTab("errors")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "errors"
                        ? "border-red-400 text-red-400"
                        : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    Errors
                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500/20 text-red-400 rounded">
                      !
                    </span>
                  </button>
                )}
                {hasTestResults && (
                  <button
                    onClick={() => setActiveTab("tests")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "tests"
                        ? "border-[var(--action-primary)] text-[var(--action-primary)]"
                        : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    Test Results
                  </button>
                )}
              </div>
            )}

            {/* Output content */}
            <div className="p-4 max-h-80 overflow-auto">
              {activeTab === "output" && (
                <pre className="font-mono text-sm text-[var(--text-primary)] whitespace-pre-wrap">
                  {output ||
                    (status === "idle"
                      ? "// Output will appear here after running your code"
                      : "No output")}
                </pre>
              )}

              {activeTab === "errors" && (
                <pre className="font-mono text-sm text-red-400 whitespace-pre-wrap">
                  {compileOutput && (
                    <div className="mb-4">
                      <span className="text-orange-400 font-bold">
                        Compilation Output:
                      </span>
                      <br />
                      {compileOutput}
                    </div>
                  )}
                  {stderr && (
                    <div>
                      <span className="text-red-400 font-bold">Error:</span>
                      <br />
                      {stderr}
                    </div>
                  )}
                </pre>
              )}

              {activeTab === "tests" && testResults && (
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result.passed
                          ? "border-green-500/30 bg-green-500/5"
                          : "border-red-500/30 bg-red-500/5"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {result.passed ? (
                          <FaCheckCircle className="text-green-400" />
                        ) : (
                          <FaTimesCircle className="text-red-400" />
                        )}
                        <span
                          className={`font-medium ${result.passed ? "text-green-400" : "text-red-400"}`}
                        >
                          Test Case {index + 1}{" "}
                          {result.isHidden ? "(Hidden)" : ""}
                        </span>
                      </div>

                      {result.description && (
                        <p className="text-sm text-[var(--text-secondary)] mb-2">
                          {result.description}
                        </p>
                      )}

                      {!result.isHidden && (
                        <div className="space-y-1 text-sm font-mono">
                          <div>
                            <span className="text-[var(--text-secondary)]">
                              Input:{" "}
                            </span>
                            <span className="text-[var(--text-primary)]">
                              {result.input || "(empty)"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[var(--text-secondary)]">
                              Expected:{" "}
                            </span>
                            <span className="text-green-400">
                              {result.expectedOutput}
                            </span>
                          </div>
                          <div>
                            <span className="text-[var(--text-secondary)]">
                              Got:{" "}
                            </span>
                            <span
                              className={
                                result.passed
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            >
                              {result.actualOutput}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OutputPanel;
