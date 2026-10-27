import React from "react";
import { ExternalLink } from "lucide-react";

export default function GfgCard({ article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 border-b border-[#E5E5E5] py-4 no-underline"
    >
      <div className="min-w-0">
        <p className="text-[12px] text-[#8A8A8A]">GeeksforGeeks</p>
        <h3 className="mt-1 text-[14px] font-medium text-[#1F1F1F]">{article.title}</h3>
      </div>
      <ExternalLink size={14} className="shrink-0 text-[#1F1F1F]" />
    </a>
  );
}
