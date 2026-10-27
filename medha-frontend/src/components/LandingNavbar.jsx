import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingNavbar = ({ studentsOnline }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Notes', to: '/notes' },
    { label: 'PYQ Analysis', to: '/rtu-exams' },
  ];

  return (
    <>
      <nav className="landing-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.9)' : '#FFFFFF',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #E5E5E5' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 0 rgba(229,229,229,0.8), 0 4px 20px rgba(255,255,255,0.6)' : 'none',
        transition: 'all 300ms ease',
        padding: '0 32px',
      }}>
        <div className="landing-nav-inner" style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 72,
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', zIndex: 200 }}>
            <span style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: '-0.03em', color: '#1F1F1F' }}>
              MEDHA
            </span>
            <span className="logo-dot" style={{
              display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
              background: '#F59E0B', marginBottom: 2, marginLeft: 2, verticalAlign: 'middle'
            }} />
          </Link>

          {/* Desktop Nav Links */}
          <div className="nav-links-desktop">
            {navLinks.map(link => (
              <Link key={link.label} to={link.to} style={{
                fontSize: 15, fontWeight: 400, color: '#1F1F1F',
                textDecoration: 'none', transition: 'color 150ms',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#7DC67A'}
              onMouseLeave={e => e.currentTarget.style.color = '#1F1F1F'}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="nav-right-desktop">
            {/* Login */}
            <Link to="/login" style={{
              fontSize: 15, fontWeight: 400, color: '#1F1F1F',
              textDecoration: 'none', transition: 'color 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#7DC67A'}
            onMouseLeave={e => e.currentTarget.style.color = '#1F1F1F'}
            >
              Login
            </Link>

            {/* Get Started */}
            <Link to="/register" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#1F1F1F', color: 'white',
              borderRadius: 999, padding: '10px 20px',
              fontSize: 14, fontWeight: 600, textDecoration: 'none',
              transition: 'transform 150ms',
            }}>
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div className={`nav-mobile-overlay ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <Link
            key={link.label}
            to={link.to}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link to="/login" onClick={() => setMenuOpen(false)}>
          Login
        </Link>
        <Link
          to="/register"
          className="mobile-cta"
          onClick={() => setMenuOpen(false)}
        >
          Get Started →
        </Link>
      </div>
    </>
  );
};

export default LandingNavbar;
