import React from "react";
import {
  Atom,
  Binary,
  Box,
  Boxes,
  Building2,
  ChartScatter,
  CircuitBoard,
  CircleDollarSign,
  Coffee,
  Cog,
  Component,
  Cpu,
  Database,
  FileCog,
  FilePenLine,
  FlaskConical,
  FunctionSquare,
  Gauge,
  GitFork,
  HeartHandshake,
  MessagesSquare,
  MonitorCog,
  Network,
  Orbit,
  PlugZap,
  Puzzle,
  Sigma,
  Waypoints,
  Wifi,
  Workflow,
} from "lucide-react";
import { SiC, SiCplusplus, SiPython } from "react-icons/si";

function Scene({ icon: Icon, filled = false, children }) {
  return (
    <span className="wama-subject-art">
      <svg
        className="wama-subject-art-draw"
        viewBox="0 0 140 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="70" cy="50" r="38" opacity="0.16" />
        <circle cx="70" cy="50" r="28" strokeDasharray="3 5" opacity="0.28" />
        {children}
      </svg>
      <Icon
        className={`wama-subject-art-icon${filled ? " is-logo" : ""}`}
        strokeWidth={filled ? undefined : 1.65}
      />
    </span>
  );
}

const SCENES = {
  PHY: (
    <Scene icon={Atom}>
      <ellipse cx="70" cy="50" rx="46" ry="16" opacity="0.45" />
      <ellipse cx="70" cy="50" rx="16" ry="42" transform="rotate(28 70 50)" opacity="0.35" />
    </Scene>
  ),
  CHY: (
    <Scene icon={FlaskConical}>
      <path d="M28 78c8-6 14-4 18 2M104 74c-7-8-16-6-22 2" opacity="0.55" />
      <circle cx="32" cy="30" r="2.2" fill="currentColor" stroke="none" opacity="0.5" />
      <circle cx="112" cy="38" r="1.8" fill="currentColor" stroke="none" opacity="0.45" />
    </Scene>
  ),
  DSA: (
    <Scene icon={GitFork}>
      <circle cx="28" cy="22" r="3.2" />
      <circle cx="112" cy="24" r="3.2" />
      <circle cx="24" cy="78" r="2.6" />
      <path d="M32 26l18 16M108 28L92 46M28 74l16-10" opacity="0.5" />
    </Scene>
  ),
  "AOA / DAA": (
    <Scene icon={Gauge}>
      <path d="M18 78c18-6 24-46 42-46s20 24 30 24 12-28 22-34" opacity="0.55" />
      <path d="M18 22v56h100" opacity="0.28" />
    </Scene>
  ),
  SE: (
    <Scene icon={Workflow}>
      <rect x="16" y="22" width="24" height="10" rx="3" opacity="0.4" />
      <rect x="100" y="68" width="24" height="10" rx="3" opacity="0.4" />
    </Scene>
  ),
  CG: (
    <Scene icon={Box}>
      <path d="M16 72l20-10 20 10-20 10z" opacity="0.4" />
      <path d="M104 20l16 8-16 8-16-8z" opacity="0.35" />
    </Scene>
  ),
  WC: (
    <Scene icon={Wifi}>
      <path d="M28 58a44 44 0 0 1 84 0" opacity="0.35" />
      <path d="M42 58a28 28 0 0 1 56 0" opacity="0.45" />
    </Scene>
  ),
  ITC: (
    <Scene icon={Binary}>
      <path d="M20 72h12M36 72h6M46 72h14M64 72h8M76 72h22" opacity="0.45" />
    </Scene>
  ),
  HV: (
    <Scene icon={HeartHandshake}>
      <path d="M24 66c10 10 22 16 46 20 24-4 36-10 46-20" opacity="0.35" />
    </Scene>
  ),
  TC: (
    <Scene icon={FilePenLine}>
      <path d="M104 26l14 10-8 12" opacity="0.5" />
      <path d="M20 70h28" opacity="0.35" />
    </Scene>
  ),
  DMS: (
    <Scene icon={Waypoints}>
      <circle cx="46" cy="50" r="18" opacity="0.35" />
      <circle cx="94" cy="50" r="18" opacity="0.35" />
    </Scene>
  ),
  AM: (
    <Scene icon={FunctionSquare}>
      <path d="M20 74V22h8" opacity="0.3" />
      <path d="M28 64c12-24 20-24 30 0s18 24 28 0" opacity="0.45" />
    </Scene>
  ),
  DBMS: (
    <Scene icon={Database}>
      <ellipse cx="26" cy="36" rx="10" ry="4" opacity="0.4" />
      <path d="M16 36v10c0 2 4 4 10 4s10-2 10-4V36" opacity="0.4" />
    </Scene>
  ),
  JAVA: (
    <Scene icon={Coffee}>
      <path d="M98 26c-2 8 6 8 4 16" opacity="0.5" />
      <path d="M110 22c-2 8 6 8 4 16" opacity="0.4" />
    </Scene>
  ),
  PY: (
    <Scene icon={SiPython} filled>
      <path d="M22 70c6-20 18-24 32-16 12 6-6 18 8 26 10 6 24-4 30-14" opacity="0.4" />
    </Scene>
  ),
  OS: (
    <Scene icon={MonitorCog}>
      <path d="M24 78h92" opacity="0.35" />
    </Scene>
  ),
  CN: (
    <Scene icon={Network}>
      <circle cx="22" cy="24" r="5" />
      <circle cx="118" cy="28" r="5" />
      <circle cx="26" cy="80" r="4" />
      <path d="M27 28l18 14M113 32L94 46M30 76l16-12" opacity="0.45" />
    </Scene>
  ),
  DE: (
    <Scene icon={CircuitBoard}>
      <path d="M16 36h16M16 64h16M108 50h16" opacity="0.4" />
    </Scene>
  ),
  OOP: (
    <Scene icon={Component}>
      <rect x="16" y="18" width="20" height="14" rx="3" opacity="0.4" />
      <rect x="104" y="68" width="20" height="14" rx="3" opacity="0.4" />
    </Scene>
  ),
  CD: (
    <Scene icon={FileCog}>
      <path d="M18 50h18M104 50h18" opacity="0.4" />
      <path d="M36 50l8-6M36 50l8 6M104 50l-8-6M104 50l-8 6" opacity="0.4" />
    </Scene>
  ),
  TOC: (
    <Scene icon={Orbit}>
      <circle cx="26" cy="50" r="9" opacity="0.4" />
      <circle cx="114" cy="50" r="9" opacity="0.4" />
      <path d="M35 50h18M87 50h18" opacity="0.35" />
    </Scene>
  ),
  MEFA: (
    <Scene icon={CircleDollarSign}>
      <path d="M20 76V50h8v26M34 76V40h8v36M48 76V30h8v46" opacity="0.32" />
    </Scene>
  ),
  BC: (
    <Scene icon={Boxes}>
      <rect x="14" y="38" width="16" height="16" rx="2" opacity="0.4" />
      <rect x="110" y="38" width="16" height="16" rx="2" opacity="0.4" />
      <path d="M30 46h12M98 46h12" opacity="0.4" />
    </Scene>
  ),
  DMC: (
    <Scene icon={ChartScatter}>
      <path d="M20 78l14-24 14 24z" opacity="0.4" />
      <path d="M100 78l12-26 12 26z" opacity="0.35" />
    </Scene>
  ),
  MuP: (
    <Scene icon={Cpu}>
      <path d="M40 16v10M70 16v10M100 16v10M40 84v-10M70 84v-10M100 84v-10M16 40h10M16 60h10M114 40h10M114 60h10" opacity="0.4" />
    </Scene>
  ),
  BEE: (
    <Scene icon={PlugZap}>
      <path d="M16 50h18l6-12 10 24 8-16" opacity="0.4" />
    </Scene>
  ),
  BME: (
    <Scene icon={Cog}>
      <path d="M104 70l18 10" opacity="0.45" />
    </Scene>
  ),
  BCE: (
    <Scene icon={Building2}>
      <path d="M16 82h108" opacity="0.35" />
      <path d="M20 82V54h12V82M108 82V48h12V82" opacity="0.4" />
    </Scene>
  ),
  C: (
    <Scene icon={SiC} filled>
      <path d="M108 32c8 8 8 20 0 28" opacity="0.4" />
    </Scene>
  ),
  CPP: (
    <Scene icon={SiCplusplus} filled>
      <path d="M102 36v8M98 40h8M118 36v8M114 40h8" opacity="0.45" />
    </Scene>
  ),
  PPS: (
    <Scene icon={Puzzle}>
      <path d="M108 28l8 8" opacity="0.4" />
    </Scene>
  ),
  EM: (
    <Scene icon={Sigma}>
      <path d="M102 28c10 6 12 16 4 24" opacity="0.4" />
      <path d="M20 74c10-22 18-22 28 0" opacity="0.35" />
    </Scene>
  ),
  CS: (
    <Scene icon={MessagesSquare}>
      <path d="M102 26h16a8 8 0 0 1 8 8v10h-8l-6 8 2-8h-6a8 8 0 0 1-8-8V26z" opacity="0.4" />
    </Scene>
  ),
};

export default function SubjectCardArt({ code }) {
  return SCENES[code] || null;
}
