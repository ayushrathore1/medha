import React from "react";
import { motion } from "framer-motion";
import { NotebookPen } from "lucide-react";
import { fadeUp } from "../lib/motionPresets";
import { Link } from "react-router-dom";
import SectionMark from "./SectionMark";

const CtaDrawings = () => (
  <svg className="wama-cta-drawings" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g stroke="#1BA34A" strokeWidth="1.7">
        <ellipse cx="118" cy="92" rx="54" ry="20" opacity="0.35" />
        <ellipse cx="118" cy="92" rx="20" ry="50" transform="rotate(24 118 92)" opacity="0.28" />
        <circle cx="118" cy="92" r="4" fill="#1BA34A" stroke="none" opacity="0.55" />
        <path d="M64 58c18-10 38-8 52 6" opacity="0.4" />
      </g>
      <g stroke="#FF8A1A" strokeWidth="1.7">
        <rect x="980" y="46" width="86" height="108" rx="8" opacity="0.55" />
        <path d="M996 72h54M996 90h40M996 108h48" opacity="0.7" />
        <path d="M1078 78l28-10v92l-28 10z" opacity="0.45" />
        <path d="M1048 168c16 10 28 8 40-4" opacity="0.35" />
      </g>
      <g stroke="#2563EB" strokeWidth="1.7">
        <rect x="72" y="268" width="38" height="86" rx="5" opacity="0.4" />
        <rect x="118" y="238" width="38" height="116" rx="5" opacity="0.5" />
        <rect x="164" y="292" width="38" height="62" rx="5" opacity="0.4" />
        <path d="M58 246c12-18 30-16 42 2" opacity="0.35" />
      </g>
      <g stroke="#C6D93B" strokeWidth="1.8">
        <circle cx="1048" cy="318" r="36" opacity="0.4" />
        <circle cx="1048" cy="318" r="18" strokeDasharray="4 6" opacity="0.45" />
        <path d="M1048 286v18M1048 332v18M1016 318h18M1062 318h18" opacity="0.45" />
      </g>
      <g stroke="#7C3AED" strokeWidth="1.7">
        <path d="M268 86c28-18 46 8 70-6 22-12 38 10 58 2" opacity="0.4" />
        <circle cx="268" cy="86" r="4" />
        <circle cx="338" cy="78" r="3.4" />
        <circle cx="396" cy="82" r="4" />
      </g>
      <g stroke="#C2410C" strokeWidth="1.7">
        <rect x="786" y="278" width="70" height="82" rx="7" opacity="0.45" />
        <path d="M800 300h42M800 316h30M800 332h36" opacity="0.6" />
        <path d="M868 292l22 8-22 8" opacity="0.4" />
      </g>
      <g stroke="#0D9488" strokeWidth="1.6">
        <rect x="430" y="318" width="52" height="52" rx="8" opacity="0.35" />
        <path d="M444 338h24M456 326v24" opacity="0.5" />
        <circle cx="548" cy="344" r="16" opacity="0.35" />
        <path d="M548 332v12l8 6" opacity="0.5" />
      </g>
      <g stroke="#E8B86D" strokeWidth="1.5">
        <path d="M620 54c10 16 8 28-6 40" opacity="0.4" />
        <circle cx="628" cy="48" r="3" fill="#E8B86D" stroke="none" opacity="0.55" />
        <circle cx="190" cy="168" r="2.4" fill="#1BA34A" stroke="none" opacity="0.45" />
        <circle cx="902" cy="214" r="2.6" fill="#2563EB" stroke="none" opacity="0.4" />
        <circle cx="740" cy="96" r="2.2" fill="#7C3AED" stroke="none" opacity="0.4" />
      </g>
    </g>
  </svg>
);

const CTASection = ({ totalStudents }) => {
  return (
    <section className="wama-section wama-cta">
      <div className="wama-section-inner wama-cta-inner">
        <motion.div {...fadeUp} className="wama-color-card wama-cta-card">
          <div className="wama-cta-backdrop" aria-hidden="true">
            <CtaDrawings />
          </div>
          <div className="wama-cta-copy">
            <SectionMark icon={NotebookPen}>
              <path d="M24 28h18M24 40h28M98 64h18" opacity="0.4" />
            </SectionMark>
            <h2>
              Start the next study session
              <span>with a plan.</span>
            </h2>
            <p>Join {totalStudents} students already using Medha.</p>
            <div className="wama-cta-actions">
              <Link
                to="/register"
                className="wama-pill"
                onMouseEnter={() => import("../pages/Register").catch(() => {})}
                onFocus={() => import("../pages/Register").catch(() => {})}
              >
                Start learning free
              </Link>
              <Link
                to="/login"
                className="wama-text-link"
                onMouseEnter={() => import("../pages/Login").catch(() => {})}
                onFocus={() => import("../pages/Login").catch(() => {})}
              >
                Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
