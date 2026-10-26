import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerChild } from '../lib/motionPresets';

const features = [
  {
    bg: '#E8D2BF',
    height: 480,
    badge: '2 min',
    title: 'AI Note Intelligence',
    sub: 'Blurry photo in → clean cheatsheet out',
    category: 'AI Tools',
  },
  {
    bg: '#C8DDB8',
    height: 560,
    badge: 'RTU Focused',
    title: 'PYQ Archive',
    sub: 'See what repeats every year',
    category: 'PYQ Archive',
    popular: true,
  },
  {
    bg: '#D2D8D8',
    height: 480,
    badge: 'Instant',
    title: '24/7 AI Tutor',
    sub: 'No need to wake the topper',
    category: 'AI Tools',
  },
  {
    bg: '#E2D4ED',
    height: 480,
    badge: 'RTU Syllabus',
    title: 'Smart Exam Prep',
    sub: 'High-weightage units, first',
    category: 'Exam Prep',
  },
];

const tabs = ['All Features', 'AI Tools', 'PYQ Archive', 'Notes', 'Exam Prep'];

const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState('All Features');

  const filteredFeatures = activeTab === 'All Features'
    ? features
    : features.filter(f => f.category === activeTab);

  return (
    <section style={{ background: '#F2EDE4', position: 'relative', padding: '96px 0', overflow: 'hidden' }}>
      <div className="dot-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', right: '-2%', bottom: '-5%', fontSize: 300, fontWeight: 900, color: 'rgba(26,26,46,0.025)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>4</div>

      <div className="section-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 10 }}>
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
              FEATURES
            </span>
          </motion.div>

          <motion.h2 {...fadeUp} style={{
            fontSize: 'clamp(40px, 4.5vw, 56px)', fontWeight: 800,
            color: '#1A1A2E', lineHeight: 1.1, letterSpacing: '-0.03em', marginTop: 20
          }}>
            Enter the MEDHA Era<span style={{ color: '#F59E0B' }}>.</span>
          </motion.h2>
        </div>

        {/* Tabs */}
        <motion.div {...fadeUp} style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px', borderRadius: 999, fontSize: 14, fontWeight: 600,
                border: activeTab === tab ? '1px solid #1A1A2E' : '1px solid rgba(26,26,46,0.1)',
                background: activeTab === tab ? '#1A1A2E' : 'transparent',
                color: activeTab === tab ? 'white' : '#6B6B6B',
                cursor: 'pointer', transition: 'all 150ms',
                fontFamily: "'DM Sans', sans-serif"
              }}
            >{tab}</button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(filteredFeatures.length, 4)}, 1fr)`, gap: 24, alignItems: 'end' }}>
          {filteredFeatures.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
              whileHover={{ scale: 1.025, y: -4 }}
              className="card-shine"
              style={{
                background: feat.bg, borderRadius: 20, overflow: 'hidden',
                position: 'relative', height: feat.height, cursor: 'pointer'
              }}
            >
              {/* Popular ribbon */}
              {feat.popular && (
                <div style={{
                  position: 'absolute', top: 0, left: 0,
                  background: '#1A1A2E', color: 'white',
                  fontSize: 10, fontWeight: 700, padding: '6px 14px',
                  borderRadius: '0 0 10px 0', letterSpacing: '0.06em', zIndex: 5
                }}>MOST POPULAR</div>
              )}

              {/* Visual area */}
              <div style={{ height: feat.popular ? 360 : 280, position: 'relative', overflow: 'hidden', padding: feat.title === 'PYQ Archive' || feat.title === '24/7 AI Tutor' || feat.title === 'Smart Exam Prep' ? 16 : 0 }}>
                {feat.title === 'AI Note Intelligence' && <NoteIllustration bg={feat.bg} />}
                {feat.title === 'PYQ Archive' && <PYQIllustration />}
                {feat.title === '24/7 AI Tutor' && <TutorIllustration />}
                {feat.title === 'Smart Exam Prep' && <ExamPrepIllustration />}
              </div>

              {/* Content */}
              <div style={{ padding: 24 }}>
                <span style={{
                  display: 'inline-block', background: 'rgba(26,26,46,0.1)', borderRadius: 999,
                  padding: '4px 12px', fontSize: 11, fontWeight: 600, color: '#1A1A2E',
                  marginBottom: 12, letterSpacing: '0.04em'
                }}>{feat.badge}</span>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E', letterSpacing: '-0.02em', marginBottom: 6 }}>{feat.title}</div>
                <div style={{ fontSize: 14, color: '#6B6B6B' }}>{feat.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── CSS Illustrations ─────────────────────────── */

const NoteIllustration = ({ bg }) => (
  <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, #c9a88f 0%, ${bg} 100%)` }} />
    {/* Before note */}
    <div className="float" style={{ position: 'absolute', left: 16, top: 20, width: 110, height: 140, background: 'white', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transform: 'rotate(-5deg)', padding: 10, overflow: 'hidden' }}>
      {[0,1,2,3,4,5,6,7].map(i => <div key={i} style={{ height: 1, background: 'rgba(125,198,122,0.3)', marginBottom: 12 }} />)}
      {[70,90,50,80,60,40,75].map((w,i) => <div key={i} style={{ position: 'absolute', top: 14 + i*16, left: 10, width: `${w}%`, height: 7, background: 'rgba(100,100,120,0.25)', borderRadius: 3 }} />)}
      <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 8, fontWeight: 700, color: 'rgba(239,68,68,0.5)', transform: 'rotate(15deg)' }}>???</div>
    </div>
    {/* Arrow */}
    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 32, height: 32, borderRadius: '50%', background: '#7DC67A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'white', fontWeight: 700, boxShadow: '0 4px 12px rgba(125,198,122,0.4)', zIndex: 3 }}>→</div>
    {/* After note */}
    <div className="float-delay" style={{ position: 'absolute', right: 16, top: 30, width: 110, height: 140, background: '#1A1A2E', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.25)', transform: 'rotate(4deg)', padding: 10, overflow: 'hidden' }}>
      <div style={{ height: 8, background: '#7DC67A', borderRadius: 2, marginBottom: 6, width: '70%' }} />
      {[85,65,75,55,70,60].map((w,i) => <div key={i} style={{ height: 5, background: i%3===0 ? 'rgba(125,198,122,0.4)' : 'rgba(255,255,255,0.1)', borderRadius: 2, marginBottom: 5, width: `${w}%` }} />)}
      <div style={{ marginTop: 8, height: 6, background: 'rgba(245,158,11,0.4)', borderRadius: 2, width: '50%' }} />
    </div>
  </div>
);

const PYQIllustration = () => (
  <div style={{ background: 'rgba(26,26,46,0.06)', borderRadius: 12, padding: 16, height: '100%', paddingTop: 40 }}>
    <div style={{ fontSize: 10, fontWeight: 600, color: '#4A9E47', letterSpacing: '0.08em', marginBottom: 12 }}>RTU QUESTION FREQUENCY</div>
    {[
      { label: 'Joins', pct: 85, highlighted: true },
      { label: 'Normalize', pct: 70, highlighted: true },
      { label: 'Indexing', pct: 90, highlighted: true },
      { label: 'Triggers', pct: 40, highlighted: false },
      { label: 'Views', pct: 55, highlighted: false },
    ].map((bar, i) => (
      <div key={i} style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontWeight: 500, color: bar.highlighted ? '#1A1A2E' : 'rgba(26,26,46,0.4)', marginBottom: 3 }}>
          <span>{bar.label}</span><span>{bar.pct}%</span>
        </div>
        <div style={{ height: 8, background: 'rgba(26,26,46,0.08)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${bar.pct}%`, height: '100%', background: bar.highlighted ? 'linear-gradient(90deg, #7DC67A, #4A9E47)' : 'rgba(26,26,46,0.15)', borderRadius: 4 }} />
        </div>
      </div>
    ))}
    <div style={{ marginTop: 12, padding: '8px 10px', background: 'rgba(125,198,122,0.15)', borderRadius: 8, border: '1px solid rgba(125,198,122,0.3)' }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: '#4A9E47' }}>🔥 3 topics repeat every year</div>
    </div>
  </div>
);

const TutorIllustration = () => (
  <div style={{ background: '#0f1520', borderRadius: 12, height: '100%', padding: 12, overflow: 'hidden' }}>
    <div style={{ textAlign: 'right', fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>3:14 AM</div>
    <div style={{ background: 'rgba(125,198,122,0.2)', borderRadius: '10px 10px 3px 10px', padding: '6px 10px', marginBottom: 6, fontSize: 10, color: 'rgba(255,255,255,0.8)', maxWidth: '75%', marginLeft: 'auto' }}>explain pointers simply</div>
    <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '10px 10px 10px 3px', padding: '8px 10px', fontSize: 10, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, maxWidth: '85%' }}>
      <div style={{ fontWeight: 700, color: 'white', marginBottom: 4 }}>Think of it like a house address:</div>
      <div>📍 Variable = house</div>
      <div>📮 Pointer = address to house</div>
      <div>🔑 *ptr = what's inside</div>
    </div>
    <div style={{ display: 'flex', gap: 3, padding: '6px 10px' }}>
      {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#7DC67A', animation: `dot-breathe 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
    </div>
  </div>
);

const ExamPrepIllustration = () => (
  <div style={{ background: 'rgba(26,26,46,0.08)', borderRadius: 12, padding: 14, height: '100%' }}>
    <div style={{ fontSize: 9, fontWeight: 700, color: '#8B5CF6', letterSpacing: '0.08em', marginBottom: 10 }}>UNIT PRIORITY MAP</div>
    {[
      { unit: 'Unit 3', priority: 'HIGH', color: '#EF4444', w: '90%' },
      { unit: 'Unit 1', priority: 'HIGH', color: '#F59E0B', w: '80%' },
      { unit: 'Unit 5', priority: 'MEDIUM', color: '#7DC67A', w: '60%' },
      { unit: 'Unit 2', priority: 'MEDIUM', color: '#3B82F6', w: '50%' },
      { unit: 'Unit 6', priority: 'LOW', color: 'rgba(26,26,46,0.2)', w: '30%' },
    ].map((item, i) => (
      <div key={i} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ fontSize: 9, color: '#1A1A2E', width: 36, fontWeight: 500 }}>{item.unit}</div>
        <div style={{ flex: 1, height: 10, background: 'rgba(26,26,46,0.06)', borderRadius: 5 }}>
          <div style={{ width: item.w, height: '100%', background: item.color, borderRadius: 5 }} />
        </div>
        <div style={{ fontSize: 8, fontWeight: 700, color: item.priority === 'HIGH' ? '#EF4444' : item.priority === 'MEDIUM' ? '#F59E0B' : '#9A9A9A', width: 36 }}>{item.priority}</div>
      </div>
    ))}
    <div style={{ marginTop: 10, padding: '6px 10px', background: 'rgba(139,92,246,0.15)', borderRadius: 6, border: '1px solid rgba(139,92,246,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 9, color: '#8B5CF6', fontWeight: 600 }}>EXAM IN</span>
      <span style={{ fontSize: 13, fontWeight: 800, color: '#1A1A2E' }}>3d 14h</span>
    </div>
  </div>
);

export default FeaturesSection;
