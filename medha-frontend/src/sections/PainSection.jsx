import React from "react";
import { motion } from "framer-motion";
import { Files, Lightbulb, Timer } from "lucide-react";
import { fadeUp } from "../lib/motionPresets";
import SectionMark from "./SectionMark";

const challenges = [
  {
    number: "01",
    eyebrow: "Time is tight",
    title: "Too much syllabus. Too little time.",
    body: "When exams get close, it is hard to decide what deserves your attention first.",
    solution: "Start with a clearer plan",
    bg: "#FACC15",
    ink: "#161616",
    icon: Timer,
    draw: <path d="M28 22h20M92 22h20M70 18v10" opacity="0.45" />,
  },
  {
    number: "02",
    eyebrow: "Too many files",
    title: "Notes scattered across chats.",
    body: "PDFs, class notes and old question papers can make revision feel harder than it needs to be.",
    solution: "Bring your prep into focus",
    bg: "#2563EB",
    ink: "#FFFFFF",
    icon: Files,
    draw: (
      <>
        <rect x="20" y="28" width="22" height="28" rx="3" opacity="0.4" />
        <rect x="98" y="44" width="22" height="28" rx="3" opacity="0.4" />
      </>
    ),
  },
  {
    number: "03",
    eyebrow: "Stuck on a concept",
    title: "Reading it again is not helping.",
    body: "Sometimes you need a simpler explanation, a useful example or a different way into the topic.",
    solution: "Learn it in smaller steps",
    bg: "#7C3AED",
    ink: "#FFFFFF",
    icon: Lightbulb,
    draw: (
      <>
        <path d="M24 74h20v10H24z" opacity="0.35" />
        <path d="M108 26l8 8" opacity="0.4" />
      </>
    ),
  },
];

const PainSection = () => (
  <section className="wama-section">
    <div className="wama-section-inner">
      <motion.div {...fadeUp} className="wama-section-heading">
        <p className="wama-kicker">The exam-season reality</p>
        <h2>
          Studying is hard enough.
          <span>Finding a starting point shouldn&apos;t be.</span>
        </h2>
        <p>MEDHA helps you turn the pile of things to study into a set of next steps.</p>
      </motion.div>
      <div className="wama-pain-grid">
        {challenges.map((item, index) => (
          <motion.article
            key={item.number}
            className={`wama-color-card${item.ink === "#FFFFFF" ? " wama-ink-light" : ""}`}
            style={{ background: item.bg, color: item.ink }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <div className="wama-color-card-top">
              <span>{item.eyebrow}</span>
              <span>{item.number}</span>
            </div>
            <SectionMark icon={item.icon}>{item.draw}</SectionMark>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <div className="wama-color-card-foot">
              <span>{item.solution}</span>
              <span aria-hidden="true">↗</span>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default PainSection;
