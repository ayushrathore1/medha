import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import "../styles/ComingSoon.css";

const LOGO_SRC =
  "https://ik.imagekit.io/ayushrathore1/MEDHA%20Revision%20Logo%20(5)/6.svg?updatedAt=1767677218473";

const ORBS = [
  { className: "coming-soon-orb coming-soon-orb--a", delay: "0s" },
  { className: "coming-soon-orb coming-soon-orb--b", delay: "1.4s" },
  { className: "coming-soon-orb coming-soon-orb--c", delay: "2.6s" },
  { className: "coming-soon-orb coming-soon-orb--d", delay: "0.7s" },
];

const SPECKS = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${4 + ((index * 41) % 92)}%`,
  delay: `${(index % 11) * 0.65}s`,
  duration: `${11 + (index % 7) * 1.35}s`,
  size: 1.5 + (index % 4) * 0.7,
  opacity: 0.25 + (index % 5) * 0.08,
}));

const ease = [0.22, 1, 0.36, 1];

export default function ComingSoon() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="coming-soon" aria-labelledby="coming-soon-title">
      <div className="coming-soon-stage" aria-hidden="true">
        <div className={`coming-soon-wash${reduceMotion ? " is-still" : ""}`} />
        <div className="coming-soon-vignette" />
        <div className="coming-soon-grid" />
        {ORBS.map((orb) => (
          <span
            key={orb.className}
            className={`${orb.className}${reduceMotion ? " is-still" : ""}`}
            style={{ animationDelay: orb.delay }}
          />
        ))}
        {!reduceMotion &&
          SPECKS.map((speck) => (
            <span
              key={speck.id}
              className="coming-soon-speck"
              style={{
                left: speck.left,
                width: speck.size,
                height: speck.size,
                animationDelay: speck.delay,
                animationDuration: speck.duration,
                "--speck-opacity": speck.opacity,
              }}
            />
          ))}
        <div className="coming-soon-horizon" />
      </div>

      <div className="coming-soon-frame">
        <motion.div
          className="coming-soon-content"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease }}
        >
          <motion.div
            className="coming-soon-brand"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.05 }}
          >
            <div className={`coming-soon-logo-wrap${reduceMotion ? "" : " is-alive"}`}>
              <img
                className="coming-soon-logo"
                src={LOGO_SRC}
                alt=""
                width={112}
                height={112}
                decoding="async"
              />
            </div>
            <div className="coming-soon-wordmark" aria-label="Medha Revision">
              <span className="coming-soon-wordmark-name">Medha Revision</span>
              <span className="coming-soon-wordmark-by">
                By{" "}
                <span className="coming-soon-wordmark-ck">
                  <span className="coming-soon-wordmark-campus">campus</span>
                  <span className="coming-soon-wordmark-kart">kart</span>
                  <span className="coming-soon-wordmark-dot" aria-hidden="true" />
                </span>
              </span>
            </div>
          </motion.div>

          <motion.h1
            id="coming-soon-title"
            className="coming-soon-title"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.14 }}
          >
            Medha got a new home
          </motion.h1>

          <motion.p
            className="coming-soon-lead"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.22 }}
          >
            Diwali work is going on.
          </motion.p>

          <motion.p
            className={`coming-soon-status${reduceMotion ? "" : " is-alive"}`}
            aria-live="polite"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease, delay: 0.34 }}
          >
            Coming soon
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}
