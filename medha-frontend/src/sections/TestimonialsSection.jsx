import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/motionPresets';

const testimonials = [
  {
    quote: '"I had 3 days before my DBMS exam. MEDHA showed me exactly which topics repeat every year. Got 42/50 on the ones I focused on."',
    name: 'Rahul Sharma',
    role: 'CSE, 3rd Year',
    initials: 'RS',
    gradient: ['#13B8D4', '#078DA8'],
  },
  {
    quote: '"The AI notes literally saved me. Uploaded a blurry photo of my register and got clean, formatted notes in 2 minutes."',
    name: 'Priya Meena',
    role: 'ECE, 4th Year',
    initials: 'PM',
    gradient: ['#9ADFEA', '#168FA8'],
  },
  {
    quote: '"I used to panic the night before exams. Now I just open MEDHA and follow the priority map. It\'s like having a topper friend 24/7."',
    name: 'Ankit Kumar',
    role: 'ME, 2nd Year',
    initials: 'AK',
    gradient: ['#77C9E0', '#197F9C'],
  },
  {
    quote: '"The PYQ analysis is insane. 3 topics actually came exactly as predicted. Never studying without MEDHA again."',
    name: 'Deepika Patel',
    role: 'CSE, 3rd Year',
    initials: 'DP',
    gradient: ['#66C8DC', '#168FA8'],
  },
  {
    quote: '"Started using it at 1 AM, covered 4 units by 7 AM. The AI breaks down everything so simply you actually understand."',
    name: 'Vikram Singh',
    role: 'Civil, 4th Year',
    initials: 'VS',
    gradient: ['#29B9DD', '#2563EB'],
  },
];

const TestimonialsSection = () => {
  const constraintsRef = useRef(null);

  return (
    <section style={{ background: '#1F1F1F', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      {/* BG */}
      <div className="line-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
      <div className="blob blob-green" style={{ width: 400, height: 400, left: -80, top: -80, position: 'absolute' }} />
      <div className="blob blob-purple" style={{ width: 350, height: 350, right: -60, bottom: -60, position: 'absolute', opacity: 0.08 }} />

      {/* Giant quotation mark */}
      <div style={{
        position: 'absolute', userSelect: 'none', pointerEvents: 'none', zIndex: 0,
        fontSize: 400, fontWeight: 900, color: 'rgba(255,255,255,0.015)',
        lineHeight: 1, top: '-10%', left: '5%', fontFamily: 'Georgia, serif'
      }}>66</div>

      <div className="section-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <motion.div {...fadeUp}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(19,184,212,0.15)', border: '1px solid rgba(19,184,212,0.3)',
              borderRadius: 999, padding: '6px 16px',
              fontSize: 11, fontWeight: 600, color: '#13B8D4',
              textTransform: 'uppercase', letterSpacing: '0.1em'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#13B8D4' }} />
              TESTIMONIALS
            </span>
          </motion.div>

          <motion.h2 {...fadeUp} style={{
            fontSize: 'clamp(40px, 4.5vw, 56px)', fontWeight: 800,
            color: 'white', lineHeight: 1.1, letterSpacing: '-0.03em', marginTop: 20
          }}>
            What students say<span style={{ color: '#9ADFEA' }}>.</span>
          </motion.h2>
        </div>

        {/* Carousel */}
        <div ref={constraintsRef} style={{ overflow: 'hidden', cursor: 'grab' }}>
          <motion.div
            className="testimonials-carousel"
            drag="x"
            dragConstraints={constraintsRef}
            style={{ display: 'flex', gap: 24, paddingBottom: 8 }}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{
                  minWidth: 320, maxWidth: 340, flexShrink: 0,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 20, padding: 32
                }}
              >
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', fontWeight: 500, lineHeight: 1.7, marginBottom: 24, fontStyle: 'italic' }}>
                  {t.quote}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[1]})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: 'white'
                  }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{t.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#13B8D4' }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
