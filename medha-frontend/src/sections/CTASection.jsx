import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/motionPresets';
import { Link } from 'react-router-dom';

const CTASection = ({ totalStudents }) => {
  return (
    <section style={{ background: '#2D2D3F', padding: '128px 0', position: 'relative', overflow: 'hidden' }}>
      {/* BG */}
      <div className="blob blob-green" style={{ width: 500, height: 500, left: -120, top: '50%', transform: 'translateY(-50%)', opacity: 0.12, position: 'absolute' }} />
      <div className="blob blob-amber" style={{ width: 420, height: 420, right: -80, top: '50%', transform: 'translateY(-50%)', opacity: 0.10, position: 'absolute' }} />
      <div className="grain" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      <div className="line-grid" style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.5 }} />

      <div className="section-container" style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <motion.div {...fadeUp}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(125,198,122,0.15)', border: '1px solid rgba(125,198,122,0.3)',
            borderRadius: 999, padding: '6px 16px', marginBottom: 24,
            fontSize: 11, fontWeight: 600, color: '#7DC67A',
            textTransform: 'uppercase', letterSpacing: '0.1em'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7DC67A' }} />
            START TODAY
          </span>
        </motion.div>

        <motion.h2 {...fadeUp} style={{
          fontSize: 'clamp(48px, 5.5vw, 72px)', fontWeight: 800,
          color: 'white', lineHeight: 1.1, letterSpacing: '-0.04em', marginTop: 16
        }}>
          Exams don't wait.<br />Neither should you<span style={{ color: '#F59E0B' }}>.</span>
        </motion.h2>

        <motion.p {...fadeUp} style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', marginTop: 20 }}>
          Join <span style={{ color: '#F59E0B', fontWeight: 700 }}>{totalStudents}</span> students already using MEDHA
        </motion.p>

        <motion.div {...fadeUp} className="cta-buttons" style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 40 }}>
          <Link to="/register" className="btn-shine" style={{
            background: '#7DC67A', color: '#1A1A2E', padding: '16px 32px',
            borderRadius: 12, fontWeight: 700, fontSize: 16, border: 'none',
            cursor: 'pointer', textDecoration: 'none', boxShadow: '0 8px 32px rgba(125,198,122,0.3)',
            transition: 'all 200ms', display: 'inline-block', fontFamily: "'DM Sans', sans-serif"
          }}>
            Start Learning Free →
          </Link>
          <Link to="/login" style={{
            border: '1px solid rgba(255,255,255,0.3)', color: 'white',
            padding: '16px 32px', borderRadius: 12, fontWeight: 600, fontSize: 16,
            cursor: 'pointer', textDecoration: 'none', transition: 'all 200ms',
            background: 'transparent', display: 'inline-block', fontFamily: "'DM Sans', sans-serif"
          }}>
            Login
          </Link>
        </motion.div>

        <motion.p {...fadeUp} style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 24 }}>
          No credit card. No commitment. Just better exam prep.
        </motion.p>
      </div>
    </section>
  );
};

export default CTASection;
