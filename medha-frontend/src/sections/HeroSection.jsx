import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SubjectFan from "./SubjectFan";

const HeroSection = () => {
  return (
    <section className="wama-hero">
      <div className="wama-hero-copy">
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
          With the syllabus in front of everything, Medha cuts the friction,
          saves time and leaves space for you to actually study.
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
