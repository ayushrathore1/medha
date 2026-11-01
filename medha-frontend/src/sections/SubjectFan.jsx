import React, { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { SUBJECTS, searchPath } from "../data/subjectCatalog";
import SubjectCardArt from "./SubjectCardArt";

const DECK = [
  { short: "PHY", name: "Engineering Physics", tone: { bg: "#1BA34A", ink: "#FFFFFF" } },
  { short: "CHY", name: "Engineering Chemistry", tone: { bg: "#FF8A1A", ink: "#161616" } },
  { short: "DSA", name: "Data Structures and Algorithms", tone: { bg: "#FFFFFF", ink: "#161616", line: "#E6E6E6" } },
  {
    short: "AOA / DAA",
    name: "Analysis of Algorithms",
    also: "Design and Analysis of Algorithms",
    tone: { bg: "#E30613", ink: "#FFFFFF" },
  },
  { short: "SE", name: "Software Engineering", tone: { bg: "#C6D93B", ink: "#161616" } },
  { short: "CG", name: "Computer Graphics & Multimedia", full: "Computer Graphics", tone: { bg: "#2563EB", ink: "#FFFFFF" } },
  { short: "WC", name: "Wireless Communication", tone: { bg: "#0D9488", ink: "#FFFFFF" } },
  { short: "ITC", name: "Information Theory & Coding", tone: { bg: "#7C3AED", ink: "#FFFFFF" } },
  { short: "HV", name: "Human Values", tone: { bg: "#F43F5E", ink: "#FFFFFF" } },
  { short: "TC", name: "Technical Communication", tone: { bg: "#38BDF8", ink: "#161616" } },
  { short: "DMS", name: "Discrete Mathematics Structure", full: "Discrete Mathematics Structures", tone: { bg: "#F59E0B", ink: "#161616" } },
  { short: "AM", name: "Advanced Mathematics", tone: { bg: "#1E3A8A", ink: "#FFFFFF" } },
  { short: "DBMS", name: "Database Management System", tone: { bg: "#D946EF", ink: "#FFFFFF" } },
  { short: "JAVA", name: "Java Programming", tone: { bg: "#C2410C", ink: "#FFFFFF" } },
  { short: "PY", name: "Python Programming", tone: { bg: "#FACC15", ink: "#161616" } },
  { short: "OS", name: "Operating System", tone: { bg: "#166534", ink: "#FFFFFF" } },
  { short: "CN", name: "Data Communication & Computer Networks", tone: { bg: "#22D3EE", ink: "#161616" } },
  { short: "DE", name: "Digital Electronics", tone: { bg: "#C026D3", ink: "#FFFFFF" } },
  { short: "OOP", name: "Object Oriented Programming", tone: { bg: "#334155", ink: "#FFFFFF" } },
  { short: "CD", name: "Compiler Design", tone: { bg: "#FDBA74", ink: "#161616" } },
  { short: "TOC", name: "Theory Of Computation", tone: { bg: "#34D399", ink: "#161616" } },
  { short: "MEFA", name: "Managerial Economics and Financial Accounting", tone: { bg: "#CA8A04", ink: "#161616" } },
  { short: "BC", name: "Blockchain", tone: { bg: "#111827", ink: "#FFFFFF" } },
  { short: "DMC", name: "Data Mining Concepts", tone: { bg: "#BE123C", ink: "#FFFFFF" } },
  { short: "MuP", name: "Microprocessor & Interfaces", full: "Microprocessor", tone: { bg: "#78716C", ink: "#FFFFFF" } },
  { short: "BEE", name: "Basic Electric Electronics", tone: { bg: "#0E7490", ink: "#FFFFFF" } },
  { short: "BME", name: "Basic Mechanical Engineering", tone: { bg: "#9A3412", ink: "#FFFFFF" } },
  { short: "BCE", name: "Basic Civil Engineering", tone: { bg: "#3F3F46", ink: "#FFFFFF" } },
  { short: "C", name: "C Programming", tone: { bg: "#0369A1", ink: "#FFFFFF" } },
  { short: "CPP", name: "C++ Programming", tone: { bg: "#172554", ink: "#FFFFFF" } },
  { short: "PPS", name: "Programming for Problem Solving", tone: { bg: "#3F6212", ink: "#FFFFFF" } },
  { short: "EM", name: "Engineering Mathematics", tone: { bg: "#86198F", ink: "#FFFFFF" } },
  { short: "CS", name: "Communication Skills", tone: { bg: "#DB2777", ink: "#FFFFFF" } },
];

const IDLE_SPEED = 72;
const GAP = 24;

function matchSubject(item) {
  const name = item.name.toLowerCase();
  const short = item.short.replace(/\s/g, "").split("/")[0];
  return (
    SUBJECTS.find((subject) => subject.name.toLowerCase() === name) ||
    SUBJECTS.find((subject) => subject.short === short) ||
    SUBJECTS.find((subject) => subject.name.toLowerCase().includes(name) || name.includes(subject.name.toLowerCase()))
  );
}

function buildDeck() {
  return DECK.map((item) => {
    const match = matchSubject(item);
    return {
      id: match?.slug || `landing-${item.short}`,
      short: item.short,
      full: item.full || item.name,
      also: item.also || "",
      to: match ? `/subjects/${match.slug}` : searchPath(item.also || item.full || item.name),
      tone: item.tone,
    };
  });
}

function wrap(value, length) {
  return ((value % length) + length) % length;
}

function placeCards(nodes, offset, count, stageWidth) {
  const cardW = nodes[0]?.offsetWidth || 210;
  const stride = cardW + GAP;
  const total = stride * count;
  const fade = Math.min(140, stageWidth * 0.12);
  const half = stageWidth / 2;
  for (let index = 0; index < count; index += 1) {
    const node = nodes[index];
    if (!node) continue;
    const x = wrap(index * stride + offset, total) - total / 2;
    const left = half + x - cardW / 2;
    const right = left + cardW;
    let opacity = 1;
    if (right < -cardW * 0.1 || left > stageWidth + cardW * 0.1) {
      opacity = 0;
    } else {
      if (left < fade) opacity = Math.max(0, (left + cardW * 0.35) / (fade + cardW * 0.35));
      if (stageWidth - right < fade) {
        opacity = Math.min(opacity, Math.max(0, (stageWidth - right + cardW * 0.35) / (fade + cardW * 0.35)));
      }
    }
    node.style.transformOrigin = "right bottom";
    node.style.transform = `translate(-50%, 0) translate3d(${x}px, 0, 0)`;
    node.style.zIndex = String(index + 1);
    node.style.opacity = String(opacity);
    node.style.pointerEvents = opacity > 0.2 ? "auto" : "none";
  }
}

export default function SubjectFan() {
  const cards = useMemo(buildDeck, []);
  const stageRef = useRef(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || cards.length === 0) return undefined;
    const nodes = stage.querySelectorAll(".wama-fan-card");
    placeCards(nodes, 0, cards.length, stage.clientWidth);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frame = 0;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      offsetRef.current += IDLE_SPEED * dt;
      placeCards(nodes, offsetRef.current, cards.length, stage.clientWidth);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [cards.length]);

  return (
    <div className="wama-fan">
      <div className="wama-fan-stage" ref={stageRef}>
        {cards.map((card) => (
          <div key={card.id} className="wama-fan-card">
            <Link
              to={card.to}
              className={`wama-subject-card${card.tone.ink === "#FFFFFF" ? " wama-ink-light" : ""}`}
              style={{
                background: card.tone.bg,
                color: card.tone.ink,
                border: card.tone.line ? `1px solid ${card.tone.line}` : "none",
              }}
            >
              <span className="wama-subject-short">{card.short}</span>
              <SubjectCardArt code={card.short} />
              <span className="wama-subject-full">{card.full}</span>
              {card.also ? <span className="wama-subject-also">{card.also}</span> : null}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
