import React, { useContext, useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { AuthContext } from "../AuthContext";
import BrandMark, { CAMPUSKART_URL } from "../components/Common/BrandMark";
import "../styles/ComingSoon.css";

const ease = [0.22, 1, 0.36, 1];
const PALETTE = [
  [27, 163, 74],
  [198, 217, 59],
  [255, 138, 26],
  [227, 6, 19],
  [63, 107, 82],
];

function createParticles(count, width, height) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.55,
    vy: (Math.random() - 0.5) * 0.55,
    r: 1 + Math.random() * 2.8,
    phase: Math.random() * Math.PI * 2,
    tone: Math.floor(Math.random() * PALETTE.length),
  }));
}

function shapePoint(kind, index, total, width, height, t) {
  const a = (index / total) * Math.PI * 2 + t * 0.18;
  const cx = width * (0.2 + 0.6 * ((Math.sin(t * 0.2 + index) + 1) / 2));
  const cy = height * (0.2 + 0.6 * ((Math.cos(t * 0.17 + index * 0.3) + 1) / 2));
  const radius = Math.min(width, height) * (0.18 + 0.2 * Math.sin(t * 0.3 + kind.length));

  if (kind === "wave") {
    const x = (index / Math.max(total - 1, 1)) * width;
    return {
      x,
      y: height * 0.5 + Math.sin(a * 2 + t) * height * 0.22 + Math.cos(t + index) * 24,
    };
  }
  if (kind === "scatter") {
    return {
      x: ((index * 97) % width) + Math.sin(t + index) * 40,
      y: ((index * 53) % height) + Math.cos(t * 0.8 + index) * 36,
    };
  }
  if (kind === "spiral") {
    const spiral = radius * (0.35 + (index / total) * 1.2);
    return {
      x: width * 0.5 + Math.cos(a * 1.6) * spiral,
      y: height * 0.5 + Math.sin(a * 1.6) * spiral * 0.72,
    };
  }
  return {
    x: cx + Math.cos(a) * radius,
    y: cy + Math.sin(a) * radius * 0.85,
  };
}

function FluidField({ enabled }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return undefined;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    let raf = 0;
    let width = 0;
    let height = 0;
    let particles = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const shapes = ["bloom", "wave", "spiral", "scatter"];
    let shapeIndex = 0;
    let morph = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(180, Math.max(90, width / 9)));
      particles = createParticles(count, width, height);
    };

    const draw = (time) => {
      const t = time * 0.001;
      morph += 0.0016;
      if (morph >= 1) {
        morph = 0;
        shapeIndex = (shapeIndex + 1) % shapes.length;
      }

      const current = shapes[shapeIndex];
      const next = shapes[(shapeIndex + 1) % shapes.length];
      const blend = morph * morph * (3 - 2 * morph);

      ctx.clearRect(0, 0, width, height);

      const attractorCount = Math.min(70, particles.length);
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.phase += 0.014;
        p.x += p.vx + Math.sin(p.phase + i) * 0.12;
        p.y += p.vy + Math.cos(p.phase * 0.9 + i) * 0.12;

        if (i < attractorCount) {
          const a = shapePoint(current, i, attractorCount, width, height, t);
          const b = shapePoint(next, i, attractorCount, width, height, t + 1.5);
          p.x += (a.x + (b.x - a.x) * blend - p.x) * 0.028;
          p.y += (a.y + (b.y - a.y) * blend - p.y) * 0.028;
        }

        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;
        if (p.y < -30) p.y = height + 30;
        if (p.y > height + 30) p.y = -30;
      }

      const linkBudget = Math.min(particles.length, width < 720 ? 56 : 84);
      for (let i = 0; i < linkBudget; i += 1) {
        const a = particles[i];
        for (let j = i + 1; j < linkBudget; j += 1) {
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > 96) continue;
          const alpha = (1 - dist / 96) * 0.18;
          const [r, g, bl] = PALETTE[a.tone % PALETTE.length];
          ctx.strokeStyle = `rgba(${r}, ${g}, ${bl}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        const pulse = 0.55 + Math.sin(t * 1.8 + p.phase) * 0.35;
        const [r, g, b] = PALETTE[p.tone % PALETTE.length];
        const alpha = 0.3 + pulse * 0.45;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.16})`;
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.arc(p.x, p.y, p.r * (0.85 + pulse * 0.28), 0, Math.PI * 2);
        ctx.fill();
      }

      raf = window.requestAnimationFrame(draw);
    };

    resize();
    raf = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [enabled]);

  return <canvas ref={canvasRef} className="coming-soon-fluid" aria-hidden="true" />;
}

export default function ComingSoon() {
  const reduceMotion = useReducedMotion();
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/inside" replace />;
  }

  return (
    <main className="coming-soon coming-soon--public" aria-labelledby="coming-soon-title">
      <div className="coming-soon-stage" aria-hidden="true">
        <div className="coming-soon-wash coming-soon-wash--public" />
        <FluidField enabled={!reduceMotion} />
      </div>

      <header className="coming-soon-header">
        <BrandMark variant="coming-soon" />
        <Link to="/login" className="coming-soon-signin">
          Sign in
        </Link>
      </header>

      <section className="coming-soon-hero">
        <motion.p
          className="coming-soon-kicker"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          Medha got a new home
        </motion.p>
        <motion.h1
          id="coming-soon-title"
          className="coming-soon-title"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease, delay: 0.06 }}
        >
          Coming soon
        </motion.h1>
        <motion.p
          className="coming-soon-lead"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease, delay: 0.14 }}
        >
          Diwali work is going on.
        </motion.p>
        <motion.div
          className="coming-soon-actions"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease, delay: 0.22 }}
        >
          <Link to="/register" className="coming-soon-cta">
            Sign up on Medha
          </Link>
        </motion.div>
      </section>

      <footer className="coming-soon-footer">
        <span className="coming-soon-footer-rule" aria-hidden="true" />
        <p className="coming-soon-footer-copy">
          © {new Date().getFullYear()} CampusKart. All rights reserved.
        </p>
        <p className="coming-soon-footer-site">
          <a href={CAMPUSKART_URL} target="_blank" rel="noreferrer">
            www.shopcampuskart.in
          </a>
        </p>
      </footer>
    </main>
  );
}
