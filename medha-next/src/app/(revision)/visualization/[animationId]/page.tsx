"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Binary,
  Cpu,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Play,
  RotateCcw,
  Zap,
  CheckCircle,
  XCircle,
  HelpCircle
} from "lucide-react";

function InteractiveVisualizationContent() {
  const { animationId } = useParams();
  const router = useRouter();

  // 1. LOGIC GATES SANDBOX STATE
  const [gateA, setGateA] = useState(false);
  const [gateB, setGateB] = useState(false);
  const [selectedGate, setSelectedGate] = useState<"AND" | "OR" | "XOR" | "NAND" | "NOR" | "XNOR">("AND");

  // 2. CPU CACHE SIMULATOR STATE
  const [cacheEntries, setCacheEntries] = useState<Array<{ valid: boolean; tag: string; address?: number }>>(
    Array(8).fill(null).map(() => ({ valid: false, tag: "" }))
  );
  const [cacheHits, setCacheHits] = useState(0);
  const [cacheMisses, setCacheMisses] = useState(0);
  const [cacheLogs, setCacheLogs] = useState<string[]>([]);
  const [highlightedSlot, setHighlightedSlot] = useState<number | null>(null);

  // 3. PROCESS SCHEDULER STATE
  const [schedulerAlgo, setSchedulerAlgo] = useState<"FCFS" | "SJF">("FCFS");

  // Reset animations
  const handleResetCache = () => {
    setCacheEntries(Array(8).fill(null).map(() => ({ valid: false, tag: "" })));
    setCacheHits(0);
    setCacheMisses(0);
    setCacheLogs(["Cache mapping cleared. Click a memory address below to simulate a CPU lookup."]);
    setHighlightedSlot(null);
  };

  // LOGIC GATE CALCULATION
  const gateOutput = useMemo(() => {
    switch (selectedGate) {
      case "AND": return gateA && gateB;
      case "OR": return gateA || gateB;
      case "XOR": return gateA !== gateB;
      case "NAND": return !(gateA && gateB);
      case "NOR": return !(gateA || gateB);
      case "XNOR": return gateA === gateB;
      default: return false;
    }
  }, [gateA, gateB, selectedGate]);

  const gateFormula = useMemo(() => {
    switch (selectedGate) {
      case "AND": return "Y = A • B";
      case "OR": return "Y = A + B";
      case "XOR": return "Y = A ⊕ B";
      case "NAND": return "Y = A • B";
      case "NOR": return "Y = A + B";
      case "XNOR": return "Y = A ⊙ B";
      default: return "";
    }
  }, [selectedGate]);

  // CACHE SIMULATOR LOOKUP
  const handleCacheLookup = (addr: number) => {
    const slotIndex = addr % 8;
    const tagVal = Math.floor(addr / 8).toString(2).padStart(3, "0"); // 3-bit tag for 6-bit address space

    setHighlightedSlot(slotIndex);

    setCacheEntries((prev) => {
      const next = [...prev];
      const slot = next[slotIndex];

      if (slot.valid && slot.tag === tagVal) {
        // Cache Hit
        setCacheHits((h) => h + 1);
        setCacheLogs((logs) => [
          `CPU requested Address ${addr} (Binary: ${addr.toString(2).padStart(6, "0")}) -> Cache HIT! Slot ${slotIndex} already holds Tag ${tagVal}.`,
          ...logs.slice(0, 4)
        ]);
      } else {
        // Cache Miss
        setCacheMisses((m) => m + 1);
        next[slotIndex] = { valid: true, tag: tagVal, address: addr };
        setCacheLogs((logs) => [
          `CPU requested Address ${addr} (Binary: ${addr.toString(2).padStart(6, "0")}) -> Cache MISS! Loaded memory from Address ${addr} into Slot ${slotIndex} with Tag ${tagVal}.`,
          ...logs.slice(0, 4)
        ]);
      }

      return next;
    });
  };

  // PROCESS SCHEDULER DATA
  const schedulingProcesses = [
    { id: "P1", burst: 6, color: "#3b82f6" },
    { id: "P2", burst: 3, color: "#10b981" },
    { id: "P3", burst: 8, color: "#f59e0b" },
    { id: "P4", burst: 4, color: "#a855f7" }
  ];

  const schedulerResult = useMemo(() => {
    let sorted = [...schedulingProcesses];
    if (schedulerAlgo === "SJF") {
      sorted.sort((a, b) => a.burst - b.burst);
    }

    let currentTime = 0;
    const timeline = sorted.map((p) => {
      const start = currentTime;
      const end = currentTime + p.burst;
      const waiting = start; // arrival is assumed 0 for all
      const turnaround = end;
      currentTime += p.burst;

      return {
        ...p,
        start,
        end,
        waiting,
        turnaround
      };
    });

    const avgWait = timeline.reduce((acc, curr) => acc + curr.waiting, 0) / timeline.length;
    const avgTurnaround = timeline.reduce((acc, curr) => acc + curr.turnaround, 0) / timeline.length;

    return { timeline, avgWait, avgTurnaround };
  }, [schedulerAlgo]);

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
      {/* Navigation back */}
      <button
        onClick={() => router.push("/visualization")}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-semibold text-sm transition-all mb-6 cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Hub
      </button>

      {/* RENDER LOGIC GATES SANDBOX */}
      {animationId === "logic-gates" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
              <Binary size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black text-[var(--foreground)]">Logic Gates Sandbox</h1>
              <p className="text-xs text-[var(--muted-foreground)]">Digital Electronics Unit 1 Simulation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-5">
              <h3 className="font-bold text-xs text-[var(--foreground)] uppercase tracking-wider">Parameters</h3>

              {/* Input A Switch */}
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <div>
                  <div className="font-bold text-xs">Input A</div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">Switch A voltage</div>
                </div>
                <button
                  onClick={() => setGateA(!gateA)}
                  className="text-[var(--primary)] hover:opacity-90 cursor-pointer"
                >
                  {gateA ? <ToggleRight size={38} /> : <ToggleLeft size={38} className="text-zinc-500" />}
                </button>
              </div>

              {/* Input B Switch */}
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                <div>
                  <div className="font-bold text-xs">Input B</div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">Switch B voltage</div>
                </div>
                <button
                  onClick={() => setGateB(!gateB)}
                  className="text-[var(--primary)] hover:opacity-90 cursor-pointer"
                >
                  {gateB ? <ToggleRight size={38} /> : <ToggleLeft size={38} className="text-zinc-500" />}
                </button>
              </div>

              {/* Gate selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">Gate Type</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["AND", "OR", "XOR", "NAND", "NOR", "XNOR"] as const).map((gate) => (
                    <button
                      key={gate}
                      onClick={() => setSelectedGate(gate)}
                      className={`py-1.5 text-[10px] font-bold rounded-xl border transition-all cursor-pointer ${
                        selectedGate === gate
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-transparent text-[var(--muted-foreground)] border-[var(--border)]"
                      }`}
                    >
                      {gate}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sandbox Visualizer */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex flex-col justify-between min-h-[300px] relative overflow-hidden">
              <h3 className="font-bold text-xs text-[var(--foreground)] uppercase tracking-wider mb-4">Signal Flow</h3>

              {/* Mathematical display formula */}
              <div className="absolute top-4 right-4 text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[var(--secondary)] text-blue-500">
                {gateFormula} {selectedGate === "NAND" || selectedGate === "NOR" ? <span className="border-t border-blue-500 px-0.5">Y</span> : ""}
              </div>

              {/* Interactive circuit diagram drawing */}
              <div className="flex-1 flex items-center justify-center gap-6 py-6">
                {/* Inputs node */}
                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[var(--foreground)]">A</span>
                    <div
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                        gateA ? "bg-emerald-500 shadow-md shadow-emerald-500/30 animate-pulse" : "bg-zinc-600"
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[var(--foreground)]">B</span>
                    <div
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                        gateB ? "bg-emerald-500 shadow-md shadow-emerald-500/30 animate-pulse" : "bg-zinc-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Electrical wiring line */}
                <div className="w-10 h-6 flex flex-col justify-between border-y border-[var(--border)] relative">
                  <div className={`absolute top-0 left-0 right-0 h-0.5 transition-all ${gateA ? "bg-emerald-500" : "bg-zinc-600"}`} />
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all ${gateB ? "bg-emerald-500" : "bg-zinc-600"}`} />
                </div>

                {/* Main Logic Gate representation */}
                <div className="px-6 py-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 text-center flex flex-col justify-center min-w-[90px] shadow-sm relative">
                  <span className="font-black text-sm text-blue-500">{selectedGate}</span>
                  <Zap size={14} className="absolute -top-1.5 -right-1.5 text-blue-500 animate-pulse" />
                </div>

                {/* Output wiring line */}
                <div className="w-10 h-0.5 relative">
                  <div className={`absolute inset-0 h-full transition-all ${gateOutput ? "bg-emerald-500" : "bg-zinc-600"}`} />
                </div>

                {/* Output Node */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full transition-all duration-300 ${
                      gateOutput ? "bg-emerald-500 shadow-lg shadow-emerald-500/50" : "bg-zinc-600"
                    }`}
                  />
                  <span className="font-bold text-xs text-[var(--foreground)]">Output Y</span>
                </div>
              </div>

              {/* Embedded Interactive Truth Table */}
              <div className="border-t border-[var(--border)] pt-4 mt-4">
                <div className="font-bold text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Truth Table Mapping</div>
                <table className="w-full text-center text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)] font-bold">
                      <th className="py-1">Input A</th>
                      <th className="py-1">Input B</th>
                      <th className="py-1">Output Y ({selectedGate})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]/30 font-semibold font-mono">
                    {[
                      { a: false, b: false, y: selectedGate === "AND" || selectedGate === "OR" || selectedGate === "XOR" ? false : true },
                      { a: false, b: true, y: selectedGate === "OR" || selectedGate === "XOR" || selectedGate === "NAND" ? true : false },
                      { a: true, b: false, y: selectedGate === "OR" || selectedGate === "XOR" || selectedGate === "NAND" ? true : false },
                      { a: true, b: true, y: selectedGate === "AND" || selectedGate === "OR" || selectedGate === "XNOR" ? true : false }
                    ].map((row, rIdx) => {
                      const isActive = row.a === gateA && row.b === gateB;
                      return (
                        <tr
                          key={rIdx}
                          className={`transition-colors ${isActive ? "bg-blue-500/10 text-blue-500 font-black" : "text-[var(--muted-foreground)]"}`}
                        >
                          <td className="py-1">{row.a ? "1" : "0"}</td>
                          <td className="py-1">{row.b ? "1" : "0"}</td>
                          <td className="py-1">{row.y ? "1" : "0"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* RENDER CPU CACHE MAPPING SIMULATOR */}
      {animationId === "cache-mapping" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
              <Cpu size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black text-[var(--foreground)]">Direct CPU Cache Simulator</h1>
              <p className="text-xs text-[var(--muted-foreground)]">Computer Architecture Unit 4 Direct-Mapping</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Control Panel address selectors */}
            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs text-[var(--foreground)] uppercase tracking-wider">CPU Address</h3>
                <button
                  onClick={handleResetCache}
                  className="p-1 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] cursor-pointer"
                  title="Clear Cache memory"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-[var(--muted-foreground)] leading-relaxed">
                  Click a memory lookup address. Direct Mapping computes Slot Index = Address % 8.
                </p>

                {/* Memory references triggers */}
                <div className="grid grid-cols-4 gap-2">
                  {[5, 12, 13, 21, 29, 37, 44, 53].map((addr) => (
                    <button
                      key={addr}
                      onClick={() => handleCacheLookup(addr)}
                      className="py-2 text-xs font-mono font-bold rounded-xl border border-[var(--border)] bg-[var(--secondary)]/30 hover:border-purple-500/40 text-[var(--foreground)] cursor-pointer"
                    >
                      {addr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hits and misses ratio */}
              <div className="border-t border-[var(--border)] pt-4 space-y-2.5">
                <div className="font-bold text-[10px] text-[var(--muted-foreground)] uppercase">Performance Stats</div>
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                    <CheckCircle size={12} /> Cache Hits:
                  </span>
                  <span className="font-mono font-bold text-[var(--foreground)]">{cacheHits}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1 text-red-500 font-semibold">
                    <XCircle size={12} /> Cache Misses:
                  </span>
                  <span className="font-mono font-bold text-[var(--foreground)]">{cacheMisses}</span>
                </div>
                {cacheHits + cacheMisses > 0 && (
                  <div className="flex justify-between text-xs border-t border-[var(--border)]/30 pt-2 font-bold">
                    <span>Hit Ratio:</span>
                    <span className="font-mono text-purple-400">
                      {((cacheHits / (cacheHits + cacheMisses)) * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Cache block visualizer */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex flex-col h-full">
              <h3 className="font-bold text-xs text-[var(--foreground)] uppercase tracking-wider mb-4">
                Cache Slots (SRAM)
              </h3>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-center text-xs mb-4">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)] font-bold">
                      <th className="py-2">Slot Index</th>
                      <th className="py-2">Valid Bit</th>
                      <th className="py-2">Tag String</th>
                      <th className="py-2">Address Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]/30 font-semibold font-mono">
                    {cacheEntries.map((slot, index) => {
                      const isHighlighted = highlightedSlot === index;
                      return (
                        <tr
                          key={index}
                          className={`transition-colors ${
                            isHighlighted ? "bg-purple-500/10 text-purple-400 font-black" : "text-[var(--muted-foreground)]"
                          }`}
                        >
                          <td className="py-2">Slot {index}</td>
                          <td className="py-2">{slot.valid ? "1" : "0"}</td>
                          <td className="py-2">{slot.valid ? slot.tag : "---"}</td>
                          <td className="py-2">{slot.valid ? `Mem[${slot.address}]` : "---"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Interactive log sequence */}
              <div className="border-t border-[var(--border)] pt-3 bg-[var(--secondary)]/10 p-3 rounded-xl border border-[var(--border)]/40 mt-auto min-h-[90px]">
                <div className="font-bold text-[9px] text-[var(--muted-foreground)] uppercase mb-1.5 flex items-center gap-1">
                  <HelpCircle size={10} /> Live Simulation Log
                </div>
                <div className="space-y-1.5">
                  {cacheLogs.length === 0 ? (
                    <div className="text-[10px] text-[var(--muted-foreground)]">
                      SRAM cache initialized. Trigger a CPU lookup address to start.
                    </div>
                  ) : (
                    cacheLogs.map((log, lIdx) => (
                      <div key={lIdx} className="text-[10px] leading-relaxed text-[var(--muted-foreground)]">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* RENDER CPU PROCESS SCHEDULER */}
      {animationId === "process-scheduling" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Layers size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black text-[var(--foreground)]">Process Scheduler Visualizer</h1>
              <p className="text-xs text-[var(--muted-foreground)]">Operating Systems Unit 3 Scheduling Algorithms</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Control Panel algo selector */}
            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
              <h3 className="font-bold text-xs text-[var(--foreground)] uppercase tracking-wider">Scheduling Options</h3>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">Algorithm</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSchedulerAlgo("FCFS")}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      schedulerAlgo === "FCFS"
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-transparent text-[var(--muted-foreground)] border-[var(--border)]"
                    }`}
                  >
                    FCFS
                  </button>
                  <button
                    onClick={() => setSchedulerAlgo("SJF")}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      schedulerAlgo === "SJF"
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-transparent text-[var(--muted-foreground)] border-[var(--border)]"
                    }`}
                  >
                    SJF (Shortest Job)
                  </button>
                </div>
              </div>

              {/* Task list details info */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">Active Processes</label>
                <div className="space-y-1.5">
                  {schedulingProcesses.map((p) => (
                    <div key={p.id} className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-1.5 font-bold">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                        {p.id}
                      </span>
                      <span className="text-[var(--muted-foreground)] font-mono font-bold">Burst: {p.burst} ms</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gantt Chart & metrics table */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-6">
              <h3 className="font-bold text-xs text-[var(--foreground)] uppercase tracking-wider">
                Gantt Chart Execution Feed
              </h3>

              {/* Gantt Chart blocks timeline */}
              <div className="w-full flex rounded-xl overflow-hidden border border-[var(--border)] h-12 relative bg-zinc-950/40">
                {schedulerResult.timeline.map((item, idx) => {
                  const percentWidth = (item.burst / 21) * 100; // sum burst is 21ms
                  return (
                    <div
                      key={idx}
                      className="h-full flex flex-col justify-center items-center text-white text-xs font-black relative border-r border-[var(--border)]/40"
                      style={{
                        width: `${percentWidth}%`,
                        backgroundColor: `${item.color}40`,
                        borderLeft: idx > 0 ? `2px solid ${item.color}` : "none"
                      }}
                    >
                      <span>{item.id}</span>
                      <span className="absolute bottom-0 right-1.5 text-[8px] font-bold text-white/50">{item.end}ms</span>
                    </div>
                  );
                })}
                <div className="absolute bottom-0 left-1.5 text-[8px] font-bold text-white/50">0ms</div>
              </div>

              {/* Calculations metrics table */}
              <div>
                <table className="w-full text-center text-xs mb-4">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)] font-bold">
                      <th className="py-2">Process</th>
                      <th className="py-2">Waiting Time</th>
                      <th className="py-2">Turnaround Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]/30 font-semibold font-mono">
                    {schedulerResult.timeline.map((item, idx) => (
                      <tr key={idx} className="text-[var(--foreground)]">
                        <td className="py-2 font-bold flex items-center justify-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                          {item.id}
                        </td>
                        <td className="py-2">{item.waiting} ms</td>
                        <td className="py-2">{item.turnaround} ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom averages details */}
              <div className="grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-4">
                <div>
                  <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">Avg Waiting Time</div>
                  <div className="text-lg font-black text-emerald-500">{schedulerResult.avgWait.toFixed(1)} ms</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">Avg Turnaround Time</div>
                  <div className="text-lg font-black text-emerald-500">{schedulerResult.avgTurnaround.toFixed(1)} ms</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function InteractiveVisualizationPage() {
return (
  <Suspense fallback={
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
    </div>
  }>
    <InteractiveVisualizationContent />
  </Suspense>
);
}
