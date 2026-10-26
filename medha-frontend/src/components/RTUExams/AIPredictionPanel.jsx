import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWandMagicSparkles, FaXmark, FaArrowTrendUp, FaCircleExclamation, FaBolt, FaShieldHalved } from "react-icons/fa6";

const priorityConfig = {
  high: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", icon: <FaBolt size={12} /> },
  medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", icon: <FaArrowTrendUp size={12} /> },
  low: { color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", icon: <FaShieldHalved size={12} /> },
};

/**
 * AIPredictionPanel — Displays AI-generated topic predictions
 */
const AIPredictionPanel = ({ predictions, yearsAnalyzed, loading, error, onClose, onRetry, cached }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        style={{
          background: "var(--bg-secondary)",
          borderRadius: 24,
          border: "2px solid rgba(125,198,122,0.2)",
          padding: "28px 24px",
          marginBottom: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div style={{
          position: "absolute", top: -60, right: -60, width: 200, height: 200,
          borderRadius: "50%", background: "rgba(125,198,122,0.06)", filter: "blur(60px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: -40, width: 160, height: 160,
          borderRadius: "50%", background: "rgba(139,92,246,0.04)", filter: "blur(50px)", pointerEvents: "none",
        }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: "linear-gradient(135deg, #7DC67A, #5bb358)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 6px 20px rgba(125,198,122,0.3)",
            }}>
              <FaWandMagicSparkles size={20} style={{ color: "#fff" }} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                AI Topic Prediction
              </h3>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)", margin: 0 }}>
                {loading
                  ? "Analyzing PYQ data..."
                  : yearsAnalyzed
                    ? `Based on ${yearsAnalyzed.join(", ")} papers${cached ? " · Cached" : ""}`
                    : "Powered by Gemini Flash"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg-tertiary)", border: "1px solid var(--border-default)",
              borderRadius: 10, width: 32, height: 32, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-tertiary)", transition: "all 0.2s",
            }}
          >
            <FaXmark size={14} />
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: "center", padding: "30px 0", position: "relative", zIndex: 1 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ display: "inline-block", marginBottom: 12 }}
            >
              <FaWandMagicSparkles size={28} style={{ color: "var(--action-primary)" }} />
            </motion.div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)" }}>
              Analyzing patterns across multiple years...
            </p>
            <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>
              This may take a few seconds
            </p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div style={{
            textAlign: "center", padding: "24px 16px", position: "relative", zIndex: 1,
            background: "rgba(239,68,68,0.06)", borderRadius: 16, border: "1px solid rgba(239,68,68,0.15)",
          }}>
            <FaCircleExclamation size={24} style={{ color: "#ef4444", marginBottom: 8 }} />
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px" }}>
              {error}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                style={{
                  marginTop: 12, padding: "8px 20px", borderRadius: 100,
                  background: "var(--action-primary)", color: "#fff",
                  border: "none", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {/* Predictions list */}
        {!loading && !error && predictions && predictions.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative", zIndex: 1 }}>
            {predictions.map((pred, idx) => {
              const pConfig = priorityConfig[pred.priority] || priorityConfig.medium;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.3 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px", borderRadius: 16,
                    background: pConfig.bg, border: `1px solid ${pConfig.border}`,
                  }}
                >
                  {/* Rank */}
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: `${pConfig.color}15`, color: pConfig.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 900, flexShrink: 0,
                  }}>
                    {idx + 1}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                        {pred.topic}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: "var(--text-tertiary)", margin: 0, lineHeight: 1.4 }}>
                      {pred.reason}
                    </p>
                  </div>

                  {/* Right side: confidence + priority */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: pConfig.color }}>
                      {pred.confidence}%
                    </span>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "2px 8px", borderRadius: 6,
                      fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                      color: pConfig.color, background: `${pConfig.color}10`,
                    }}>
                      {pConfig.icon} {pred.priority}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Footer note */}
            <div style={{
              marginTop: 8, padding: "10px 14px", borderRadius: 12,
              background: "rgba(125,198,122,0.06)", border: "1px solid rgba(125,198,122,0.1)",
            }}>
              <p style={{ fontSize: 11, color: "var(--text-tertiary)", margin: 0, lineHeight: 1.5 }}>
                <strong>📋 Note:</strong> Predictions are based on frequency and weightage patterns from{" "}
                {yearsAnalyzed?.length || 0} years of PYQ data. Use this as a study guide, not a guarantee.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AIPredictionPanel;
