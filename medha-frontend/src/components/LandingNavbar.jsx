import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const links = [
    { label: "Subjects", to: "/subjects" },
    { label: "Notes", to: "/notes" },
    { label: "Exams", to: "/rtu-exams" },
    { label: "Search", to: "/search" },
  ];

  return (
    <>
      <nav className={`wama-nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="wama-nav-inner">
          <Link to="/" className="wama-wordmark">
            <span className="wama-wordmark-name">Medha Revision</span>
            <span className="wama-wordmark-by">
              By{" "}
              <span className="wama-wordmark-ck">
                <span className="wama-wordmark-ck-campus">campus</span>
                <span className="wama-wordmark-ck-kart">kart</span>
                <span className="wama-wordmark-dot" aria-hidden="true" />
              </span>
            </span>
          </Link>

          <div className="nav-links-desktop wama-nav-links">
            {links.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="nav-right-desktop">
            <Link to="/login" className="wama-nav-login">
              Login
            </Link>
            <Link to="/register" className="wama-pill wama-pill-sm">
              Start a project
            </Link>
          </div>

          <button
            className={`nav-hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`nav-mobile-overlay ${menuOpen ? "open" : ""}`}>
        {links.map((link) => (
          <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
            {link.label}
          </Link>
        ))}
        <Link to="/login" onClick={() => setMenuOpen(false)}>
          Login
        </Link>
        <Link to="/register" className="mobile-cta" onClick={() => setMenuOpen(false)}>
          Start a project
        </Link>
      </div>
    </>
  );
};

export default LandingNavbar;
