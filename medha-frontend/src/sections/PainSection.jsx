import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerChild } from '../lib/motionPresets';

const PainSection = () => {
  const cards = [
    {
      tag: 'THE SEMESTER SPEEDRUN',
      tagColor: '#F59E0B',
      title: 'You Did Everything But Study',
      body: ['Fests. FIFA. 4 lectures attended.', 'Somehow it\'s exam week. Respect.'],
    },
    {
      tag: 'THE PDF GRAVEYARD',
      tagColor: '#7DC67A',
      title: '38 Unread PDFs on WhatsApp',
      body: ['One\'s upside down. One\'s from 2019.', 'You don\'t know which unit matters.'],
    },
    {
      tag: 'THE NIGHT BEFORE PROTOCOL',
      tagColor: '#8B5CF6',
      title: '1 Night. 6 Units. No Plan.',
      body: ['You\'ve survived this before.', 'MEDHA makes sure you survive better.'],
    },
  ];

  return (
    <section style={{ background: '#1A1A2E', position: 'relative', overflow: 'hidden', padding: '96px 0' }}>

      {/* BG — Line grid */}
      <div className="line-grid" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      {/* BG — "2AM" watermark */}
      <div style={{
        position: 'absolute', userSelect: 'none', pointerEvents: 'none', zIndex: 0,
        fontSize: 280, fontWeight: 900, color: 'rgba(255,255,255,0.018)',
        letterSpacing: '-0.05em', lineHeight: 1, bottom: '-5%', right: '-3%'
      }}>2AM</div>

      {/* BG — Blobs */}
      <div className="blob blob-green" style={{ width: 500, height: 500, right: -100, top: -100, position: 'absolute' }} />
      <div className="blob blob-purple" style={{ width: 400, height: 400, left: -80, bottom: -80, position: 'absolute', opacity: 0.08 }} />

      {/* Content */}
      <div className="section-container" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <motion.div {...fadeUp}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(125,198,122,0.15)', border: '1px solid rgba(125,198,122,0.3)',
              borderRadius: 999, padding: '6px 16px', marginBottom: 20,
              fontSize: 11, fontWeight: 600, color: '#7DC67A',
              textTransform: 'uppercase', letterSpacing: '0.1em'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7DC67A' }} />
              RELATABLE?
            </span>
          </motion.div>

          <motion.h2 {...fadeUp} style={{
            fontSize: 'clamp(40px, 4.5vw, 56px)', fontWeight: 800,
            color: 'white', lineHeight: 1.1, letterSpacing: '-0.03em', marginTop: 20
          }}>
            Still open?<br />It's 2 AM<span style={{ color: '#F59E0B' }}>.</span>
          </motion.h2>

          <motion.p {...fadeUp} style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginTop: 12 }}>
            We built this at 2 AM before our own exam.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="pain-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: '40px 32px', position: 'relative', overflow: 'hidden',
                transition: 'background 200ms, border-color 200ms, box-shadow 200ms', cursor: 'default'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.borderColor = 'rgba(125,198,122,0.25)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* CSS Illustrations */}
              <div className="pain-card-illustration" style={{ height: 180, position: 'relative', marginBottom: 32 }}>
                {/* Top ambient glow */}
                <div style={{
                  position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
                  width: 200, height: 200, borderRadius: '50%',
                  background: i === 0
                    ? 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)'
                    : i === 1
                    ? 'radial-gradient(circle, rgba(37,211,102,0.2) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
                  filter: 'blur(30px)', zIndex: 0
                }} />

                {i === 0 && (
                  <>
                    {/* Phone with FIFA */}
                    <div className="float" style={{
                      position: 'absolute', left: '50%', top: 10, transform: 'translateX(-50%)',
                      width: 72, height: 130, background: '#0f1520', borderRadius: 16,
                      border: '3px solid rgba(255,255,255,0.12)', zIndex: 2,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                    }}>
                      <div style={{
                        position: 'absolute', inset: 4,
                        background: 'linear-gradient(180deg, #2d5a27 0%, #1a3d18 100%)', borderRadius: 12
                      }}>
                        <div style={{ position: 'absolute', top: '45%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.2)' }} />
                        <div style={{ position: 'absolute', left: '50%', top: '20%', bottom: '20%', width: 1, background: 'rgba(255,255,255,0.15)' }} />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 24, height: 24, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }} />
                      </div>
                      <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', width: 28, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.3)' }} />
                    </div>
                    {/* Book stack */}
                    {[
                      { w: 70, h: 10, color: '#8B5CF6', bottom: 0, left: 4, rotate: -3 },
                      { w: 65, h: 10, color: '#EF4444', bottom: 10, left: 8, rotate: -1 },
                      { w: 68, h: 10, color: '#F59E0B', bottom: 20, left: 6, rotate: 2 },
                    ].map((book, bi) => (
                      <div key={bi} style={{
                        position: 'absolute', bottom: book.bottom, left: book.left,
                        width: book.w, height: book.h, background: book.color, borderRadius: 2,
                        transform: `rotate(${book.rotate}deg)`, boxShadow: '0 2px 8px rgba(0,0,0,0.3)', zIndex: 1
                      }}>
                        <div style={{ position: 'absolute', left: 8, top: 2, bottom: 2, width: 1, background: 'rgba(255,255,255,0.2)' }} />
                      </div>
                    ))}
                    {/* Calendar */}
                    <div style={{
                      position: 'absolute', right: 0, top: 10, width: 56, height: 60,
                      background: 'rgba(255,255,255,0.08)', borderRadius: 8, zIndex: 1,
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <div style={{ height: 16, background: '#EF4444', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: 'white', letterSpacing: 1 }}>EXAM</div>
                      <div style={{ padding: 4, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                        {Array(12).fill(null).map((_, ci) => (
                          <div key={ci} style={{ height: 8, borderRadius: 2, background: ci === 11 ? '#EF4444' : 'rgba(255,255,255,0.08)' }} />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {i === 1 && (
                  <>
                    {/* Phone with WhatsApp */}
                    <div className="float-delay" style={{
                      position: 'absolute', left: '50%', top: 5, transform: 'translateX(-50%)',
                      width: 78, height: 138, background: '#0f1520', borderRadius: 16,
                      border: '3px solid rgba(255,255,255,0.12)', zIndex: 2,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                    }}>
                      <div style={{ position: 'absolute', inset: 4, background: '#111b21', borderRadius: 12, overflow: 'hidden' }}>
                        <div style={{ height: 8, background: '#202c33', display: 'flex', alignItems: 'center', padding: '0 4px', gap: 1 }}>
                          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#25d366' }} />
                          <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 1 }} />
                        </div>
                        <div style={{ position: 'absolute', top: 4, right: 4, background: '#EF4444', borderRadius: 999, fontSize: 6, fontWeight: 700, color: 'white', padding: '1px 4px' }}>38</div>
                        {[0, 1, 2, 3].map(pi => (
                          <div key={pi} style={{
                            margin: '3px 4px', height: 16, background: 'rgba(255,255,255,0.06)',
                            borderRadius: 4, display: 'flex', alignItems: 'center', padding: '0 4px', gap: 2,
                            transform: pi === 1 ? 'rotate(12deg)' : pi === 3 ? 'rotate(-5deg)' : 'none'
                          }}>
                            <div style={{ width: 8, height: 10, borderRadius: 1, background: ['#EF4444', '#F59E0B', '#7DC67A', '#8B5CF6'][pi], flexShrink: 0 }} />
                            <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.12)', borderRadius: 1 }} />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Scattered PDFs */}
                    {[
                      { w: 60, h: 70, left: 2, top: 30, rotate: -15, color: 'rgba(239,68,68,0.15)' },
                      { w: 55, h: 65, right: 2, top: 20, rotate: 10, color: 'rgba(245,158,11,0.12)' },
                      { w: 50, h: 60, left: 10, bottom: 0, rotate: 5, color: 'rgba(139,92,246,0.12)' },
                    ].map((p, pi) => (
                      <div key={pi} style={{
                        position: 'absolute', width: p.w, height: p.h,
                        left: p.left, right: p.right, top: p.top, bottom: p.bottom,
                        background: p.color, border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 4, transform: `rotate(${p.rotate}deg)`, zIndex: 0
                      }}>
                        {[20, 32, 44].map(top => (
                          <div key={top} style={{ position: 'absolute', top, left: 8, right: 8, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                        ))}
                      </div>
                    ))}
                  </>
                )}

                {i === 2 && (
                  <>
                    {/* Digital clock */}
                    <div className="float" style={{
                      position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)',
                      background: '#0d1117', border: '2px solid rgba(125,198,122,0.3)',
                      borderRadius: 12, padding: '8px 16px', zIndex: 2,
                      boxShadow: '0 0 30px rgba(125,198,122,0.15), 0 8px 32px rgba(0,0,0,0.4)'
                    }}>
                      <div style={{ fontSize: 32, fontWeight: 800, color: '#7DC67A', letterSpacing: '0.1em', fontFamily: 'monospace', textShadow: '0 0 20px rgba(125,198,122,0.5)' }}>2:47</div>
                      <div style={{ fontSize: 9, color: 'rgba(125,198,122,0.6)', letterSpacing: '0.15em', textAlign: 'center', marginTop: 2 }}>AM</div>
                    </div>
                    {/* Book spines */}
                    <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                      {[
                        { h: 55, color: '#7DC67A', label: 'U1' },
                        { h: 65, color: '#F59E0B', label: 'U2' },
                        { h: 48, color: '#8B5CF6', label: 'U3' },
                        { h: 70, color: '#EF4444', label: 'U4' },
                        { h: 52, color: '#3B82F6', label: 'U5' },
                        { h: 60, color: '#EC4899', label: 'U6' },
                      ].map((book, bi) => (
                        <div key={bi} style={{
                          width: 18, height: book.h, background: book.color,
                          borderRadius: '3px 3px 0 0', display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4,
                          boxShadow: 'inset -2px 0 0 rgba(0,0,0,0.2)'
                        }}>
                          <span style={{ fontSize: 6, fontWeight: 700, color: 'rgba(255,255,255,0.7)', writingMode: 'vertical-rl', letterSpacing: 1 }}>{book.label}</span>
                        </div>
                      ))}
                    </div>
                    {/* Energy drink */}
                    <div style={{
                      position: 'absolute', right: 12, bottom: 0, width: 18, height: 40,
                      background: 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)',
                      borderRadius: '3px 3px 5px 5px', zIndex: 3,
                      boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
                    }}>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: '3px 3px 0 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }} />
                      <div style={{ margin: '6px 3px 0', fontSize: 5, fontWeight: 800, color: 'rgba(255,255,255,0.8)', letterSpacing: 0.5 }}>BULL</div>
                    </div>
                  </>
                )}
              </div>

              {/* Card text */}
              <div style={{ fontSize: 22, fontWeight: 700, color: 'white', letterSpacing: '-0.02em', marginBottom: 12 }}>{card.title}</div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                {card.body.map((line, li) => <div key={li}>{line}</div>)}
              </div>
              <span style={{
                display: 'inline-block', marginTop: 24,
                fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
                color: card.tagColor, textTransform: 'uppercase'
              }}>{card.tag}</span>
            </motion.div>
          ))}
        </div>

        {/* Bottom copy */}
        <motion.p {...fadeUp} style={{ textAlign: 'center', marginTop: 48 }}>
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>Sound familiar? </span>
          <span style={{ fontSize: 18, color: 'white', fontWeight: 600 }}>You're in the right place.</span>
          <span style={{ color: '#7DC67A', marginLeft: 8 }}>→</span>
        </motion.p>
      </div>
    </section>
  );
};

export default PainSection;
