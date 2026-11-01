import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, FileSearch, MessageCircle, Route } from "lucide-react";
import { fadeUp } from "../lib/motionPresets";
import SectionMark from "./SectionMark";

const features = [
  {
    bg: "#1BA34A",
    ink: "#FFFFFF",
    badge: "Study tools",
    title: "Turn notes into revision",
    sub: "Turn rough material into structured notes you can revisit.",
    category: "Study Tools",
    icon: BookOpen,
    draw: <path d="M24 28h18M24 40h28M98 64h18" opacity="0.4" />,
  },
  {
    bg: "#FF8A1A",
    ink: "#161616",
    badge: "Past papers",
    title: "Find patterns in past papers",
    sub: "Explore past-paper patterns to guide what you revise.",
    category: "PYQ Archive",
    icon: FileSearch,
    draw: <path d="M20 74V40h10v34M36 74V28h10v46M52 74V48h10v26" opacity="0.35" />,
  },
  {
    bg: "#E30613",
    ink: "#FFFFFF",
    badge: "Explainer",
    title: "Get unstuck on a topic",
    sub: "Ask questions and work through tricky concepts in simpler language.",
    category: "Study Tools",
    icon: MessageCircle,
    draw: <path d="M100 26h18a8 8 0 0 1 8 8v10h-8l-6 8 2-8h-6a8 8 0 0 1-8-8V26z" opacity="0.4" />,
  },
  {
    bg: "#7C3AED",
    ink: "#FFFFFF",
    badge: "Revision plan",
    title: "Build a focused study plan",
    sub: "Break the syllabus into manageable steps for your next session.",
    category: "Exam Prep",
    icon: Route,
    draw: <path d="M22 70c16-8 20-28 36-28s16 18 28 18 14-22 22-28" opacity="0.45" />,
  },
];

const tabs = ["All Features", "Study Tools", "PYQ Archive", "Notes", "Exam Prep"];

const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState("All Features");
  const filtered = activeTab === "All Features" ? features : features.filter((item) => item.category === activeTab);

  return (
    <section id="features" className="wama-section">
      <div className="wama-section-inner">
        <motion.div {...fadeUp} className="wama-section-heading">
          <p className="wama-kicker">Your study toolkit</p>
          <h2>A better way to get started.</h2>
        </motion.div>

        <motion.div {...fadeUp} className="wama-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`wama-tab${activeTab === tab ? " is-on" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        <div className="wama-feature-grid">
          {filtered.map((feat, index) => (
            <motion.article
              key={feat.title}
              className={`wama-color-card${feat.ink === "#FFFFFF" ? " wama-ink-light" : ""}`}
              style={{ background: feat.bg, color: feat.ink }}
              initial={{ y: 32, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <span className="wama-color-card-badge">{feat.badge}</span>
              <SectionMark icon={feat.icon}>{feat.draw}</SectionMark>
              <h3>{feat.title}</h3>
              <p>{feat.sub}</p>
            </motion.article>
          ))}
          {filtered.length === 0 ? (
            <p className="wama-empty">More of this toolkit is coming. Browse all features for now.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
