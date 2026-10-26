import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/motionPresets';

const subjectTabs = ['All', 'CSE', 'ECE', 'ME', 'Civil', 'MBA'];

const subjects = [
  { name: 'Data Structures', branch: 'CSE', bg: '#E8D2BF', units: 6, shape: 'nodes' },
  { name: 'Digital Electronics', branch: 'ECE', bg: '#C8DDB8', units: 5, shape: 'chip' },
  { name: 'Database Systems', branch: 'CSE', bg: '#D2D8D8', units: 6, shape: 'db' },
  { name: 'Thermodynamics', branch: 'ME', bg: '#E2D4ED', units: 5, shape: 'wave' },
  { name: 'Computer Networks', branch: 'CSE', bg: '#C8DDB8', units: 6, shape: 'network' },
  { name: 'Strength of Materials', branch: 'Civil', bg: '#E8D2BF', units: 5, shape: 'beam' },
  { name: 'Operating Systems', branch: 'CSE', bg: '#E2D4ED', units: 6, shape: 'process' },
  { name: 'Marketing Mgmt', branch: 'MBA', bg: '#D2D8D8', units: 5, shape: 'chart' },
];

const SubjectIllustration = ({ shape }) => {
  const commonStyle = { position: 'absolute', borderRadius: '50%' };

  switch (shape) {
    case 'nodes':
      return (
        <>
          <div style={{ ...commonStyle, width: 40, height: 40, background: 'rgba(26,26,46,0.1)', top: 20, left: 30 }} />
          <div style={{ ...commonStyle, width: 24, height: 24, background: 'rgba(125,198,122,0.3)', top: 50, right: 30 }} />
          <div style={{ ...commonStyle, width: 32, height: 32, background: 'rgba(245,158,11,0.2)', bottom: 30, left: '50%', transform: 'translateX(-50%)' }} />
          <div style={{ position: 'absolute', top: 40, left: 50, width: 60, height: 1, background: 'rgba(26,26,46,0.1)', transform: 'rotate(30deg)' }} />
          <div style={{ position: 'absolute', top: 60, left: 80, width: 40, height: 1, background: 'rgba(26,26,46,0.1)', transform: 'rotate(-20deg)' }} />
        </>
      );
    case 'chip':
      return (
        <>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 50, height: 50, border: '2px solid rgba(26,26,46,0.15)', borderRadius: 8 }} />
          {Array(4).fill(null).map((_, i) => (
            <div key={i} style={{ position: 'absolute', top: '50%', left: `${20 + i * 20}%`, width: 2, height: 20, background: 'rgba(125,198,122,0.3)', transform: 'translateY(-50%)' }} />
          ))}
        </>
      );
    case 'db':
      return (
        <>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ position: 'absolute', left: '50%', top: 20 + i * 36, transform: 'translateX(-50%)', width: 60, height: 28, borderRadius: '50%', border: '2px solid rgba(26,26,46,0.12)', background: `rgba(125,198,122,${0.05 + i * 0.05})` }} />
          ))}
        </>
      );
    case 'network':
      return (
        <>
          {[{x:20,y:30}, {x:70,y:20}, {x:45,y:70}, {x:80,y:65}].map((p,i) => (
            <div key={i} style={{ ...commonStyle, width: 16, height: 16, background: 'rgba(26,26,46,0.1)', left: `${p.x}%`, top: `${p.y}%` }} />
          ))}
          <div style={{ position: 'absolute', left: '28%', top: '35%', width: 80, height: 1, background: 'rgba(26,26,46,0.08)', transform: 'rotate(-15deg)' }} />
        </>
      );
    default:
      return (
        <>
          <div style={{ ...commonStyle, width: 50, height: 50, background: 'rgba(26,26,46,0.06)', top: '30%', left: '30%' }} />
          <div style={{ position: 'absolute', bottom: 20, right: 20, width: 30, height: 30, background: 'rgba(125,198,122,0.15)', borderRadius: 6 }} />
        </>
      );
  }
};

const SubjectsSection = () => {
  const [tab, setTab] = useState('All');
  const filtered = tab === 'All' ? subjects : subjects.filter(s => s.branch === tab);

  return (
    <section style={{ background: '#F2EDE4', padding: '96px 0', position: 'relative' }}>
      <div className="section-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <motion.div {...fadeUp}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(125,198,122,0.1)', border: '1px solid rgba(125,198,122,0.25)',
              borderRadius: 999, padding: '6px 16px',
              fontSize: 11, fontWeight: 600, color: '#7DC67A',
              textTransform: 'uppercase', letterSpacing: '0.1em'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7DC67A' }} />
              SUBJECTS
            </span>
          </motion.div>

          <motion.h2 {...fadeUp} style={{
            fontSize: 'clamp(40px, 4.5vw, 56px)', fontWeight: 800,
            color: '#1A1A2E', lineHeight: 1.1, letterSpacing: '-0.03em', marginTop: 20
          }}>
            Pick your battlefield<span style={{ color: '#F59E0B' }}>.</span>
          </motion.h2>
        </div>

        {/* Tabs */}
        <motion.div {...fadeUp} style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
          {subjectTabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 20px', borderRadius: 999, fontSize: 14, fontWeight: 600,
              border: tab === t ? '1px solid #1A1A2E' : '1px solid rgba(26,26,46,0.1)',
              background: tab === t ? '#1A1A2E' : 'transparent',
              color: tab === t ? 'white' : '#6B6B6B',
              cursor: 'pointer', transition: 'all 150ms', fontFamily: "'DM Sans', sans-serif"
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
                background: subj.bg, borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
                transition: 'box-shadow 250ms',
                marginTop: i % 4 === 1 ? -32 : 0
              }}
            >
              <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
                <SubjectIllustration shape={subj.shape} />
              </div>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 4 }}>{subj.name}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6B6B6B' }}>{subj.units} Units • {subj.branch}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
