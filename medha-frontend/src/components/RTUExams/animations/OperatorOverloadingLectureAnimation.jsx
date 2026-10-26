/**
 * OperatorOverloadingLectureAnimation.jsx
 * Orchestrator for Operator Overloading Deep Dive Lecture
 * 17 Scenes total
 */
import { OperatorScenesPart1 } from "./OperatorOverloadingLecture";
import { OperatorScenesPart2 } from "./OperatorOverloadingLecturePart2";

// Metadata
export const metadata = {
  id: "operator-overloading-lecture",
  title: "Operator Overloading Deep Dive",
  description: "Complete lecture on Operator Overloading - Member functions, Friend functions, Rules, Common Mistakes, and Best Practices",
  totalSteps: 17,
  subject: "Object Oriented Programming",
  category: "cpp-operator-overloading",
  estimatedTime: "15 min",
  unit: "Unit 4",
  university: "RTU",
  topics: ["Operator Overloading", "Member Functions", "Friend Functions", "Comparison Operators", "Subscript Operator", "Design Principles"],
  audioDuration: 0,
};

// Combine all scenes
export const AnimationSteps = [
  ...OperatorScenesPart1,
  ...OperatorScenesPart2,
];

// Parts configuration for sidebar
export const parts = [
  {
    partNumber: 1,
    name: "Fundamentals",
    startScene: 1,
    endScene: 9,
    icon: "📦",
  },
  {
    partNumber: 2,
    name: "Advanced Topics",
    startScene: 10,
    endScene: 17,
    icon: "⚡",
  },
];

// Sections for navigation
export const sections = [
  { name: "Introduction", startStep: 1, endStep: 3 },
  { name: "Box Class Example", startStep: 4, endStep: 6 },
  { name: "Complex Numbers", startStep: 7, endStep: 7 },
  { name: "Friend Functions", startStep: 8, endStep: 10 },
  { name: "STL Operators", startStep: 11, endStep: 12 },
  { name: "Rules & Mistakes", startStep: 13, endStep: 14 },
  { name: "Best Practices", startStep: 15, endStep: 16 },
  { name: "What's Next", startStep: 17, endStep: 17 },
];

// Default export
export default {
  metadata,
  AnimationSteps,
  parts,
  sections,
};
