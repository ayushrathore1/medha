import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { fadeUp } from "../lib/motionPresets";
import SectionMark from "./SectionMark";

const testimonials = [
  {
    quote: "I had 3 days before my DBMS exam. MEDHA showed me exactly which topics repeat every year.",
    name: "Rahul Sharma",
    role: "CSE, 3rd Year",
    bg: "#1BA34A",
    ink: "#FFFFFF",
  },
  {
    quote: "The notes saved me. I uploaded a photo of my register and got clean notes I could actually revise.",
    name: "Priya Meena",
    role: "ECE, 4th Year",
    bg: "#FF8A1A",
    ink: "#161616",
  },
  {
    quote: "I used to panic the night before exams. Now I open MEDHA and follow a priority map.",
    name: "Ankit Kumar",
    role: "ME, 2nd Year",
    bg: "#2563EB",
    ink: "#FFFFFF",
  },
  {
    quote: "The PYQ analysis is the part I keep coming back to. It makes the syllabus feel smaller.",
    name: "Deepika Patel",
    role: "CSE, 3rd Year",
    bg: "#C6D93B",
    ink: "#161616",
  },
  {
    quote: "I started late and still covered four units because the explanations stayed simple.",
    name: "Vikram Singh",
    role: "Civil, 4th Year",
    bg: "#111827",
    ink: "#FFFFFF",
  },
];

const TestimonialsSection = () => (
  <section className="wama-section">
    <div className="wama-section-inner">
      <motion.div {...fadeUp} className="wama-section-heading">
        <p className="wama-kicker">Made for real study sessions</p>
        <h2>A study flow that feels clearer.</h2>
      </motion.div>
      <div className="wama-quote-row">
        {testimonials.map((item, index) => (
          <motion.article
            key={item.name}
            className={`wama-color-card wama-quote-card${item.ink === "#FFFFFF" ? " wama-ink-light" : ""}`}
            style={{ background: item.bg, color: item.ink }}
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
          >
            <SectionMark icon={Quote}>
              <path d="M24 70c10 8 20 12 46 12s36-4 46-12" opacity="0.35" />
            </SectionMark>
            <p>“{item.quote}”</p>
            <strong>{item.name}</strong>
            <span>{item.role}</span>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
