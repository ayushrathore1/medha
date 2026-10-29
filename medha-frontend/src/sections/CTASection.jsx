import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/motionPresets';
import { Link } from 'react-router-dom';
import { lp, lpPill, lpDot } from '../lib/landingTheme';

const CTASection = ({ totalStudents }) => {
  return (
    <section style={{ background: lp.ink, padding: '128px 0', position: 'relative', overflow: 'hidden' }}>
      <div className="section-container" style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <motion.div {...fadeUp}>
          <span style={{ ...lpPill, background: 'transparent', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>
            <span style={{ ...lpDot, background: 'white' }} />
            START TODAY
          </span>
        </motion.div>

        <motion.h2 {...fadeUp} style={{
          fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: lp.heading,
          color: 'white', lineHeight: 1.15, letterSpacing: '-0.03em', marginTop: 16,
          fontFamily: lp.font,
        }}>
          Exams don't wait.<br />Neither should you.
        </motion.h2>

        <motion.p {...fadeUp} style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', marginTop: 20, fontFamily: lp.font }}>
          Join <span style={{ color: 'white', fontWeight: 600 }}>{totalStudents}</span> students already using MEDHA
        </motion.p>

        <motion.div {...fadeUp} className="cta-buttons" style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40 }}>
          <Link to="/register" className="btn-shine" style={{
            background: 'white', color: lp.ink, padding: '10px 20px',
            borderRadius: 0, fontWeight: 600, fontSize: 13, border: 'none',
            cursor: 'pointer', textDecoration: 'none',
            transition: 'all 200ms', display: 'inline-block', fontFamily: lp.font
          }}>
            Start Learning Free →
          </Link>
          <Link to="/login" style={{
            border: '1px solid rgba(255,255,255,0.25)', color: 'white',
            padding: '10px 20px', borderRadius: 0, fontWeight: 600, fontSize: 13,
            cursor: 'pointer', textDecoration: 'none', transition: 'all 200ms',
            background: 'transparent', display: 'inline-block', fontFamily: lp.font
          }}>
            Login
          </Link>
        </motion.div>

        <motion.p {...fadeUp} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 24, fontFamily: lp.font }}>
          No credit card. No commitment. Just better exam prep.
        </motion.p>
      </div>
    </section>
  );
};

export default CTASection;
