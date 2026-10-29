import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../lib/motionPresets';
import { Link } from 'react-router-dom';
import { lp, lpPill, lpDot } from '../lib/landingTheme';
import studentHeroImg from '../assets/landing/student-hero.png';

const floatingBadges = [
  { label: 'Games Done ✓', top: '8%', left: '-12%', delay: 0.4 },
  { label: 'Exams Done ✓', top: '22%', right: '-8%', delay: 0.55 },
  { label: 'Party Done ✓', top: '40%', left: '-16%', delay: 0.7 },
  { label: 'Fun Done ✓', top: '55%', right: '-10%', delay: 0.85 },
  { label: 'Skills Learnt ✓', top: '70%', left: '-10%', delay: 1.0 },
  { label: 'MEDHA Helped ✓', top: '82%', right: '-6%', delay: 1.15 },
];

const HeroSection = ({ totalStudents }) => {
  const headlines = ["The Last-Minute", "Exam Prep Tool", "for College Students."];

  return (
    <section className="hero-section" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: lp.bg, paddingTop: 72 }}>
      <div className="bg-watermark" style={{
        position: 'absolute', userSelect: 'none', pointerEvents: 'none', zIndex: 0,
        fontSize: 180, fontWeight: 600, color: 'rgba(31,31,31,0.04)',
        letterSpacing: '-0.05em', lineHeight: 1, top: '10%', left: '-2%',
        fontFamily: lp.font,
      }}>MEDHA</div>

      <div className="hero-inner" style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        minHeight: 'calc(100vh - 72px)', position: 'relative', zIndex: 10
      }}>
        <div className="hero-left" style={{ width: '45%' }}>
          <motion.div {...fadeIn} transition={{ delay: 0 }}>
            <span style={lpPill}>
              <span style={lpDot} />
              The Last-Minute Exam Tool for College Students
            </span>
          </motion.div>

          <div style={{ marginTop: 20 }}>
            {headlines.map((line, i) => (
              <div key={i} style={{ overflow: 'hidden' }}>
                <motion.h1
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.15 }}
                  style={{
                    fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: lp.heading,
                    letterSpacing: '-0.03em', lineHeight: 1.15, color: lp.ink, margin: 0,
                    fontFamily: lp.font,
                  }}
                >
                  {i === 2 ? (
                    <>for College Students.</>
                  ) : i === 1 ? (
                    <><span className="wavy-underline">Exam Prep</span> Tool</>
                  ) : line}
                </motion.h1>
              </div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            style={{ marginTop: 24, fontSize: 15, color: lp.muted, lineHeight: 1.7, maxWidth: 480, fontFamily: lp.font }}
          >
            Everyone's prepping you for <span style={{ fontWeight: 600, color: lp.ink }}>placements</span>.
            But you still have <span style={{ fontWeight: 600, color: lp.ink }}>4 years of end-sems</span> to survive.{' '}
            You game, party, code, chill — and study <span style={{ fontWeight: 600, color: lp.ink }}>1-2 weeks before exams</span>.{' '}
            <span style={{ fontWeight: 600, color: lp.ink }}>
              That's enough. MEDHA Revision has your back.
            </span>
          </motion.p>

          <motion.div
            className="hero-search-bar"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            style={{
              marginTop: 32, display: 'flex', alignItems: 'center', gap: 8,
              background: 'transparent', borderRadius: 0, border: 'none',
              borderBottom: `1px solid ${lp.line}`,
              boxShadow: 'none', overflow: 'hidden', width: '100%',
              maxWidth: 460, paddingBottom: 8,
            }}
          >
            <div style={{ position: 'relative', paddingLeft: 0, paddingRight: 4, flexShrink: 0 }}>
              <div style={{
                width: 16, height: 16, border: `2px solid ${lp.ink}`, borderRadius: '50%', position: 'relative'
              }}>
                <div style={{
                  position: 'absolute', bottom: -4, right: -3,
                  width: 6, height: 2, background: lp.ink,
                  transform: 'rotate(45deg)', borderRadius: 1
                }} />
              </div>
            </div>
            <input
              placeholder="Search a topic"
              style={{
                padding: '8px 4px', fontSize: 15, color: lp.ink,
                border: 'none', outline: 'none', background: 'transparent',
                flex: 1, minWidth: 0,
                fontFamily: lp.font
              }}
            />
            <Link to="/rtu-exams" style={{
              padding: '8px 16px', background: lp.ink, color: 'white', fontWeight: 600,
              fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
              border: 'none', cursor: 'pointer', textDecoration: 'none',
              transition: 'background 150ms', alignSelf: 'stretch', flexShrink: 0,
              fontFamily: lp.font,
            }}>
              GO <span style={{ fontSize: 12 }}>→</span>
            </Link>
          </motion.div>

          <motion.div
            className="hero-social-proof"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <div style={{ display: 'flex' }}>
              {['RS', 'PM', 'AK', 'DP', '+5'].map((initials, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: '50%', border: `2px solid ${lp.bg}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 600, color: 'white',
                  background: lp.ink,
                  marginLeft: i === 0 ? 0 : -10, zIndex: 5 - i,
                  fontFamily: lp.font,
                }}>{initials}</div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: lp.muted, margin: 0, fontFamily: lp.font }}>
              <span style={{ fontWeight: 600, color: lp.ink }}>{totalStudents}</span>{' '}students crushed their exams
            </p>
          </motion.div>
        </div>

        <div className="hero-right" style={{ width: '50%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 580 }}>
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
                borderRadius: 0,
                filter: 'none'
              }}
            />
          </motion.div>

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
                background: lp.bg,
                border: `1px solid ${lp.line}`,
                borderRadius: 0,
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 600,
                color: lp.ink,
                whiteSpace: 'nowrap',
                fontFamily: lp.font,
                animation: `badgeFloat ${3 + i * 0.4}s ease-in-out ${i * 0.2}s infinite`,
              }}
            >
              {badge.label}
            </motion.div>
          ))}

          <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 10 }}>
            <span style={{ fontSize: 12, color: lp.faint, fontFamily: lp.font }}>Scroll to explore</span>
            <div className="scroll-arrow" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
