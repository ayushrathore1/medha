import React from "react";
import { motion } from "framer-motion";
import { BookOpen, ClipboardList, Focus, Trophy } from "lucide-react";
import { fadeUp } from "../lib/motionPresets";
import SectionMark from "./SectionMark";

const WhySection = ({ stats }) => {
  const timeline = [
    { icon: BookOpen, title: "Pick your subject", copy: "Start with the subject and unit you need to revise.", bg: "#22D3EE", ink: "#161616" },
    { icon: ClipboardList, title: "Build your plan", copy: "Use available notes, past-paper insights and study tools.", bg: "#C026D3", ink: "#FFFFFF" },
    { icon: Focus, title: "Study smarter", copy: "Focus on what repeats. Skip what doesn't.", bg: "#166534", ink: "#FFFFFF" },
    { icon: Trophy, title: "Walk in prepared", copy: "Go into your exam with a clearer plan and fewer last-minute guesses.", bg: "#C2410C", ink: "#FFFFFF" },
  ];

  return (
    <section className="wama-section">
      <div className="wama-section-inner wama-split">
        <div>
          <motion.p {...fadeUp} className="wama-kicker">
            Why it works
          </motion.p>
          <motion.h2 {...fadeUp}>
            From scattered material
            <br />
            to a focused plan.
          </motion.h2>
          <div className="wama-why-list">
            {timeline.map((item, index) => (
              <motion.div
                key={item.title}
                className="wama-why-item"
                initial={{ x: -24, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <span className="wama-why-dot" style={{ background: item.bg, color: item.ink }}>
                  <item.icon size={18} strokeWidth={1.8} />
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.copy}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div {...fadeUp} className="wama-why-stats">
          <div className="wama-color-card wama-ink-light" style={{ background: "#1BA34A", color: "#FFFFFF" }}>
            <SectionMark icon={Focus}>
              <path d="M20 50h16M104 50h16M70 18v14M70 68v14" opacity="0.4" />
            </SectionMark>
            <div className="wama-stat-num">{stats.studentsOnline}</div>
            <p>Students studying right now</p>
          </div>
          <div className="wama-why-mini">
            <div className="wama-color-card wama-ink-light" style={{ background: "#111111", color: "#FFFFFF" }}>
              <div className="wama-stat-num wama-stat-accent">10</div>
              <p>Years of RTU past papers</p>
            </div>
            <div className="wama-color-card" style={{ background: "#F59E0B", color: "#161616" }}>
              <div className="wama-stat-num">250+</div>
              <p>Topics covered</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhySection;
