import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../lib/motionPresets';
import { Link } from 'react-router-dom';
import studentHeroImg from '../assets/landing/student-hero.png';

const floatingBadges = [
  { label: 'Games Done ✓', color: '#13B8D4', bg: 'rgba(19,184,212,0.15)', top: '8%', left: '-12%', delay: 0.4 },
  { label: 'Exams Done ✓', color: '#9ADFEA', bg: 'rgba(154,223,234,0.15)', top: '22%', right: '-8%', delay: 0.55 },
  { label: 'Party Done ✓', color: '#7ED5E4', bg: 'rgba(126,213,228,0.15)', top: '40%', left: '-16%', delay: 0.7 },
  { label: 'Fun Done ✓', color: '#77C9E0', bg: 'rgba(119,201,224,0.15)', top: '55%', right: '-10%', delay: 0.85 },
  { label: 'Skills Learnt ✓', color: '#29B9DD', bg: 'rgba(59,130,246,0.15)', top: '70%', left: '-10%', delay: 1.0 },
  { label: 'MEDHA Helped ✓', color: '#13B8D4', bg: 'rgba(19,184,212,0.18)', top: '82%', right: '-6%', delay: 1.15 },
];

const HeroSection = ({ totalStudents }) => {
  const headlines = ["Make every", "study session", "count."];

  return (
    <section className="hero-section" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#FFFFFF', paddingTop: 72 }}>
      {/* BG Layer 1 — Grain */}
      <div className="grain" style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.12 }} />
      <div className="hero-calm-orbit hero-calm-orbit-one" aria-hidden="true">
        <svg viewBox="0 0 520 520" role="presentation"><circle cx="260" cy="260" r="190" fill="none" stroke="#B7EDF4" strokeWidth="1.5"/><circle cx="260" cy="260" r="145" fill="none" stroke="#D9F5F8" strokeWidth="1.5"/><circle cx="260" cy="260" r="92" fill="#EAFBFD" fillOpacity=".6"/><path d="M260 70 A190 190 0 0 1 450 260" fill="none" stroke="#25C2DC" strokeWidth="3" strokeLinecap="round"/><circle cx="450" cy="260" r="6" fill="#25C2DC"/></svg>
      </div>
      <div className="hero-calm-orbit hero-calm-orbit-two" aria-hidden="true">
        <svg viewBox="0 0 180 180" role="presentation"><path d="M90 10 C135 10 170 45 170 90 S135 170 90 170 S10 135 10 90 S45 10 90 10Z" fill="none" stroke="#B7EDF4" strokeWidth="1.5"/><path d="M90 32 C122 32 148 58 148 90 S122 148 90 148 S32 122 32 90 S58 32 90 32Z" fill="none" stroke="#D9F5F8" strokeWidth="1.5"/><circle cx="90" cy="10" r="4" fill="#25C2DC"/></svg>
      </div>

      {/* BG Layer 2 — Gradient Mesh */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 700px 500px at 75% 45%, rgba(19,184,212,0.08) 0%, transparent 65%),
          radial-gradient(ellipse 500px 400px at 15% 75%, rgba(154,223,234,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 400px 300px at 90% 90%, rgba(119,201,224,0.04) 0%, transparent 60%)`
      }} />

      {/* BG Layer 3 — Decorative rings */}
      <div className="ring" style={{ width: 600, height: 600, right: -120, top: -80 }} />
      <div className="ring" style={{ width: 380, height: 380, right: 40, top: 60, borderColor: 'rgba(19,184,212,0.06)' }} />

      {/* BG Layer 4 — Large watermark */}
      <div className="bg-watermark" style={{
        position: 'absolute', userSelect: 'none', pointerEvents: 'none', zIndex: 0,
        fontSize: 180, fontWeight: 900, color: 'rgba(15,112,132,0.035)',
        letterSpacing: '-0.05em', lineHeight: 1, top: '10%', left: '-2%'
      }}>MEDHA</div>

      {/* Inner Layout */}
      <div className="hero-inner" style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        minHeight: 'calc(100vh - 72px)', position: 'relative', zIndex: 10
      }}>
        {/* LEFT COLUMN */}
        <div className="hero-left" style={{ width: '45%' }}>
          {/* Pre-label */}
          <motion.div {...fadeIn} transition={{ delay: 0 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(19,184,212,0.1)', border: '1px solid rgba(19,184,212,0.25)',
              borderRadius: 999, padding: '6px 16px',
              fontSize: 11, fontWeight: 600, color: '#13B8D4',
              textTransform: 'uppercase', letterSpacing: '0.1em'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#13B8D4' }} />
              A smarter way to prepare for university exams
            </span>
          </motion.div>

          {/* Headline */}
          <div style={{ marginTop: 20 }}>
            {headlines.map((line, i) => (
              <div key={i} style={{ overflow: 'hidden' }}>
                <motion.h1
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.15 }}
                  style={{
                    fontSize: 'clamp(32px, 5vw, 72px)', fontWeight: 800,
                    letterSpacing: '-0.04em', lineHeight: 1.0, color: '#10233F', margin: 0,
                  }}
                >
                  {i === 2 ? (
                    <>count<span style={{ color: '#2563EB' }}>.</span></>
                  ) : i === 1 ? (
                    <><span className="wavy-underline">study</span> session</>
                  ) : line}
                </motion.h1>
              </div>
            ))}
          </div>

          {/* Punchline / Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            style={{ marginTop: 24, fontSize: 17, color: '#6B6B6B', lineHeight: 1.7, maxWidth: 480 }}
          >
            Turn scattered notes and past papers into a clear plan. Find important topics, revise with AI-powered study tools, and walk into your RTU exams feeling prepared.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            className="hero-search-bar"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            style={{
              marginTop: 32, display: 'flex', alignItems: 'center',
              background: 'white', borderRadius: 14, border: '1.5px solid #E5E5E5',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden', width: '100%',
              maxWidth: 460,
            }}
          >
            <div style={{ position: 'relative', paddingLeft: 16, paddingRight: 4, flexShrink: 0 }}>
              <div style={{
                width: 16, height: 16, border: '2px solid #9A9A9A', borderRadius: '50%', position: 'relative'
              }}>
                <div style={{
                  position: 'absolute', bottom: -4, right: -3,
                  width: 6, height: 2, background: '#9A9A9A',
                  transform: 'rotate(45deg)', borderRadius: 1
                }} />
              </div>
            </div>
            <input
              placeholder="Find your subject"
              style={{
                padding: '16px 12px', fontSize: 16, color: '#1F1F1F',
                border: 'none', outline: 'none', background: 'transparent',
                flex: 1, minWidth: 0,
                fontFamily: "ui-sans-serif, system-ui, sans-serif"
              }}
            />
            <Link to="/rtu-exams" style={{
              padding: '16px 28px', background: '#13B8D4', color: 'white', fontWeight: 700,
              fontSize: 16, display: 'flex', alignItems: 'center', gap: 8,
              border: 'none', cursor: 'pointer', textDecoration: 'none',
              transition: 'background 150ms', alignSelf: 'stretch', flexShrink: 0,
            }}>
              GO <span style={{ fontSize: 14 }}>→</span>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="hero-social-proof"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <div style={{ display: 'flex' }}>
              {[
                { initials: 'RS', from: '#13B8D4', to: '#078DA8' },
                { initials: 'PM', from: '#9ADFEA', to: '#168FA8' },
                { initials: 'AK', from: '#77C9E0', to: '#197F9C' },
                { initials: 'DP', from: '#66C8DC', to: '#168FA8' },
                { initials: '+5', from: '#1F1F1F', to: '#2D2D3F' },
              ].map((a, i) => (
                <div key={i} style={{
                  width: 36, height: 36, borderRadius: '50%', border: '2px solid #FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'white',
                  background: `linear-gradient(135deg, ${a.from}, ${a.to})`,
                  marginLeft: i === 0 ? 0 : -10, zIndex: 5 - i
                }}>{a.initials}</div>
              ))}
            </div>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: '#13B8D4',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>✓</span>
            </div>
            <p style={{ fontSize: 14, color: '#6B6B6B', margin: 0 }}>
              <span style={{ fontWeight: 700, color: '#1F1F1F' }}>{totalStudents}</span>{' '}students crushed their exams
            </p>
          </motion.div>
        </div>

        {/* RIGHT COLUMN — Student Image with Floating Badges */}
        <div className="hero-right" style={{ width: '50%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 580 }}>
          {/* Soft glow behind student */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%', height: '80%',
            background: 'radial-gradient(ellipse at center, rgba(37,194,220,0.16) 0%, rgba(183,237,244,0.12) 50%, transparent 80%)',
            filter: 'blur(50px)', borderRadius: '50%', zIndex: 0
          }} />

          {/* Student Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            style={{ position: 'relative', zIndex: 2, width: '70%', maxWidth: 400 }}
          >
            <img
              src={studentHeroImg}
              alt="Smart happy college student with achievements"
              style={{
                width: '100%', height: 'auto',
                borderRadius: 24,
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))'
              }}
            />
          </motion.div>

          {/* Floating Achievement Badges */}
          {floatingBadges.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: badge.delay }}
              className="hero-floating-badge"
              style={{
                position: 'absolute',
                top: badge.top,
                left: badge.left || 'auto',
                right: badge.right || 'auto',
                zIndex: 5,
                background: badge.bg,
                border: `1.5px solid ${badge.color}30`,
                borderRadius: 999,
                padding: '8px 18px',
                fontSize: 13,
                fontWeight: 700,
                color: badge.color,
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(8px)',
                boxShadow: `0 4px 16px ${badge.color}15`,
                animation: `badgeFloat ${3 + i * 0.4}s ease-in-out ${i * 0.2}s infinite`,
              }}
            >
              {badge.label}
            </motion.div>
          ))}

          {/* Scroll indicator */}
          <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 10 }}>
            <span style={{ fontSize: 12, color: '#9A9A9A' }}>Scroll to explore</span>
            <div className="scroll-arrow" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
