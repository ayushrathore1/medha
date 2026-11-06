import React, { useContext, useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { AuthContext } from "../AuthContext";
import BrandMark, { CAMPUSKART_URL } from "../components/Common/BrandMark";
import { isTeamUser } from "../config/appMode";
import "../styles/ComingSoon.css";

const ease = [0.22, 1, 0.36, 1];
const BANDS = ["#1BA34A", "#C6D93B", "#FF8A1A", "#E30613", "#3F6B52"];

function RibbonField({ enabled }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return undefined;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time) => {
      const t = time * 0.001;
      ctx.clearRect(0, 0, width, height);

      for (let b = 0; b < BANDS.length; b += 1) {
        const yBase = height * (0.18 + b * 0.14);
        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const y =
            yBase +
            Math.sin(x * 0.008 + t * (0.8 + b * 0.15) + b) * (18 + b * 6) +
            Math.cos(x * 0.003 - t * 0.5 + b) * 10;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = BANDS[b];
        ctx.globalAlpha = 0.22 + (b % 2) * 0.08;
        ctx.lineWidth = 2.4 + (b % 3);
        ctx.stroke();
      }

      for (let i = 0; i < 28; i += 1) {
        const x = ((i * 137) % width) + Math.sin(t + i) * 20;
        const y = ((i * 89) % height) + Math.cos(t * 0.7 + i) * 24;
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = BANDS[i % BANDS.length];
        ctx.beginPath();
        ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
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

export default function MemberComingSoon() {
  const reduceMotion = useReducedMotion();
  const { user, logout } = useContext(AuthContext);
  const first = String(user?.name || "friend").split(" ")[0];

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (isTeamUser(user)) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="coming-soon coming-soon--member" aria-labelledby="member-soon-title">
      <div className="coming-soon-stage" aria-hidden="true">
        <div className="coming-soon-wash coming-soon-wash--member" />
        <RibbonField enabled={!reduceMotion} />
        <div className="coming-soon-chips" aria-hidden="true">
          <span className="coming-soon-chip coming-soon-chip--notes">Notes</span>
          <span className="coming-soon-chip coming-soon-chip--pyq">PYQ</span>
          <span className="coming-soon-chip coming-soon-chip--sol">Solutions</span>
        </div>
      </div>

      <header className="coming-soon-header">
        <BrandMark variant="coming-soon" medhaTo="/inside" />
        <button type="button" className="coming-soon-signin" onClick={logout}>
          Sign out
        </button>
      </header>

      <section className="coming-soon-hero">
        <motion.p
          className="coming-soon-kicker coming-soon-kicker--member"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          Welcome in, {first}
        </motion.p>
        <motion.h1
          id="member-soon-title"
          className="coming-soon-title coming-soon-title--member"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease, delay: 0.06 }}
        >
          Your seat is saved
        </motion.h1>
        <motion.p
          className="coming-soon-lead"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease, delay: 0.14 }}
        >
          Diwali build in progress. We will open Medha here first.
        </motion.p>
      </section>

      <footer className="coming-soon-footer">
        <span className="coming-soon-footer-rule" aria-hidden="true" />
        <p className="coming-soon-footer-copy">
          © {new Date().getFullYear()} CampusKart. All rights reserved.
        </p>
        <p className="coming-soon-footer-site">
          <Link to="/forgot-password">Forgot password</Link>
          {" · "}
          <a href={CAMPUSKART_URL} target="_blank" rel="noreferrer">
            www.shopcampuskart.in
          </a>
        </p>
      </footer>
    </main>
  );
}
