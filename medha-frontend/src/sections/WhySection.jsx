import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/motionPresets';
import { lp, lpPill, lpDot } from '../lib/landingTheme';

const WhySection = ({ stats }) => {
  const timeline = [
    { icon: '📋', title: 'Pick Your Subject', copy: 'Choose from 250+ RTU topics across all branches.' },
    { icon: '🤖', title: 'AI Generates Your Plan', copy: 'Instant cheatsheets, PYQ analysis, and priority maps.' },
    { icon: '📝', title: 'Study Smarter', copy: 'Focus on what repeats. Skip what doesn\'t.' },
    { icon: '🎯', title: 'Walk Into the Exam Confident', copy: 'Cover 80% of likely questions in half the time.' },
  ];

  return (
    <section style={{ background: lp.bg, padding: '96px 0', position: 'relative', overflow: 'hidden' }}>

      <div className="why-layout section-container" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', gap: 64, position: 'relative', zIndex: 10 }}>
        {/* LEFT — Timeline */}
        <div style={{ flex: 1 }}>
          <motion.div {...fadeUp}>
            <span style={{ ...lpPill, marginBottom: 20 }}>
              <span style={lpDot} />
              WHY IT WORKS
            </span>
          </motion.div>

          <motion.h2 {...fadeUp} style={{
            fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: lp.heading,
            color: lp.ink, lineHeight: 1.15, letterSpacing: '-0.03em', marginTop: 20, marginBottom: 40,
            fontFamily: lp.font,
          }}>
            How MEDHA saves<br />your semester.
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
                  <div style={{ fontSize: 15, fontWeight: 600, color: lp.ink, marginBottom: 2, fontFamily: lp.font }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: lp.muted, lineHeight: 1.5, fontFamily: lp.font }}>{item.copy}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT — Stat Cards */}
        <motion.div {...fadeUp} style={{ flex: 1 }}>
          {/* Green stat card */}
          <div style={{
            background: lp.ink, borderRadius: 0, padding: 40,
            position: 'relative', overflow: 'hidden', marginBottom: 16, color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', position: 'relative', zIndex: 1 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 8, fontFamily: lp.font }}>LIVE</div>
                <div style={{ fontSize: 40, fontWeight: lp.heading, color: 'white', letterSpacing: '-0.03em', lineHeight: 1, fontFamily: lp.font }}>{stats.studentsOnline}</div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', fontFamily: lp.font }}>
                  STUDYING RIGHT NOW <span className="pulse-dot pulse-on-dark" style={{ display: 'inline-block' }} />
                </div>
              </div>
              <div style={{ width: 1, height: 60, background: 'rgba(255,255,255,0.2)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, fontWeight: lp.heading, color: 'white', letterSpacing: '-0.03em', lineHeight: 1, fontFamily: lp.font }}>250+</div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6, marginTop: 6, fontFamily: lp.font }}>TOPICS COVERED</div>
              </div>
            </div>
          </div>

          {/* Secondary cards */}
          <div className="why-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: lp.ink, borderRadius: 0, padding: 24 }}>
              <div style={{ fontSize: 32, fontWeight: lp.heading, color: 'white', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8, fontFamily: lp.font }}>10</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, fontFamily: lp.font }}>Years of RTU Past Papers</div>
            </div>
            <div style={{ background: lp.bg, borderRadius: 0, padding: 24, border: `1px solid ${lp.line}` }}>
              <div style={{ fontSize: 32, fontWeight: lp.heading, color: lp.ink, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8, fontFamily: lp.font }}>4.8★</div>
              <div style={{ fontSize: 13, color: lp.muted, lineHeight: 1.4, fontFamily: lp.font }}>Average student rating</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhySection;
