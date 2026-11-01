import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { Route } from "lucide-react";
import { fadeUp } from "../lib/motionPresets";
import SectionMark from "./SectionMark";

const CountUp = ({ target }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (value) => Math.round(value));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const displayRef = useRef(null);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, target, count]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (value) => {
      if (displayRef.current) displayRef.current.textContent = value;
    });
    return unsubscribe;
  }, [rounded]);

  return (
    <span
      ref={(el) => {
        ref.current = el;
        displayRef.current = el;
      }}
    >
      0
    </span>
  );
};

const IdentitySection = ({ stats }) => {
  return (
    <section className="wama-section">
      <div className="wama-section-inner wama-split">
        <div>
          <motion.p {...fadeUp} className="wama-kicker">
            What is Medha
          </motion.p>
          <motion.h2 {...fadeUp}>
            Your exam prep
            <br />
            co-pilot.
          </motion.h2>
          <motion.p {...fadeUp} className="wama-lead">
            MEDHA combines structured notes, 10 years of RTU past papers, and smart exam strategies into one platform built specifically for RTU students.
          </motion.p>
          <motion.div {...fadeUp} className="wama-stat-row">
            {[
              { value: stats.totalStudents, label: "Students", color: "#1BA34A", live: true },
              { value: "250+", label: "Topics covered", color: "#111", live: false },
              { value: "10", label: "Years of PYQs", color: "#FF8A1A", live: false },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="wama-stat-num" style={{ color: stat.color }}>
                  {stat.live ? <CountUp target={stat.value} /> : stat.value}
                </div>
                <div className="wama-stat-label">{stat.label}</div>
              </div>
            ))}
          </motion.div>
          <motion.div {...fadeUp}>
            <Link to="/register" className="wama-pill">
              Start prepping free
            </Link>
          </motion.div>
        </div>

        <motion.div {...fadeUp} className="wama-color-card wama-identity-card wama-ink-light" style={{ background: "#111827", color: "#FFFFFF" }}>
          <SectionMark icon={Route}>
            <circle cx="28" cy="28" r="6" />
            <circle cx="112" cy="32" r="6" />
            <circle cx="70" cy="78" r="6" />
            <path d="M34 32l28 12M106 36L82 44M70 72V58" opacity="0.45" />
          </SectionMark>
          <h3>Dijkstra in four steps</h3>
          <ol className="wama-steps">
            <li>Start at the source, distance 0</li>
            <li>Mark every other node as unknown</li>
            <li>Visit the nearest unvisited node</li>
            <li>Update any shorter path you find</li>
          </ol>
        </motion.div>
      </div>
    </section>
  );
};

export default IdentitySection;
