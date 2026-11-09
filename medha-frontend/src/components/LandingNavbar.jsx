import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BrandMark from "./Common/BrandMark";
import { AuthContext } from "../AuthContext";
import { isTeamUser } from "../config/appMode";
import LogoutConfirm from "./Revision/LogoutConfirm";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const LandingNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [showOps, setShowOps] = useState(() => isTeamUser(user));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setShowOps(false);
      return undefined;
    }
    if (isTeamUser(user)) {
      setShowOps(true);
    }
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BACKEND_URL}/api/messages/check-admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) setShowOps(Boolean(res.data?.isAdmin || res.data?.isTeam || res.data?.isFullAdmin));
      } catch {
        if (!cancelled) setShowOps(isTeamUser(user));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Logged-in primary nav lives in bottom tabs on mobile — keep desktop links only.
  const desktopLinks = user
    ? [
        { label: "Home", to: "/" },
        { label: "Subjects", to: "/subjects" },
        { label: "Search", to: "/search" },
        { label: "Papers", to: "/past-papers" },
        { label: "Upload", to: "/upload" },
        ...(showOps ? [{ label: "Ops", to: "/admin" }] : []),
      ]
    : [
        { label: "Subjects", to: "/subjects" },
        { label: "Search", to: "/search" },
        { label: "Papers", to: "/past-papers" },
      ];

  const guestMobileLinks = [
    { label: "Subjects", to: "/subjects" },
    { label: "Search", to: "/search" },
    { label: "Papers", to: "/past-papers" },
  ];

  return (
    <>
      <nav className={`wama-nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="wama-nav-inner">
          <BrandMark variant="nav" medhaTo="/" />

          <div className="nav-links-desktop wama-nav-links">
            {desktopLinks.map((link) => (
              <Link key={`${link.label}-${link.to}`} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="nav-right-desktop">
            {user ? (
              <>
                {showOps ? (
                  <Link to="/admin" className="wama-pill wama-pill-sm" title="Ops desk">
                    Ops
                  </Link>
                ) : null}
                <Link to="/profile" className="wama-nav-login">
                  Profile
                </Link>
                <button type="button" className="wama-pill wama-pill-sm" onClick={() => setLogoutOpen(true)}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="wama-nav-login">
                  Login
                </Link>
                <Link to="/register" className="wama-pill wama-pill-sm">
                  Get started
                </Link>
              </>
            )}
          </div>

          {user ? (
            <div className="nav-mobile-logout">
              {showOps ? (
                <Link to="/admin" className="wama-pill wama-pill-sm" title="Ops desk">
                  Ops
                </Link>
              ) : null}
              <button
                type="button"
                className="wama-pill wama-pill-sm"
                onClick={() => setLogoutOpen(true)}
              >
                Log out
              </button>
            </div>
          ) : (
            <button
              className={`nav-hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          )}
        </div>
      </nav>

      {!user ? (
        <div className={`nav-mobile-overlay ${menuOpen ? "open" : ""}`}>
          {guestMobileLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
          <Link to="/register" className="mobile-cta" onClick={() => setMenuOpen(false)}>
            Get started
          </Link>
        </div>
      ) : null}

      <LogoutConfirm
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          logout?.();
          navigate("/", { replace: true });
        }}
      />
    </>
  );
};

export default LandingNavbar;
