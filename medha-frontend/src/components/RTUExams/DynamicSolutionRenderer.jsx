import React, { useMemo } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

/**
 * Dynamic Solution Renderer
 * Renders AI solutions with question-type-specific UI templates
 */
const DynamicSolutionRenderer = ({ 
  solution, 
  analysis, 
  feedback, 
  uiTemplate, 
  metadata,
  subjectName,
  unitSerial,
  marks
}) => {
  // Get color scheme based on template
  const colors = useMemo(() => {
    const config = uiTemplate?.config || {};
    const primaryColor = config.primaryColor || "indigo";
    
    const colorMap = {
      indigo: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", accent: "bg-indigo-600" },
      blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", accent: "bg-blue-600" },
      purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", accent: "bg-purple-600" },
      teal: { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700", accent: "bg-teal-600" },
      orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", accent: "bg-orange-600" },
      green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", accent: "bg-green-600" },
      sky: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700", accent: "bg-sky-600" },
      rose: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", accent: "bg-rose-600" },
    };
    
    return colorMap[primaryColor] || colorMap.indigo;
  }, [uiTemplate]);

  // Format solution text for KaTeX
  const formatSolution = (text) => {
    if (!text) return "";
    return text
      .replace(/\\\[/g, '$$')
      .replace(/\\\]/g, '$$')
      .replace(/\\\(/g, '$')
      .replace(/\\\)/g, '$');
  };

  // Markdown components with dynamic styling
  const markdownComponents = {
    h1: ({node, ...props}) => (
      <h1 className={`text-2xl font-black ${colors.text} mb-4 border-b pb-2 ${colors.border}`} {...props} />
    ),
    h2: ({node, ...props}) => (
      <h2 className="text-xl font-bold text-slate-800 mt-6 mb-3 flex items-center gap-2" {...props} />
    ),
    h3: ({node, ...props}) => (
      <h3 className="text-lg font-bold text-slate-700 mt-4 mb-2" {...props} />
    ),
    ul: ({node, ...props}) => (
      <ul className={`list-disc pl-5 space-y-1 my-4 bg-white p-4 rounded-xl border ${colors.border} shadow-sm`} {...props} />
    ),
    ol: ({node, ...props}) => (
      <ol className={`list-decimal pl-5 space-y-1 my-4 bg-white p-4 rounded-xl border ${colors.border} shadow-sm`} {...props} />
    ),
    li: ({node, ...props}) => <li className="pl-1" {...props} />,
    code: ({node, inline, ...props}) => 
      inline ? (
        <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-sm font-mono" {...props} />
      ) : (
        <code className="block bg-slate-800 text-slate-100 p-4 rounded-xl text-sm font-mono my-4 overflow-x-auto shadow-inner" {...props} />
      ),
    table: ({node, ...props}) => (
      <div className="overflow-x-auto my-6 rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-sm text-left" {...props} />
      </div>
    ),
    th: ({node, ...props}) => (
      <th className={`${colors.bg} px-4 py-3 font-bold ${colors.text} border-b ${colors.border}`} {...props} />
    ),
    td: ({node, ...props}) => (
      <td className="px-4 py-3 border-b border-slate-100 bg-white" {...props} />
    ),
    blockquote: ({node, ...props}) => (
      <blockquote className={`border-l-4 ${colors.border} pl-4 py-1 my-4 ${colors.bg} ${colors.text} italic rounded-r-lg`} {...props} />
    ),
    // Style paragraphs for better separation
    p: ({node, ...props}) => (
      <p className="my-3 text-slate-700 leading-relaxed" {...props} />
    ),
  };

  return (
    <div className="space-y-6">
      {/* Key Topics - Only showing this from analysis */}
      {analysis?.keyTopics && analysis.keyTopics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${colors.bg} rounded-xl p-4 border ${colors.border}`}
        >
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-slate-600 font-bold">📌 Key Topics:</span>
            {analysis.keyTopics.map((topic, idx) => (
              <span key={idx} className={`text-sm font-semibold ${colors.text} bg-white px-3 py-1 rounded-full border ${colors.border} shadow-sm`}>
                {topic}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Solution Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={markdownComponents}
        >
          {formatSolution(solution)}
        </ReactMarkdown>
      </motion.div>

      {/* Subtle footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="pt-4 border-t border-slate-100"
      >
        <p className="text-xs text-slate-400 text-center font-medium">
          ✨ AI-Generated Solution • Verify with standard textbooks
        </p>
      </motion.div>
    </div>
  );
};

export default DynamicSolutionRenderer;
