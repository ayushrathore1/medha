import React from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search a topic",
  autoFocus = false,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
      className="flex h-[54px] items-center gap-3 rounded-full border border-[var(--line)] bg-white px-5 transition-[border-color,box-shadow] focus-within:border-[#111] focus-within:shadow-[0_0_0_3px_rgba(17,17,17,0.06)]"
    >
      <Search size={18} className="shrink-0 text-[#111]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full border-0 bg-transparent py-1 font-[family-name:var(--font-display)] text-[16px] text-[#111] shadow-none outline-none placeholder:text-[#8A8A8A] focus:border-0 focus:shadow-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="grid h-10 w-10 place-items-center rounded-full text-[#5A5A5A] hover:bg-[var(--ice)]"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}
