import React from 'react';
import { Link } from 'react-router-dom';
import { lp } from '../lib/landingTheme';

const Footer = () => {
  return (
    <footer style={{ background: lp.bg, position: 'relative', overflow: 'hidden' }}>
      <div className="section-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 32px', position: 'relative', zIndex: 10 }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: lp.ink, letterSpacing: '-0.03em', marginBottom: 16, fontFamily: lp.font }}>
              Medha
            </div>
            <p style={{ fontSize: 14, color: lp.muted, lineHeight: 1.6, marginBottom: 20, fontFamily: lp.font }}>
              The last-minute exam prep tool built by RTU students, for RTU students.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {['X', 'In', 'Ig', 'Yt'].map(icon => (
                <div key={icon} style={{
                  width: 36, height: 36, borderRadius: 0,
                  border: `1px solid ${lp.line}`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600, color: lp.ink,
                  cursor: 'pointer', transition: 'border-color 200ms',
                  fontFamily: lp.font,
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = lp.ink}
                onMouseLeave={e => e.currentTarget.style.borderColor = lp.line}
                >{icon}</div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: lp.ink, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, fontFamily: lp.font }}>Product</div>
            {['Dashboard', 'AI Notes', 'PYQ Analysis', 'Exam Prep', 'Visualizations'].map(item => (
              <Link key={item} to="/dashboard" style={{ display: 'block', fontSize: 14, color: lp.muted, textDecoration: 'none', marginBottom: 10, transition: 'color 150ms', fontFamily: lp.font }}
                onMouseEnter={e => e.currentTarget.style.color = lp.ink}
                onMouseLeave={e => e.currentTarget.style.color = lp.muted}
              >{item}</Link>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: lp.ink, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, fontFamily: lp.font }}>Resources</div>
            {['RTU Syllabus', 'Past Papers', 'Study Guides', 'Blog', 'Help Center'].map(item => (
              <Link key={item} to="/rtu-exams" style={{ display: 'block', fontSize: 14, color: lp.muted, textDecoration: 'none', marginBottom: 10, transition: 'color 150ms', fontFamily: lp.font }}
                onMouseEnter={e => e.currentTarget.style.color = lp.ink}
                onMouseLeave={e => e.currentTarget.style.color = lp.muted}
              >{item}</Link>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: lp.ink, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, fontFamily: lp.font }}>Stay Updated</div>
            <p style={{ fontSize: 14, color: lp.muted, lineHeight: 1.5, marginBottom: 12, fontFamily: lp.font }}>Get exam tips and updates straight to your inbox.</p>
            <div className="footer-newsletter-input" style={{ display: 'flex', borderRadius: 0, overflow: 'hidden', border: `1px solid ${lp.line}` }}>
              <input
                placeholder="your@email.com"
                style={{
                  flex: 1, padding: '10px 14px', border: 'none', outline: 'none',
                  fontSize: 14, fontFamily: lp.font, background: 'white', color: lp.ink
                }}
              />
              <button style={{
                padding: '10px 16px', background: lp.ink, color: 'white',
                border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                fontFamily: lp.font
              }}>GO</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom" style={{
          borderTop: `1px solid ${lp.line}`, paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontSize: 13, color: lp.faint, fontFamily: lp.font }}>© 2025 MEDHA. All rights reserved.</span>
          <span style={{ fontSize: 13, color: lp.faint, fontFamily: lp.font }}>Made with care in Jaipur, Rajasthan</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
