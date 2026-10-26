import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/motionPresets';

const WhySection = ({ stats }) => {
  const timeline = [
    { icon: '📋', title: 'Pick Your Subject', copy: 'Choose from 250+ RTU topics across all branches.' },
    { icon: '🤖', title: 'AI Generates Your Plan', copy: 'Instant cheatsheets, PYQ analysis, and priority maps.' },
    { icon: '📝', title: 'Study Smarter', copy: 'Focus on what repeats. Skip what doesn\'t.' },
    { icon: '🎯', title: 'Walk Into the Exam Confident', copy: 'Cover 80% of likely questions in half the time.' },
  ];

  return (
    <section style={{ background: 'white', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      <div className="dot-grid" style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.3 }} />

      <div className="why-layout section-container" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', gap: 64, position: 'relative', zIndex: 10 }}>
        {/* LEFT — Timeline */}
        <div style={{ flex: 1 }}>
          <motion.div {...fadeUp}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(125,198,122,0.1)', border: '1px solid rgba(125,198,122,0.25)',
              borderRadius: 999, padding: '6px 16px', marginBottom: 20,
              fontSize: 11, fontWeight: 600, color: '#7DC67A',
              textTransform: 'uppercase', letterSpacing: '0.1em'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7DC67A' }} />
              WHY IT WORKS
            </span>
          </motion.div>

          <motion.h2 {...fadeUp} style={{
            fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800,
            color: '#1A1A2E', lineHeight: 1.1, letterSpacing: '-0.03em', marginTop: 20, marginBottom: 40
          }}>
            How MEDHA saves<br />your semester<span style={{ color: '#F59E0B' }}>.</span>
          </motion.h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}
              >
                <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.5 }}>{item.copy}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT — Stat Cards */}
        <motion.div {...fadeUp} style={{ flex: 1 }}>
          {/* Green stat card */}
          <div style={{
            background: '#7DC67A', borderRadius: 20, padding: 40,
            position: 'relative', overflow: 'hidden', marginBottom: 16
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,255,255,0.05) 8px, rgba(255,255,255,0.05) 9px)'
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', position: 'relative', zIndex: 1 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 8 }}>LIVE</div>
                <div style={{ fontSize: 48, fontWeight: 900, color: '#1A1A2E', letterSpacing: '-0.03em', lineHeight: 1 }}>{stats.studentsOnline}</div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                  STUDYING RIGHT NOW <span className="pulse-dot" style={{ display: 'inline-block' }} />
                </div>
              </div>
              <div style={{ width: 1, height: 60, background: 'rgba(26,26,46,0.15)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: '#1A1A2E', letterSpacing: '-0.03em', lineHeight: 1 }}>250+</div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7, marginTop: 6 }}>TOPICS COVERED</div>
              </div>
            </div>
          </div>

          {/* Secondary cards */}
          <div className="why-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: '#1A1A2E', borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#F59E0B', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>10</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>Years of RTU Past Papers</div>
            </div>
            <div style={{ background: '#F2EDE4', borderRadius: 16, padding: 24, border: '1px solid #E8E4DC' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#1A1A2E', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>4.8★</div>
              <div style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.4 }}>Average student rating</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhySection;
