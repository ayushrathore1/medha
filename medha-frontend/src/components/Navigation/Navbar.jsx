import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa6";
import { Search, X } from "lucide-react";

// Elaya Design Skills Base Easing Curve
const BASE_EASE = [0.22, 1, 0.36, 1];

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [navSearch, setNavSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [imgError, setImgError] = useState(false);
  const searchInputRef = useRef(null);

  // Sync search input with URL query if on /search page
  useEffect(() => {
    if (location.pathname === "/search") {
      setNavSearch(searchParams.get("q") || "");
    }
  }, [location.pathname, searchParams]);

  // Reset image errors when user profile changes
  useEffect(() => {
    setImgError(false);
  }, [user?.avatar, user?.avatarIndex, user?.email]);

  // Global shortcut: Pressing "/" or "Ctrl+K" focuses the navbar search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName;
      if (
        (e.key === "/" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) &&
        document.activeElement !== searchInputRef.current &&
        activeTag !== "INPUT" &&
        activeTag !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogoClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleProfileClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = navSearch.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/search");
    }
  };

  const getProfileAvatarUrl = () => {
    if (user?.avatar) return user.avatar;
    return null;
  };

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: BASE_EASE }}
      style={{
        background: "rgba(242, 237, 228, 0.94)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-default)",
      }}
      className="fixed top-0 left-0 w-full z-50 transition-all"
    >
      <div className="w-full max-w-6xl mx-auto px-3.5 sm:px-6 flex items-center justify-between h-[64px] sm:h-[68px] gap-2.5 sm:gap-6">
        
        {/* ─── 1. LOGO SECTION (Left) ───────────────────────────── */}
        <div
          className="flex items-center cursor-pointer hover:opacity-85 transition-opacity shrink-0 select-none py-1"
          onClick={handleLogoClick}
          title="Medha Home"
        >
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: 21,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
            }}
          >
            MEDHA
          </span>
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#7DC67A",
              marginBottom: 1,
              marginLeft: 3,
              verticalAlign: "middle",
            }}
          />
        </div>

        {/* ─── 2. SEARCH BOX (Center / Flexible) ────────────────── */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-2xl mx-1 sm:mx-4"
        >
          <div
            className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl transition-all shadow-sm"
            style={{
              background: "var(--bg-tertiary)",
              border: isFocused ? "1.5px solid #7DC67A" : "1px solid var(--border-default)",
              boxShadow: isFocused ? "0 0 16px rgba(125, 198, 122, 0.18)" : "none",
            }}
          >
            <Search
              size={16}
              className={`shrink-0 transition-colors ${
                isFocused ? "text-[#7DC67A]" : "text-[var(--text-secondary)]"
              }`}
            />

            <input
              ref={searchInputRef}
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search notes, YouTube lectures, RTU PYQs..."
              className="w-full bg-transparent outline-none text-xs sm:text-sm font-normal placeholder:text-[var(--text-tertiary)]"
              style={{ color: "var(--text-primary)" }}
              autoComplete="off"
            />

            {navSearch && (
              <button
                type="button"
                onClick={() => {
                  setNavSearch("");
                  searchInputRef.current?.focus();
                }}
                className="p-1 rounded-full text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            )}

            <div className="hidden md:flex items-center gap-1 text-[11px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-tertiary)] border border-[var(--border-default)] shrink-0">
              <span>/</span>
            </div>
          </div>
        </form>

        {/* ─── 3. PROFILE BUTTON (Right) ────────────────────────── */}
        <div className="flex items-center shrink-0">
          <button
            onClick={handleProfileClick}
            data-tour="profile"
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-[var(--border-default)] hover:border-[#7DC67A] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] shadow-sm transition-all overflow-hidden flex items-center justify-center shrink-0 active:scale-[0.98]"
            title={user ? (user.name || "My profile") : "Sign in / Profile"}
          >
            {user && !imgError && getProfileAvatarUrl() ? (
              <img
                alt={user.name || "Profile"}
                src={getProfileAvatarUrl()}
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
                draggable="false"
              />
            ) : (
              <div
                className={`h-full w-full rounded-full flex items-center justify-center transition-colors ${
                  user
                    ? "bg-[#7DC67A] text-white"
                    : "text-[var(--text-secondary)] hover:text-[#7DC67A]"
                }`}
              >
                <FaUser size={15} />
              </div>
            )}
          </button>
        </div>

      </div>
    </motion.nav>
  );
};

export default Navbar;
