import React, { useEffect, useRef } from "react";
import BrandMark, { CAMPUSKART_URL } from "../Common/BrandMark";
import "./AuthPage.css";

const ROW_CARDS = [
  { short: "PHY", bg: "#1BA34A", ink: "#FFFFFF" },
  { short: "SE", bg: "#C6D93B", ink: "#161616" },
  { short: "AOA", bg: "#E30613", ink: "#FFFFFF" },
  { short: "OS", bg: "#166534", ink: "#FFFFFF" },
  { short: "JAVA", bg: "#C2410C", ink: "#FFFFFF" },
  { short: "DE", bg: "#2563EB", ink: "#FFFFFF" },
];

const COL_CARDS = [
  { short: "OOP", bg: "#7C3AED", ink: "#FFFFFF" },
  { short: "DSA", bg: "#111111", ink: "#FFFFFF" },
  { short: "PY", bg: "#FACC15", ink: "#161616" },
  { short: "CN", bg: "#22D3EE", ink: "#161616" },
  { short: "TOC", bg: "#34D399", ink: "#161616" },
  { short: "DBMS", bg: "#D946EF", ink: "#FFFFFF" },
];

const CARD_W = 128;
const CARD_H = 154;
const GAP = 12;
const SOURCE_GAP = 28;
const STEP_X = CARD_W + GAP;
const STEP_Y = CARD_H + GAP;
const SPEED = 64;

function wrap(value, span) {
  if (!span) return 0;
  return ((value % span) + span) % span;
}

const AuthCardStream = () => {
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const source = stage.querySelector(".auth-source-card");
    const rowLane = stage.querySelector(".auth-lane-row");
    const colLane = stage.querySelector(".auth-lane-col");
    const rowNodes = [...stage.querySelectorAll(".auth-subject-card-row")];
    const colNodes = [...stage.querySelectorAll(".auth-subject-card-col")];

    const paint = (offset) => {
      const stageW = stage.clientWidth;
      const stageH = stage.clientHeight;
      if (!source || !rowLane || !colLane || stageW < 80 || stageH < 80) return;

      const sourceX = Math.max(STEP_X, stageW - CARD_W - 18);
      const sourceY = Math.max(STEP_Y, stageH - CARD_H - 18);
      source.style.left = `${sourceX}px`;
      source.style.top = `${sourceY}px`;

      const rowW = Math.max(CARD_W, sourceX - SOURCE_GAP);
      const colH = Math.max(CARD_H, sourceY - SOURCE_GAP);
      const flushX = rowW - CARD_W;
      const flushY = colH - CARD_H;

      rowLane.style.left = "0px";
      rowLane.style.top = `${sourceY}px`;
      rowLane.style.width = `${rowW}px`;
      rowLane.style.height = `${CARD_H}px`;
      colLane.style.left = `${sourceX}px`;
      colLane.style.top = "0px";
      colLane.style.width = `${CARD_W}px`;
      colLane.style.height = `${colH}px`;

      const rowSpan = rowNodes.length * STEP_X;
      rowNodes.forEach((node, index) => {
        const travel = wrap(offset + index * STEP_X, rowSpan);
        const x = flushX - travel;
        node.style.left = `${x}px`;
        node.style.top = "0px";
        node.style.visibility = x + CARD_W <= rowW + 0.5 ? "visible" : "hidden";
      });

      const colSpan = colNodes.length * STEP_Y;
      colNodes.forEach((node, index) => {
        const travel = wrap(offset + index * STEP_Y, colSpan);
        const y = flushY - travel;
        node.style.left = "0px";
        node.style.top = `${y}px`;
        node.style.visibility = y + CARD_H <= colH + 0.5 ? "visible" : "hidden";
      });
    };

    let frame = 0;
    let offset = 0;
    let last = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    paint(0);
    if (reduced) return undefined;

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      offset += SPEED * dt;
      try {
        paint(offset);
      } catch {
        /* keep the loop alive */
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    const observer = new ResizeObserver(() => paint(offset));
    observer.observe(stage);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="auth-card-stage" ref={stageRef} aria-hidden="true">
      <div className="auth-lane auth-lane-row">
        {ROW_CARDS.map((card) => (
          <div
            key={`row-${card.short}`}
            className="auth-subject-card auth-subject-card-row"
            style={{ background: card.bg, color: card.ink }}
          >
            <strong>{card.short}</strong>
          </div>
        ))}
      </div>
      <div className="auth-lane auth-lane-col">
        {COL_CARDS.map((card) => (
          <div
            key={`col-${card.short}`}
            className="auth-subject-card auth-subject-card-col"
            style={{ background: card.bg, color: card.ink }}
          >
            <strong>{card.short}</strong>
          </div>
        ))}
      </div>
      <div className="auth-source-card">
        <span className="auth-source-aura" aria-hidden="true">
          <span className="auth-source-orb auth-source-orb-a" />
          <span className="auth-source-orb auth-source-orb-b" />
          <span className="auth-source-orb auth-source-orb-c" />
          <span className="auth-source-orbit" />
          <span className="auth-source-shine" />
        </span>
        <span className="auth-source-name">
          <span>Medha</span>
          <span>Revision</span>
        </span>
        <a
          className="auth-source-by"
          href={CAMPUSKART_URL}
          target="_blank"
          rel="noreferrer"
          title="CampusKart"
        >
          By{" "}
          <span className="auth-source-ck">
            <span className="auth-source-campus">campus</span>
            <span className="auth-source-kart">kart</span>
            <span className="auth-source-dot" aria-hidden="true" />
          </span>
        </a>
      </div>
    </div>
  );
};

const AuthShell = ({ kicker, titleLines, subtitle, children }) => {
  return (
    <div className="auth-page">
      <aside className="auth-visual">
        <BrandMark variant="auth" className="auth-wordmark" />
        <div className="auth-visual-copy">
          {kicker ? <p className="auth-kicker">{kicker}</p> : null}
          <h1>
            {titleLines.map((line) => (
              <span key={line} className="auth-title-line">
                {line}
              </span>
            ))}
          </h1>
          <p className="auth-lead">{subtitle}</p>
          <div className="auth-chips">
            <span className="auth-chip auth-chip-green">Notes</span>
            <span className="auth-chip auth-chip-orange">RTU past papers</span>
            <span className="auth-chip auth-chip-lime">Syllabus-matched lectures</span>
          </div>
        </div>
        <div className="auth-visual-spacer" />
        <AuthCardStream />
      </aside>

      <main className="auth-panel">
        <div className="auth-mobile-brand">
          <BrandMark variant="auth" className="auth-wordmark" />
        </div>
        {children}
      </main>
    </div>
  );
};

export default AuthShell;
