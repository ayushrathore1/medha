import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../lib/motionPresets';
import { Link } from 'react-router-dom';
import studentHeroImg from '../assets/landing/student-hero.png';

const floatingBadges = [
  { label: 'Games Done ✓', color: '#7DC67A', bg: 'rgba(125,198,122,0.15)', top: '8%', left: '-12%', delay: 0.4 },
  { label: 'Exams Done ✓', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', top: '22%', right: '-8%', delay: 0.55 },
  { label: 'Party Done ✓', color: '#EC4899', bg: 'rgba(236,72,153,0.15)', top: '40%', left: '-16%', delay: 0.7 },
  { label: 'Fun Done ✓', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)', top: '55%', right: '-10%', delay: 0.85 },
  { label: 'Skills Learnt ✓', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', top: '70%', left: '-10%', delay: 1.0 },
  { label: 'MEDHA Helped ✓', color: '#7DC67A', bg: 'rgba(125,198,122,0.18)', top: '82%', right: '-6%', delay: 1.15 },
];

const HeroSection = ({ totalStudents }) => {
  const headlines = ["The Last-Minute", "Exam Prep Tool", "for College Students."];

  return (
    <section className="hero-section" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#F2EDE4', paddingTop: 72 }}>
      {/* BG Layer 1 — Grain */}
      <div className="grain" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* BG Layer 2 — Gradient Mesh */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 700px 500px at 75% 45%, rgba(125,198,122,0.08) 0%, transparent 65%),
          radial-gradient(ellipse 500px 400px at 15% 75%, rgba(245,158,11,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 400px 300px at 90% 90%, rgba(139,92,246,0.04) 0%, transparent 60%)`
      }} />

      {/* BG Layer 3 — Decorative rings */}
      <div className="ring" style={{ width: 600, height: 600, right: -120, top: -80 }} />
      <div className="ring" style={{ width: 380, height: 380, right: 40, top: 60, borderColor: 'rgba(125,198,122,0.06)' }} />

      {/* BG Layer 4 — Large watermark */}
      <div className="bg-watermark" style={{
        position: 'absolute', userSelect: 'none', pointerEvents: 'none', zIndex: 0,
        fontSize: 180, fontWeight: 900, color: 'rgba(26,26,46,0.025)',
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
              background: 'rgba(125,198,122,0.1)', border: '1px solid rgba(125,198,122,0.25)',
              borderRadius: 999, padding: '6px 16px',
              fontSize: 11, fontWeight: 600, color: '#7DC67A',
              textTransform: 'uppercase', letterSpacing: '0.1em'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7DC67A' }} />
              The Last-Minute Exam Tool for College Students
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
                    letterSpacing: '-0.04em', lineHeight: 1.0, color: '#1A1A2E', margin: 0,
                  }}
                >
                  {i === 2 ? (
                    <>for College Students<span style={{ color: '#F59E0B' }}>.</span></>
                  ) : i === 1 ? (
                    <><span className="wavy-underline">Exam Prep</span> Tool</>
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
            Everyone's prepping you for <span style={{ fontWeight: 700, color: '#1A1A2E' }}>placements</span>. 
            But you still have <span style={{ fontWeight: 700, color: '#1A1A2E' }}>4 years of end-sems</span> to survive.{' '}
            You game, party, code, chill — and study <span style={{ fontWeight: 700, color: '#7DC67A' }}>1-2 weeks before exams</span>.{' '}
            <span style={{ fontWeight: 800, color: '#1A1A2E' }}>
              That's enough. MEDHA Revision has your back.
            </span>
          </motion.p>

          {/* Search Bar */}
          <motion.div
            className="hero-search-bar"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            style={{
              marginTop: 32, display: 'flex', alignItems: 'center',
              background: 'white', borderRadius: 14, border: '1.5px solid #E8E4DC',
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
                padding: '16px 12px', fontSize: 16, color: '#1A1A2E',
                border: 'none', outline: 'none', background: 'transparent',
                flex: 1, minWidth: 0,
                fontFamily: "'DM Sans', sans-serif"
              }}
            />
            <Link to="/rtu-exams" style={{
              padding: '16px 28px', background: '#7DC67A', color: 'white', fontWeight: 700,
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
                { initials: 'RS', from: '#7DC67A', to: '#4A9E47' },
                { initials: 'PM', from: '#F59E0B', to: '#D97706' },
                { initials: 'AK', from: '#8B5CF6', to: '#6D28D9' },
                { initials: 'DP', from: '#EF4444', to: '#DC2626' },
                { initials: '+5', from: '#1A1A2E', to: '#2D2D3F' },
              ].map((a, i) => (
                <div key={i} style={{
                  width: 36, height: 36, borderRadius: '50%', border: '2px solid #F2EDE4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'white',
                  background: `linear-gradient(135deg, ${a.from}, ${a.to})`,
                  marginLeft: i === 0 ? 0 : -10, zIndex: 5 - i
                }}>{a.initials}</div>
              ))}
            </div>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: '#7DC67A',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>✓</span>
            </div>
            <p style={{ fontSize: 14, color: '#6B6B6B', margin: 0 }}>
              <span style={{ fontWeight: 700, color: '#1A1A2E' }}>{totalStudents}</span>{' '}students crushed their exams
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
            background: 'radial-gradient(ellipse at center, rgba(125,198,122,0.12) 0%, rgba(245,158,11,0.06) 50%, transparent 80%)',
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
