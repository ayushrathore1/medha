import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { fadeUp } from '../lib/motionPresets';
import { lp, lpPill, lpDot } from '../lib/landingTheme';

const CountUp = ({ target }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, v => Math.round(v));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const displayRef = useRef(null);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, { duration: 2, ease: 'easeOut' });
      return controls.stop;
    }
  }, [isInView, target, count]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', v => {
      if (displayRef.current) displayRef.current.textContent = v;
    });
    return unsubscribe;
  }, [rounded]);

  return <span ref={(el) => { ref.current = el; displayRef.current = el; }}>0</span>;
};

const IdentitySection = ({ stats }) => {
  return (
    <section style={{ background: 'white', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      <div className="identity-layout section-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', gap: 80, position: 'relative', zIndex: 10 }}>
        {/* LEFT */}
        <div style={{ flex: 1 }}>
          <motion.div {...fadeUp}>
            <span style={{ ...lpPill, marginBottom: 20 }}>
              <span style={lpDot} />
              WHAT IS MEDHA
            </span>
          </motion.div>

          <motion.h2 {...fadeUp} style={{
            fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: lp.heading,
            color: lp.ink, lineHeight: 1.15, letterSpacing: '-0.03em', marginTop: 20,
            fontFamily: lp.font,
          }}>
            Your exam prep<br />co-pilot.
          </motion.h2>

          <motion.p {...fadeUp} style={{
            fontSize: 15, color: lp.muted, lineHeight: 1.7, marginTop: 20, maxWidth: 500, fontFamily: lp.font,
          }}>
            MEDHA combines AI-powered notes, 10 years of RTU past papers, and smart exam strategies
            into one platform built specifically for RTU students.
          </motion.p>

          {/* Stats Row */}
          <motion.div {...fadeUp} className="identity-stats-row" style={{ display: 'flex', alignItems: 'center', gap: 32, marginTop: 40 }}>
            {[
              { value: stats.totalStudents, label: 'STUDENTS', color: lp.ink, live: true },
              { value: '250+', label: 'TOPICS COVERED', color: lp.ink, live: false },
              { value: '10', label: 'YEARS OF PYQs', color: lp.ink, live: false },
            ].map((stat, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="identity-stats-separator" style={{ width: 1, height: 60, background: '#E5E5E5' }} />}
                <div>
                  <div className="stat-number" style={{ fontSize: 40, fontWeight: lp.heading, color: stat.color, letterSpacing: '-0.03em', lineHeight: 1, fontFamily: lp.font }}>
                    {stat.live ? <CountUp target={stat.value} /> : stat.value}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: lp.faint, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, fontFamily: lp.font }}>
                    {stat.label}
                    {stat.live && <span className="pulse-dot" style={{ display: 'inline-block' }} />}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div {...fadeUp}>
            <button className="btn-shine" style={{
              marginTop: 40, background: lp.ink, color: 'white',
              padding: '10px 20px', borderRadius: 0, fontWeight: 600, fontSize: 13,
              border: 'none', cursor: 'pointer', transition: 'all 200ms',
              fontFamily: lp.font
            }}>
              Start Prepping Free →
            </button>
          </motion.div>
        </div>

        {/* RIGHT — AI Chat Mockup */}
        <motion.div {...fadeUp} style={{ flex: 1, position: 'relative' }}>
          <div className="float-slow" style={{
            background: lp.ink, borderRadius: 0, padding: 24,
            boxShadow: '0 24px 64px rgba(0,0,0,0.15)', transform: 'rotate(2deg)',
            border: '1px solid rgba(255,255,255,0.08)', transition: 'transform 400ms ease'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'rotate(0deg)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'rotate(2deg)'}
          >
            {/* Chat header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: lp.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'white', fontWeight: 600, fontFamily: lp.font }}>M</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: lp.font }}>MEDHA AI</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontFamily: lp.font }}>● Online</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>3:14 AM</div>
            </div>

            {/* User message */}
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '12px 12px 4px 12px', padding: '8px 12px', marginBottom: 8, fontSize: 13, color: 'rgba(255,255,255,0.8)', maxWidth: '80%', marginLeft: 'auto', fontFamily: lp.font }}>
              explain dijkstra's algorithm simply
            </div>

            {/* AI response */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px 12px 12px 4px', padding: 12, marginBottom: 8, fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, maxWidth: '90%' }}>
              <div style={{ fontWeight: 600, color: 'white', marginBottom: 6 }}>Dijkstra in 4 steps:</div>
              {['Start at source node, dist=0', 'All others = infinity', 'Visit nearest unvisited', 'Update shorter paths found'].map((step, si) => (
                <div key={si} style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'white', fontSize: 9, fontWeight: 700, color: lp.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{si + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* Typing indicator */}
            <div style={{ display: 'flex', gap: 3, padding: '8px 12px' }}>
              {[0, 1, 2].map(di => (
                <div key={di} style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', animation: `dot-breathe 1.2s ease-in-out ${di * 0.2}s infinite` }} />
              ))}
            </div>
          </div>

          {/* Floating achievement card */}
          <div className="float" style={{
            position: 'absolute', bottom: -16, left: -32,
            background: 'white', borderRadius: 14, padding: '14px 18px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '1px solid #E5E5E5', minWidth: 200
          }}>
            <div style={{ fontSize: 12, color: lp.ink, fontWeight: 600, marginBottom: 4, fontFamily: lp.font }}>✓ Concept cleared</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: lp.ink, fontFamily: lp.font }}>Unit 3: SQL Joins</div>
            <div style={{ fontSize: 12, color: lp.faint, marginTop: 2, fontFamily: lp.font }}>→ Next: Normalization</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IdentitySection;
