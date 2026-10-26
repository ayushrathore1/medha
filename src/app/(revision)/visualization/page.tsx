"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Cpu,
  Binary,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  Clock
} from "lucide-react";

const visualizations = [
  {
    id: "logic-gates",
    title: "Logic Gates Interactive Sandbox",
    subject: "Digital Electronics",
    description: "Toggle inputs and observe electrical logic flows, truth tables, and Boolean equations in real-time.",
    unit: "Unit 1 & 2",
    icon: Binary,
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.1)",
    time: "5 min learn"
  },
  {
    id: "cache-mapping",
    title: "CPU Cache Mapping Simulator",
    subject: "Computer Architecture",
    description: "Visualize how memory addresses map to direct, associative, and set-associative cache slots with live hit/miss tracking.",
    unit: "Unit 4",
    icon: Cpu,
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.1)",
    time: "8 min learn"
  },
  {
    id: "process-scheduling",
    title: "CPU Process Scheduler Visualizer",
    subject: "Operating Systems",
    description: "Compare Round Robin, Shortest Job First, and First-Come-First-Serve scheduling algorithms with dynamic Gantt charts.",
    unit: "Unit 3",
    icon: Layers,
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.1)",
    time: "6 min learn"
  }
];

export default function VisualizationHubPage() {
  const router = useRouter();

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 16px" }}>
      {/* Header section */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold mb-4 border border-[var(--primary)]/20">
          <Sparkles size={12} /> Interactive Study Visualizers
        </div>
        <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[var(--primary)] to-emerald-400 bg-clip-text text-transparent tracking-tight mb-2">
          Visual Concept Playground
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] max-w-lg mx-auto leading-relaxed">
          Skip reading dry paragraphs. Toggle parameters and watch core engineering systems animate dynamically.
        </p>
      </header>

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {visualizations.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              key={item.id}
              onClick={() => router.push(`/visualization/${item.id}`)}
              className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] relative overflow-hidden flex flex-col justify-between cursor-pointer group hover:border-[var(--primary)]/40 transition-all shadow-md hover:shadow-lg"
            >
              {/* Highlight backdrop */}
              <div
                className="absolute -right-12 -top-12 w-32 h-32 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-all"
                style={{ backgroundColor: item.color }}
              />

              <div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white"
                  style={{ backgroundColor: item.color }}
                >
                  <Icon size={20} />
                </div>

                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider">
                    {item.subject}
                  </span>
                  <span className="text-[9px] font-bold text-[var(--muted-foreground)] px-1.5 py-0.5 rounded bg-[var(--secondary)]">
                    {item.unit}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-[10px] font-bold text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {item.time}
                </span>
                <span className="flex items-center gap-0.5 text-[var(--primary)] group-hover:translate-x-0.5 transition-transform">
                  Explore <ArrowRight size={11} />
                </span>
              </div>
            </motion.div>
          )}
        )}
      </div>

      {/* Info bottom banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-2xl bg-[var(--secondary)]/30 border border-[var(--border)] flex items-start gap-3"
      >
        <Info size={16} className="text-[var(--primary)] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[var(--muted-foreground)] leading-relaxed">
          <strong>Tip for Exam Prep:</strong> Visualizations represent units of the RTU Syllabus. Combine these interactive simulations with notes from the <strong className="text-[var(--foreground)] hover:underline cursor-pointer" onClick={() => router.push("/rtu-exams")}>RTU Exams Hub</strong> to maximize memory retention and ace your exam answers!
        </div>
      </motion.div>
    </div>
  );
}
