import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/motionPresets';
import { lp, lpPill, lpDot } from '../lib/landingTheme';

const subjectTabs = ['All', 'CSE', 'ECE', 'ME', 'Civil', 'MBA'];

const subjects = [
  { name: 'Data Structures', branch: 'CSE', bg: lp.wash, units: 6, shape: 'nodes' },
  { name: 'Digital Electronics', branch: 'ECE', bg: lp.wash, units: 5, shape: 'chip' },
  { name: 'Database Systems', branch: 'CSE', bg: lp.wash, units: 6, shape: 'db' },
  { name: 'Thermodynamics', branch: 'ME', bg: lp.wash, units: 5, shape: 'wave' },
  { name: 'Computer Networks', branch: 'CSE', bg: lp.wash, units: 6, shape: 'network' },
  { name: 'Strength of Materials', branch: 'Civil', bg: lp.wash, units: 5, shape: 'beam' },
  { name: 'Operating Systems', branch: 'CSE', bg: lp.wash, units: 6, shape: 'process' },
  { name: 'Marketing Mgmt', branch: 'MBA', bg: lp.wash, units: 5, shape: 'chart' },
];

const SubjectIllustration = ({ shape }) => {
  const commonStyle = { position: 'absolute', borderRadius: '50%' };

  switch (shape) {
    case 'nodes':
      return (
        <>
          <div style={{ ...commonStyle, width: 40, height: 40, background: 'rgba(31,31,31,0.1)', top: 20, left: 30 }} />
          <div style={{ ...commonStyle, width: 24, height: 24, background: 'rgba(31,31,31,0.2)', top: 50, right: 30 }} />
          <div style={{ ...commonStyle, width: 32, height: 32, background: 'rgba(31,31,31,0.12)', bottom: 30, left: '50%', transform: 'translateX(-50%)' }} />
          <div style={{ position: 'absolute', top: 40, left: 50, width: 60, height: 1, background: 'rgba(31,31,31,0.1)', transform: 'rotate(30deg)' }} />
          <div style={{ position: 'absolute', top: 60, left: 80, width: 40, height: 1, background: 'rgba(31,31,31,0.1)', transform: 'rotate(-20deg)' }} />
        </>
      );
    case 'chip':
      return (
        <>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 50, height: 50, border: '2px solid rgba(31,31,31,0.15)', borderRadius: 8 }} />
          {Array(4).fill(null).map((_, i) => (
            <div key={i} style={{ position: 'absolute', top: '50%', left: `${20 + i * 20}%`, width: 2, height: 20, background: 'rgba(31,31,31,0.2)', transform: 'translateY(-50%)' }} />
          ))}
        </>
      );
    case 'db':
      return (
        <>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ position: 'absolute', left: '50%', top: 20 + i * 36, transform: 'translateX(-50%)', width: 60, height: 28, borderRadius: '50%', border: '2px solid rgba(31,31,31,0.12)', background: `rgba(31,31,31,${0.04 + i * 0.04})` }} />
          ))}
        </>
      );
    case 'network':
      return (
        <>
          {[{x:20,y:30}, {x:70,y:20}, {x:45,y:70}, {x:80,y:65}].map((p,i) => (
            <div key={i} style={{ ...commonStyle, width: 16, height: 16, background: 'rgba(31,31,31,0.1)', left: `${p.x}%`, top: `${p.y}%` }} />
          ))}
          <div style={{ position: 'absolute', left: '28%', top: '35%', width: 80, height: 1, background: 'rgba(31,31,31,0.08)', transform: 'rotate(-15deg)' }} />
        </>
      );
    default:
      return (
        <>
          <div style={{ ...commonStyle, width: 50, height: 50, background: 'rgba(31,31,31,0.06)', top: '30%', left: '30%' }} />
          <div style={{ position: 'absolute', bottom: 20, right: 20, width: 30, height: 30, background: 'rgba(31,31,31,0.1)', borderRadius: 0 }} />
        </>
      );
  }
};

const SubjectsSection = () => {
  const [tab, setTab] = useState('All');
  const filtered = tab === 'All' ? subjects : subjects.filter(s => s.branch === tab);

  return (
    <section style={{ background: '#FFFFFF', padding: '96px 0', position: 'relative' }}>
      <div className="section-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <motion.div {...fadeUp}>
            <span style={lpPill}>
              <span style={lpDot} />
              SUBJECTS
            </span>
          </motion.div>

          <motion.h2 {...fadeUp} style={{
            fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: lp.heading,
            color: lp.ink, lineHeight: 1.15, letterSpacing: '-0.03em', marginTop: 20,
            fontFamily: lp.font,
          }}>
            Pick your battlefield.
          </motion.h2>
        </div>

        {/* Tabs */}
        <motion.div {...fadeUp} style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
          {subjectTabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 14px', borderRadius: 0, fontSize: 13, fontWeight: 600,
              border: tab === t ? `1px solid ${lp.ink}` : `1px solid ${lp.line}`,
              background: tab === t ? lp.ink : lp.bg,
              color: tab === t ? 'white' : lp.ink,
              cursor: 'pointer', transition: 'all 150ms', fontFamily: lp.font
            }}>{t}</button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="subjects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, alignItems: 'start' }}>
          {filtered.map((subj, i) => (
            <motion.div
              key={subj.name}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              whileHover={{ scale: 1.02, y: -4 }}
              style={{
                background: subj.bg, borderRadius: 0, overflow: 'hidden', cursor: 'pointer',
                transition: 'box-shadow 250ms',
                border: `1px solid ${lp.line}`,
                marginTop: i % 4 === 1 ? -32 : 0
              }}
            >
              <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
                <SubjectIllustration shape={subj.shape} />
              </div>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: lp.ink, marginBottom: 4, fontFamily: lp.font }}>{subj.name}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: lp.muted, fontFamily: lp.font }}>{subj.units} Units • {subj.branch}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
