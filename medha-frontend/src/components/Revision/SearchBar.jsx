import React from "react";
import { Search, X } from "lucide-react";
import "../../pages/DashboardHome.css";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search a topic, unit, or subject…",
  autoFocus = false,
  showButton = true,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
      className="dash-search"
    >
      <div className="dash-search-inner">
        <Search size={18} className="shrink-0 text-[#111]" aria-hidden />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label="Search the library"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#5A5A5A] hover:bg-[#F4F4F4]"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        ) : null}
        {showButton ? (
          <button type="submit" className="dash-search-go">
            Search
          </button>
        ) : null}
      </div>
    </form>
  );
}
