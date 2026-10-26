/**
 * CppReferencesLectureAnimation.jsx
 * Orchestrator for C++ Memory & References Lecture
 * 14 Scenes total
 */
import { RefScenesPart1 } from "./CppReferencesLecture";
import { RefScenesPart2 } from "./CppReferencesLecturePart2";

// Metadata
export const metadata = {
  id: "cpp-references-lecture",
  title: "C++ Memory & Reference Mechanics",
  description: "Complete lecture on References, Pass by Reference, Dynamic Memory, Memory Leaks, and Smart Pointers",
  totalSteps: 14,
  subject: "Object Oriented Programming",
  category: "cpp-references-memory",
  estimatedTime: "20 min",
  unit: "Unit 4",
  university: "RTU",
  topics: ["References", "Pass by Reference", "Stack vs Heap", "new/delete", "Memory Leaks", "Dangling Pointers", "Smart Pointers"],
  audioDuration: 0,
};

// Combine all scenes
export const AnimationSteps = [
  ...RefScenesPart1,
  ...RefScenesPart2,
];

// Parts configuration for sidebar
export const parts = [
  {
    partNumber: 1,
    name: "References",
    startScene: 1,
    endScene: 7,
    icon: "🔗",
  },
  {
    partNumber: 2,
    name: "Dynamic Memory",
    startScene: 8,
    endScene: 14,
    icon: "🧠",
  },
];

// Sections for navigation
export const sections = [
  { name: "Introduction", startStep: 1, endStep: 1 },
  { name: "References Basics", startStep: 2, endStep: 4 },
  { name: "References vs Pointers", startStep: 5, endStep: 6 },
  { name: "Memory Model", startStep: 7, endStep: 7 },
  { name: "Dynamic Allocation", startStep: 8, endStep: 10 },
  { name: "Memory Problems", startStep: 11, endStep: 12 },
  { name: "Modern C++", startStep: 13, endStep: 14 },
];

// Default export
export default {
  metadata,
  AnimationSteps,
  parts,
  sections,
};
