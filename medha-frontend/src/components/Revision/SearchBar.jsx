import React from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, onSubmit, placeholder = "Search a topic", autoFocus = false }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
      className="flex items-center gap-2 border-b border-[#E5E5E5] py-2"
    >
      <Search size={16} className="shrink-0 text-[#1F1F1F]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full border-0 bg-transparent py-1 text-[15px] text-[#1F1F1F] shadow-none outline-none placeholder:text-[#8A8A8A] focus:border-0 focus:shadow-none"
      />
      {value && (
        <button type="button" onClick={() => onChange("")} className="text-[#8A8A8A]" aria-label="Clear search">
          <X size={14} />
        </button>
      )}
    </form>
  );
}
