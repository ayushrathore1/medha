import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/motionPresets';
import { lp, lpPill, lpDot } from '../lib/landingTheme';

const testimonials = [
  {
    quote: '"I had 3 days before my DBMS exam. MEDHA showed me exactly which topics repeat every year. Got 42/50 on the ones I focused on."',
    name: 'Rahul Sharma',
    role: 'CSE, 3rd Year',
    initials: 'RS',
  },
  {
    quote: '"The AI notes literally saved me. Uploaded a blurry photo of my register and got clean, formatted notes in 2 minutes."',
    name: 'Priya Meena',
    role: 'ECE, 4th Year',
    initials: 'PM',
  },
  {
    quote: '"I used to panic the night before exams. Now I just open MEDHA and follow the priority map. It\'s like having a topper friend 24/7."',
    name: 'Ankit Kumar',
    role: 'ME, 2nd Year',
    initials: 'AK',
  },
  {
    quote: '"The PYQ analysis is insane. 3 topics actually came exactly as predicted. Never studying without MEDHA again."',
    name: 'Deepika Patel',
    role: 'CSE, 3rd Year',
    initials: 'DP',
  },
  {
    quote: '"Started using it at 1 AM, covered 4 units by 7 AM. The AI breaks down everything so simply you actually understand."',
    name: 'Vikram Singh',
    role: 'Civil, 4th Year',
    initials: 'VS',
  },
];

const TestimonialsSection = () => {
  const constraintsRef = useRef(null);

  return (
    <section style={{ background: lp.ink, padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', userSelect: 'none', pointerEvents: 'none', zIndex: 0,
        fontSize: 400, fontWeight: 600, color: 'rgba(255,255,255,0.04)',
        lineHeight: 1, top: '-10%', left: '5%', fontFamily: lp.font
      }}>66</div>

      <div className="section-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <motion.div {...fadeUp}>
            <span style={{ ...lpPill, background: 'transparent', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>
              <span style={{ ...lpDot, background: 'white' }} />
              TESTIMONIALS
            </span>
          </motion.div>

          <motion.h2 {...fadeUp} style={{
            fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: lp.heading,
            color: 'white', lineHeight: 1.15, letterSpacing: '-0.03em', marginTop: 20,
            fontFamily: lp.font,
          }}>
            What students say.
          </motion.h2>
        </div>

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
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 0, padding: 32
                }}
              >
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', fontWeight: 400, lineHeight: 1.7, marginBottom: 24, fontFamily: lp.font }}>
                  {t.quote}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 600, color: lp.ink, fontFamily: lp.font
                  }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'white', fontFamily: lp.font }}>{t.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontFamily: lp.font }}>{t.role}</div>
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
