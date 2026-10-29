import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      <div className="hatch" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.3 }} />

      <div className="section-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 32px', position: 'relative', zIndex: 10 }}>
        {/* 4-column layout */}
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1F1F1F', letterSpacing: '-0.03em', marginBottom: 16 }}>
              MEDHA<span style={{ color: '#9ADFEA', fontSize: 28 }}>.</span>
            </div>
            <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.6, marginBottom: 20 }}>
              The last-minute exam prep tool built by RTU students, for RTU students.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {['X', 'In', 'Ig', 'Yt'].map(icon => (
                <div key={icon} style={{
                  width: 36, height: 36, borderRadius: 8,
                  border: '1px solid #E5E5E5', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: '#1F1F1F',
                  cursor: 'pointer', transition: 'border-color 200ms'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#13B8D4'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E5E5'}
                >{icon}</div>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1F1F1F', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Product</div>
            {['Dashboard', 'AI Notes', 'PYQ Analysis', 'Exam Prep', 'Visualizations'].map(item => (
              <Link key={item} to="/dashboard" style={{ display: 'block', fontSize: 14, color: '#6B6B6B', textDecoration: 'none', marginBottom: 10, transition: 'color 150ms' }}
                onMouseEnter={e => e.currentTarget.style.color = '#13B8D4'}
                onMouseLeave={e => e.currentTarget.style.color = '#6B6B6B'}
              >{item}</Link>
            ))}
          </div>

          {/* Resources */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1F1F1F', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Resources</div>
            {['RTU Syllabus', 'Past Papers', 'Study Guides', 'Blog', 'Help Center'].map(item => (
              <Link key={item} to="/rtu-exams" style={{ display: 'block', fontSize: 14, color: '#6B6B6B', textDecoration: 'none', marginBottom: 10, transition: 'color 150ms' }}
                onMouseEnter={e => e.currentTarget.style.color = '#13B8D4'}
                onMouseLeave={e => e.currentTarget.style.color = '#6B6B6B'}
              >{item}</Link>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1F1F1F', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Stay Updated</div>
            <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.5, marginBottom: 12 }}>Get exam tips and updates straight to your inbox.</p>
            <div className="footer-newsletter-input" style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid #E5E5E5' }}>
              <input
                placeholder="your@email.com"
                style={{
                  flex: 1, padding: '10px 14px', border: 'none', outline: 'none',
                  fontSize: 14, fontFamily: "ui-sans-serif, system-ui, sans-serif", background: 'white', color: '#1F1F1F'
                }}
              />
              <button style={{
                padding: '10px 16px', background: '#13B8D4', color: 'white',
                border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                fontFamily: "ui-sans-serif, system-ui, sans-serif"
              }}>GO</button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom" style={{
          borderTop: '1px solid #E5E5E5', paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontSize: 13, color: '#9A9A9A' }}>© 2025 MEDHA. All rights reserved.</span>
          <span style={{ fontSize: 13, color: '#9A9A9A' }}>Made with ❤️ in Jaipur, Rajasthan</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
