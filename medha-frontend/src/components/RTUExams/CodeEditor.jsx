/**
 * CodeEditor Component
 * A Monaco-like code editor for C/C++ with syntax highlighting
 * Uses simple textarea with custom styling (can be upgraded to Monaco later)
 */
import React, { useState, useRef, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaPlay,
  FaCopy,
  FaUndo,
  FaRedo,
  FaExpand,
  FaCode,
  FaDownload,
  FaUpload,
  FaTimes,
} from "react-icons/fa";

// C/C++ keywords for highlighting
const CPP_KEYWORDS = new Set([
  "auto", "break", "case", "char", "const", "continue", "default", "do",
  "double", "else", "enum", "extern", "float", "for", "goto", "if",
  "int", "long", "register", "return", "short", "signed", "sizeof", "static",
  "struct", "switch", "typedef", "union", "unsigned", "void", "volatile", "while",
  "bool", "catch", "class", "const_cast", "delete", "dynamic_cast", "explicit",
  "export", "false", "friend", "inline", "mutable", "namespace", "new",
  "operator", "private", "protected", "public", "reinterpret_cast", "static_cast",
  "template", "this", "throw", "true", "try", "typeid", "typename", "using",
  "virtual", "wchar_t", "nullptr", "override", "final",
]);

// Types and common identifiers
const CPP_TYPES = new Set([
  "string", "vector", "map", "set", "pair", "list", "deque", "queue", "stack",
  "array", "unordered_map", "unordered_set", "shared_ptr", "unique_ptr", "weak_ptr",
  "size_t", "ptrdiff_t", "int8_t", "int16_t", "int32_t", "int64_t",
  "uint8_t", "uint16_t", "uint32_t", "uint64_t",
]);

// Standard library functions
const CPP_FUNCTIONS = new Set([
  "cout", "cin", "endl", "printf", "scanf", "main", "malloc", "free", "new", "delete",
  "push_back", "pop_back", "begin", "end", "size", "empty", "clear", "insert", "erase",
  "find", "sort", "reverse", "swap", "min", "max", "abs", "sqrt", "pow", "log",
  "getline", "strlen", "strcpy", "strcmp", "memset", "memcpy",
]);

const CodeEditor = ({
  code,
  setCode,
  language = "cpp",
  onRun,
  isRunning = false,
  readOnly = false,
  minHeight = "400px",
  showLineNumbers = true,
  placeholder = "// Write your code here...",
}) => {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const highlightRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [history, setHistory] = useState([code]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [fontSize, setFontSize] = useState(14);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Sync scroll between line numbers, highlighted code and textarea
  const syncScroll = () => {
    if (textareaRef.current) {
      const scrollTop = textareaRef.current.scrollTop;
      const scrollLeft = textareaRef.current.scrollLeft;

      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = scrollTop;
      }
      if (highlightRef.current) {
        highlightRef.current.scrollTop = scrollTop;
        highlightRef.current.scrollLeft = scrollLeft;
      }
    }
  };

  // Handle code changes with history
  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCode);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCode(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCode(history[historyIndex + 1]);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }

    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (onRun && !isRunning) onRun();
    }

    if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
    }

    if ((e.key === "z" && (e.ctrlKey || e.metaKey) && e.shiftKey) ||
        (e.key === "y" && (e.ctrlKey || e.metaKey))) {
      e.preventDefault();
      handleRedo();
    }

    const pairs = { "(": ")", "{": "}", "[": "]", '"': '"', "'": "'" };
    if (pairs[e.key]) {
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const selected = code.substring(start, end);

      if (selected) {
        e.preventDefault();
        const newCode = code.substring(0, start) + e.key + selected + pairs[e.key] + code.substring(end);
        setCode(newCode);
        setTimeout(() => {
          e.target.selectionStart = start + 1;
          e.target.selectionEnd = end + 1;
        }, 0);
      }
    }
  };

  const handleDownload = () => {
    const extension = language === "cpp" ? ".cpp" : ".c";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".c,.cpp,.h,.hpp";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setCode(event.target.result);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Syntax highlighting function
  const highlightCode = useMemo(() => {
    const escapeHtml = (str) => {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };

    const lines = code.split("\n");
    return lines.map((line) => {
      let highlighted = "";
      let i = 0;

      while (i < line.length) {
        if (line[i] === "#") {
          let directive = "#";
          i++;
          while (i < line.length && /[a-zA-Z]/.test(line[i])) {
            directive += line[i];
            i++;
          }
          let rest = "";
          while (i < line.length) {
            rest += line[i];
            i++;
          }
          highlighted += `<span class="text-pink-400">${escapeHtml(directive)}</span><span class="text-amber-300">${escapeHtml(rest)}</span>`;
          continue;
        }

        if (line[i] === "/" && line[i + 1] === "/") {
          const comment = escapeHtml(line.slice(i));
          highlighted += `<span class="text-gray-500 italic">${comment}</span>`;
          break;
        }

        if (line[i] === "/" && line[i + 1] === "*") {
          let comment = "/*";
          i += 2;
          while (i < line.length && !(line[i] === "*" && line[i + 1] === "/")) {
            comment += line[i];
            i++;
          }
          if (line[i] === "*" && line[i + 1] === "/") {
            comment += "*/";
            i += 2;
          }
          highlighted += `<span class="text-gray-500 italic">${escapeHtml(comment)}</span>`;
          continue;
        }

        if (line[i] === '"' || line[i] === "'") {
          const quote = line[i];
          let str = quote;
          i++;
          while (i < line.length && line[i] !== quote) {
            if (line[i] === "\\" && i + 1 < line.length) {
              str += line[i] + line[i + 1];
              i += 2;
            } else {
              str += line[i];
              i++;
            }
          }
          if (i < line.length) {
            str += line[i];
            i++;
          }
          highlighted += `<span class="text-emerald-400">${escapeHtml(str)}</span>`;
          continue;
        }

        if (/[0-9]/.test(line[i]) || (line[i] === "." && /[0-9]/.test(line[i + 1]))) {
          let num = "";
          while (i < line.length && /[0-9.xXa-fA-FeE+-]/.test(line[i])) {
            num += line[i];
            i++;
          }
          while (i < line.length && /[fFlLuU]/.test(line[i])) {
            num += line[i];
            i++;
          }
          highlighted += `<span class="text-orange-400">${escapeHtml(num)}</span>`;
          continue;
        }

        if (/[a-zA-Z_]/.test(line[i])) {
          let word = "";
          while (i < line.length && /[a-zA-Z0-9_]/.test(line[i])) {
            word += line[i];
            i++;
          }

          if (CPP_KEYWORDS.has(word)) {
            highlighted += `<span class="text-violet-400 font-semibold">${word}</span>`;
          } else if (CPP_TYPES.has(word)) {
            highlighted += `<span class="text-cyan-400">${word}</span>`;
          } else if (CPP_FUNCTIONS.has(word)) {
            highlighted += `<span class="text-yellow-300">${word}</span>`;
          } else if (line[i] === "(") {
            highlighted += `<span class="text-sky-300">${word}</span>`;
          } else {
            highlighted += `<span class="text-gray-200">${word}</span>`;
          }
          continue;
        }

        if (/[+\-*/%=<>!&|^~?:]/.test(line[i])) {
          let op = line[i];
          i++;
          while (i < line.length && /[+\-*/%=<>!&|^~?:]/.test(line[i])) {
            op += line[i];
            i++;
          }
          highlighted += `<span class="text-rose-400">${escapeHtml(op)}</span>`;
          continue;
        }

        if (/[(){}[\]]/.test(line[i])) {
          highlighted += `<span class="text-amber-200">${escapeHtml(line[i])}</span>`;
          i++;
          continue;
        }

        if (line[i] === ";" || line[i] === ",") {
          highlighted += `<span class="text-gray-400">${line[i]}</span>`;
          i++;
          continue;
        }

        highlighted += escapeHtml(line[i]);
        i++;
      }

      return highlighted || "&nbsp;";
    });
  }, [code]);

  // Fullscreen container styles
  const fullscreenStyles = isFullscreen
    ? { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, borderRadius: 0 }
    : {};

  return (
    <motion.div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden border border-[#2a2a4a] bg-[#0f0f23] shadow-2xl shadow-black/20 flex flex-col"
      style={fullscreenStyles}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-4 py-2.5 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] border-b border-[#2a2a4a] gap-2 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="w-px h-4 bg-[#2a2a4a]"></div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/30">
            <FaCode className="text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-300">
              {language === "cpp" ? "C++" : "C"}
            </span>
          </div>
          <span className="text-xs text-gray-500 hidden sm:inline">{lineCount} lines</span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div className="flex items-center gap-1">
            <button onClick={() => setFontSize(Math.max(10, fontSize - 2))} className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-xs" title="Decrease font size">A-</button>
            <span className="text-xs text-gray-500 px-1 hidden sm:inline">{fontSize}px</span>
            <button onClick={() => setFontSize(Math.min(24, fontSize + 2))} className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-xs" title="Increase font size">A+</button>

            <div className="w-px h-4 bg-[#2a2a4a] mx-1" />

            <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30" title="Undo"><FaUndo size={12} /></button>
            <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30" title="Redo"><FaRedo size={12} /></button>
            <button onClick={handleCopy} className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Copy"><FaCopy size={12} /></button>
            <button onClick={handleDownload} className="hidden sm:block p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Download"><FaDownload size={12} /></button>
            <button onClick={handleUpload} className="hidden sm:block p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Upload"><FaUpload size={12} /></button>
            
            {/* Fullscreen Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-1.5 sm:p-2 rounded-lg transition-all ${isFullscreen ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
              title={isFullscreen ? "Exit fullscreen (ESC)" : "Fullscreen"}
            >
              {isFullscreen ? <FaTimes size={14} /> : <FaExpand size={12} />}
            </button>
          </div>

          {/* RUN BUTTON */}
          {onRun && (
            <button
              onClick={onRun}
              disabled={isRunning || readOnly}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg min-w-[120px] justify-center ${
                isRunning
                  ? "bg-amber-600 text-white cursor-wait animate-pulse"
                  : "bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-500 text-white hover:from-emerald-400 hover:via-green-400 hover:to-cyan-400 shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-105"
              }`}
            >
              <FaPlay size={12} className={isRunning ? "animate-spin" : ""} />
              {isRunning ? "Running..." : "▶ RUN"}
            </button>
          )}
        </div>
      </div>

      {/* Editor area - FIXED SCROLL */}
      <div
        className="relative flex flex-1 overflow-hidden bg-[#0a0a15]"
        style={{ minHeight: isFullscreen ? "auto" : minHeight }}
      >
        {/* Line numbers */}
        {showLineNumbers && (
          <div
            ref={lineNumbersRef}
            className="flex-shrink-0 py-4 px-2 text-right select-none bg-[#0d0d1a] border-r border-[#2a2a4a] overflow-hidden"
            style={{ fontSize: `${fontSize}px`, lineHeight: "1.5" }}
          >
            {lineNumbers.map((num) => (
              <div key={num} className="text-gray-600 pr-2 hover:text-cyan-400 transition-colors">{num}</div>
            ))}
          </div>
        )}

        {/* Code editor container */}
        <div className="flex-1 relative">
          {/* Syntax highlighted layer */}
          <div
            ref={highlightRef}
            className="absolute inset-0 p-4 font-mono pointer-events-none whitespace-pre overflow-auto"
            style={{ fontSize: `${fontSize}px`, lineHeight: "1.5", tabSize: 4 }}
            aria-hidden="true"
          >
            {highlightCode.map((line, idx) => (
              <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />
            ))}
          </div>

          {/* Textarea for input */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            onScroll={syncScroll}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            placeholder={placeholder}
            spellCheck={false}
            className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent font-mono resize-none outline-none z-10 overflow-auto"
            style={{ fontSize: `${fontSize}px`, lineHeight: "1.5", tabSize: 4, caretColor: "#22d3ee" }}
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-medium flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><FaCode size={10} />{language === "cpp" ? "C++" : "C"}</span>
          <span>UTF-8</span>
          {isFullscreen && <span className="text-cyan-200">Press ESC to exit fullscreen</span>}
        </div>
        <div className="flex items-center gap-4">
          <span>Ln {textareaRef.current?.selectionStart ? code.substring(0, textareaRef.current.selectionStart).split("\n").length : 1}</span>
          <span>Spaces: 4</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CodeEditor;
