import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SubjectFan from "./SubjectFan";
import { isComingSoonMode } from "../config/appMode";
import { PLATFORM_LAUNCH_DISPLAY } from "../config/launch";

const HeroSection = () => {
  const preLaunch = isComingSoonMode();

  return (
    <section className="wama-hero">
      <div className="wama-hero-copy">
        {preLaunch ? (
          <motion.p
            className="wama-hero-kicker"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            style={{
              margin: "0 0 14px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#1BA34A",
            }}
          >
            Generally available {PLATFORM_LAUNCH_DISPLAY}
          </motion.p>
        ) : null}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="wama-hero-line">We organize your syllabus.</span>
          <span className="wama-hero-line">We unlock exam prep.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          {preLaunch
            ? `Medha Revision opens to everyone on ${PLATFORM_LAUNCH_DISPLAY}. Until then the desk is team-only — the public site unlocks automatically at launch.`
            : "With the syllabus in front of everything, Medha cuts the friction, saves time and leaves space for you to actually study."}
        </motion.p>
        <motion.div
          className="wama-hero-actions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
        >
          <Link className="wama-pill" to="/subjects">
            Open subjects
          </Link>
          <Link className="wama-text-link" to="/past-papers">
            Browse past papers
          </Link>
        </motion.div>
      </div>
      <div className="wama-cards-band" aria-label="Subject cards">
        <SubjectFan />
      </div>
    </section>
  );
};

export default HeroSection;
