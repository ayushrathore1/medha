/**
 * VirtualFunctionsOneShotAnimation.jsx
 * Main orchestrator for Virtual Functions & Operator Overloading Animation
 * 32 Scenes total (Updated)
 */
import { AnimationStepsPart1 } from "./VirtualFunctionsAnimation";
import { AnimationStepsPart2 } from "./VirtualFunctionsPart2";

// Metadata
export const metadata = {
  id: "virtual-functions",
  title: "Virtual Functions & Operator Overloading",
  description: "Master Polymorphism, Operator Overloading, Virtual Functions & Dynamic Binding in C++",
  totalSteps: 32,
  subject: "Object Oriented Programming",
  category: "cpp-virtual-functions",
  estimatedTime: "10 min",
  unit: "Unit 4",
  university: "RTU",
  topics: ["Polymorphism", "Operator Overloading", "Virtual Functions", "Dynamic Binding", "Virtual Destructor"],
  audioDuration: 0,
};

// Combine all scenes
export const AnimationSteps = [
  ...AnimationStepsPart1,
  ...AnimationStepsPart2,
];

// Parts configuration for sidebar
export const parts = [
  {
    partNumber: 1,
    name: "Operator Overloading",
    startScene: 1,
    endScene: 16,
    icon: "➕",
  },
  {
    partNumber: 2,
    name: "Virtual Functions",
    startScene: 17,
    endScene: 32,
    icon: "🎯",
  },
];

// Sections for navigation
export const sections = [
  { name: "Introduction", startStep: 1, endStep: 3 },
  { name: "Operator Overloading Concept", startStep: 4, endStep: 9 },
  { name: "Operator Overloading Program", startStep: 10, endStep: 13 },
  { name: "Runtime Transition", startStep: 14, endStep: 16 },
  { name: "ID Card Analogy", startStep: 17, endStep: 19 },
  { name: "Virtual Functions", startStep: 20, endStep: 25 },
  { name: "Virtual Destructor", startStep: 26, endStep: 27 },
  { name: "Summary & Philosophy", startStep: 28, endStep: 32 },
];

// Default export
export default {
  metadata,
  AnimationSteps,
  parts,
  sections,
};
