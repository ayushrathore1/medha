import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/motionPresets';
import { lp, lpPill, lpDot } from '../lib/landingTheme';

const features = [
  {
    bg: lp.wash,
    height: 480,
    badge: '2 min',
    title: 'AI Note Intelligence',
    sub: 'Blurry photo in → clean cheatsheet out',
    category: 'AI Tools',
  },
  {
    bg: lp.wash,
    height: 560,
    badge: 'RTU Focused',
    title: 'PYQ Archive',
    sub: 'See what repeats every year',
    category: 'PYQ Archive',
    popular: true,
  },
  {
    bg: lp.wash,
    height: 480,
    badge: 'Instant',
    title: '24/7 AI Tutor',
    sub: 'No need to wake the topper',
    category: 'AI Tools',
  },
  {
    bg: lp.wash,
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
    <section style={{ background: lp.bg, position: 'relative', padding: '96px 0', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: '-2%', bottom: '-5%', fontSize: 300, fontWeight: 600, color: 'rgba(31,31,31,0.04)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none', fontFamily: lp.font }}>4</div>

      <div className="section-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <motion.div {...fadeUp}>
            <span style={lpPill}>
              <span style={lpDot} />
              FEATURES
            </span>
          </motion.div>

          <motion.h2 {...fadeUp} style={{
            fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: lp.heading,
            color: lp.ink, lineHeight: 1.15, letterSpacing: '-0.03em', marginTop: 20,
            fontFamily: lp.font,
          }}>
            Enter the MEDHA Era.
          </motion.h2>
        </div>

        {/* Tabs */}
        <motion.div {...fadeUp} style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 14px', borderRadius: 0, fontSize: 13, fontWeight: 600,
                border: activeTab === tab ? `1px solid ${lp.ink}` : `1px solid ${lp.line}`,
                background: activeTab === tab ? lp.ink : lp.bg,
                color: activeTab === tab ? 'white' : lp.ink,
                cursor: 'pointer', transition: 'all 150ms',
                fontFamily: lp.font
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
                background: feat.bg, borderRadius: 0, overflow: 'hidden',
                position: 'relative', height: feat.height, cursor: 'pointer',
                border: `1px solid ${lp.line}`,
              }}
            >
              {/* Popular ribbon */}
              {feat.popular && (
                <div style={{
                  position: 'absolute', top: 0, left: 0,
                  background: '#1F1F1F', color: 'white',
                  fontSize: 10, fontWeight: 700, padding: '6px 14px',
                  borderRadius: 0, letterSpacing: '0.06em', zIndex: 5
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
                  display: 'inline-block', background: 'rgba(31,31,31,0.1)', borderRadius: 999,
                  padding: '4px 12px', fontSize: 11, fontWeight: 600, color: '#1F1F1F',
                  marginBottom: 12, letterSpacing: '0.04em'
                }}>{feat.badge}</span>
                <div style={{ fontSize: 16, fontWeight: 600, color: lp.ink, letterSpacing: '-0.02em', marginBottom: 6, fontFamily: lp.font }}>{feat.title}</div>
                <div style={{ fontSize: 13, color: lp.muted, fontFamily: lp.font }}>{feat.sub}</div>
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
    <div style={{ position: 'absolute', inset: 0, background: bg }} />
    {/* Before note */}
    <div className="float" style={{ position: 'absolute', left: 16, top: 20, width: 110, height: 140, background: 'white', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transform: 'rotate(-5deg)', padding: 10, overflow: 'hidden' }}>
      {[0,1,2,3,4,5,6,7].map(i => <div key={i} style={{ height: 1, background: 'rgba(31,31,31,0.1)', marginBottom: 12 }} />)}
      {[70,90,50,80,60,40,75].map((w,i) => <div key={i} style={{ position: 'absolute', top: 14 + i*16, left: 10, width: `${w}%`, height: 7, background: 'rgba(31,31,31,0.18)', borderRadius: 0 }} />)}
      <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 8, fontWeight: 700, color: 'rgba(239,68,68,0.5)', transform: 'rotate(15deg)' }}>???</div>
    </div>
    {/* Arrow */}
    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 32, height: 32, borderRadius: '50%', background: lp.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'white', fontWeight: 600, zIndex: 3 }}>→</div>
    {/* After note */}
    <div className="float-delay" style={{ position: 'absolute', right: 16, top: 30, width: 110, height: 140, background: '#1F1F1F', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.25)', transform: 'rotate(4deg)', padding: 10, overflow: 'hidden' }}>
      <div style={{ height: 8, background: 'white', borderRadius: 0, marginBottom: 6, width: '70%' }} />
      {[85,65,75,55,70,60].map((w,i) => <div key={i} style={{ height: 5, background: i%3===0 ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.12)', borderRadius: 0, marginBottom: 5, width: `${w}%` }} />)}
      <div style={{ marginTop: 8, height: 6, background: 'rgba(255,255,255,0.25)', borderRadius: 0, width: '50%' }} />
    </div>
  </div>
);

const PYQIllustration = () => (
  <div style={{ background: 'rgba(31,31,31,0.06)', borderRadius: 12, padding: 16, height: '100%', paddingTop: 40 }}>
    <div style={{ fontSize: 10, fontWeight: 600, color: lp.muted, letterSpacing: '0.08em', marginBottom: 12, fontFamily: lp.font }}>RTU QUESTION FREQUENCY</div>
    {[
      { label: 'Joins', pct: 85, highlighted: true },
      { label: 'Normalize', pct: 70, highlighted: true },
      { label: 'Indexing', pct: 90, highlighted: true },
      { label: 'Triggers', pct: 40, highlighted: false },
      { label: 'Views', pct: 55, highlighted: false },
    ].map((bar, i) => (
      <div key={i} style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontWeight: 500, color: bar.highlighted ? '#1F1F1F' : 'rgba(31,31,31,0.4)', marginBottom: 3 }}>
          <span>{bar.label}</span><span>{bar.pct}%</span>
        </div>
        <div style={{ height: 8, background: 'rgba(31,31,31,0.08)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${bar.pct}%`, height: '100%', background: bar.highlighted ? lp.ink : 'rgba(31,31,31,0.15)', borderRadius: 0 }} />
        </div>
      </div>
    ))}
    <div style={{ marginTop: 12, padding: '8px 10px', background: lp.bg, borderRadius: 0, border: `1px solid ${lp.line}` }}>
      <div style={{ fontSize: 9, fontWeight: 600, color: lp.ink, fontFamily: lp.font }}>3 topics repeat every year</div>
    </div>
  </div>
);

const TutorIllustration = () => (
  <div style={{ background: lp.ink, borderRadius: 0, height: '100%', padding: 12, overflow: 'hidden' }}>
    <div style={{ textAlign: 'right', fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>3:14 AM</div>
    <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '10px 10px 3px 10px', padding: '6px 10px', marginBottom: 6, fontSize: 10, color: 'rgba(255,255,255,0.8)', maxWidth: '75%', marginLeft: 'auto' }}>explain pointers simply</div>
    <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '10px 10px 10px 3px', padding: '8px 10px', fontSize: 10, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, maxWidth: '85%' }}>
      <div style={{ fontWeight: 700, color: 'white', marginBottom: 4 }}>Think of it like a house address:</div>
      <div>📍 Variable = house</div>
      <div>📮 Pointer = address to house</div>
      <div>🔑 *ptr = what's inside</div>
    </div>
    <div style={{ display: 'flex', gap: 3, padding: '6px 10px' }}>
      {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'white', animation: `dot-breathe 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
    </div>
  </div>
);

const ExamPrepIllustration = () => (
  <div style={{ background: 'rgba(31,31,31,0.08)', borderRadius: 12, padding: 14, height: '100%' }}>
    <div style={{ fontSize: 9, fontWeight: 600, color: lp.muted, letterSpacing: '0.08em', marginBottom: 10, fontFamily: lp.font }}>UNIT PRIORITY MAP</div>
    {[
      { unit: 'Unit 3', priority: 'HIGH', color: lp.ink, w: '90%' },
      { unit: 'Unit 1', priority: 'HIGH', color: lp.ink, w: '80%' },
      { unit: 'Unit 5', priority: 'MEDIUM', color: lp.muted, w: '60%' },
      { unit: 'Unit 2', priority: 'MEDIUM', color: lp.muted, w: '50%' },
      { unit: 'Unit 6', priority: 'LOW', color: lp.line, w: '30%' },
    ].map((item, i) => (
      <div key={i} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ fontSize: 9, color: lp.ink, width: 36, fontWeight: 500 }}>{item.unit}</div>
        <div style={{ flex: 1, height: 10, background: 'rgba(31,31,31,0.06)', borderRadius: 0 }}>
          <div style={{ width: item.w, height: '100%', background: item.color, borderRadius: 0 }} />
        </div>
        <div style={{ fontSize: 8, fontWeight: 600, color: lp.muted, width: 36 }}>{item.priority}</div>
      </div>
    ))}
    <div style={{ marginTop: 10, padding: '6px 10px', background: lp.bg, borderRadius: 0, border: `1px solid ${lp.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 9, color: lp.muted, fontWeight: 600, fontFamily: lp.font }}>EXAM IN</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: lp.ink, fontFamily: lp.font }}>3d 14h</span>
    </div>
  </div>
);

export default FeaturesSection;
