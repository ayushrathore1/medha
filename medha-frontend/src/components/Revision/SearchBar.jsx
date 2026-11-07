import React from "react";
import { Search, X } from "lucide-react";
import "../../pages/DashboardHome.css";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = "Search a topic, unit, or subject…",
  autoFocus = false,
  showButton = true,
  live = false,
}) {
  const clear = () => {
    if (onClear) onClear();
    else onChange?.("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
      className={`dash-search${live ? " dash-search--live" : ""}`}
      role="search"
    >
      <div className="dash-search-inner">
        <Search size={18} className="shrink-0 text-[#111]" aria-hidden />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || (live ? "Type to search…" : "Search a topic, unit, or subject…")}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          aria-label="Search the library"
        />
        {value ? (
          <button
            type="button"
            onClick={clear}
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
