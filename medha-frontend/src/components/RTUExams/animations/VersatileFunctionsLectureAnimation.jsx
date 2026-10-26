/**
 * VersatileFunctionsLectureAnimation.jsx
 * Orchestrator for Versatile Functions Lecture
 * 24 Scenes total
 */
import { VersatileScenesPart1 } from "./VersatileFunctionsLecture";
import { VersatileScenesPart2 } from "./VersatileFunctionsLecturePart2";

// Metadata
export const metadata = {
  id: "versatile-functions-lecture",
  title: "Versatile Functions in C++",
  description: "Complete lecture on Function Overloading, Default Arguments, and Inline Functions",
  totalSteps: 24,
  subject: "Object Oriented Programming",
  category: "cpp-versatile-functions",
  estimatedTime: "24 min",
  unit: "Unit 4",
  university: "RTU",
  topics: ["Function Overloading", "Polymorphism", "Function Signature", "Default Arguments", "Inline Functions", "Performance"],
  audioDuration: 0,
};

// Combine all scenes
export const AnimationSteps = [
  ...VersatileScenesPart1,
  ...VersatileScenesPart2,
];

// Parts configuration for sidebar
export const parts = [
  {
    partNumber: 1,
    name: "Overloading & Defaults",
    startScene: 1,
    endScene: 12,
    icon: "🔀",
  },
  {
    partNumber: 2,
    name: "Inline & Performance",
    startScene: 13,
    endScene: 24,
    icon: "⚡",
  },
];

// Sections for navigation
export const sections = [
  { name: "Introduction", startStep: 1, endStep: 1 },
  { name: "Function Overloading", startStep: 2, endStep: 8 },
  { name: "Default Arguments", startStep: 9, endStep: 12 },
  { name: "Inline Functions", startStep: 13, endStep: 20 },
  { name: "Summary & Philosophy", startStep: 21, endStep: 24 },
];

// Default export
export default {
  metadata,
  AnimationSteps,
  parts,
  sections,
};
