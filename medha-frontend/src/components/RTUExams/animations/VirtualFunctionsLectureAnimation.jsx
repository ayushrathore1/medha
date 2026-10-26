/**
 * VirtualFunctionsLectureAnimation.jsx
 * Orchestrator for Virtual Functions Deep Dive Lecture
 * 12 Scenes total (Title + 10 Main + Closing)
 */
import { LectureScenesPart1 } from "./VirtualFunctionsLecture";
import { LectureScenesPart2 } from "./VirtualFunctionsLecturePart2";

// Metadata
export const metadata = {
  id: "virtual-functions-lecture",
  title: "Virtual Functions Deep Dive",
  description: "Complete technical lecture on Virtual Functions, VTable mechanism, Pure Virtual, Override, and Best Practices",
  totalSteps: 12,
  subject: "Object Oriented Programming",
  category: "cpp-virtual-functions-lecture",
  estimatedTime: "26 min",
  unit: "Unit 4",
  university: "RTU",
  topics: ["Virtual Functions", "VTable", "Pure Virtual", "Override", "Abstract Classes", "Dynamic Binding"],
  audioDuration: 0,
};

// Combine all scenes
export const AnimationSteps = [
  ...LectureScenesPart1,
  ...LectureScenesPart2,
];

// Parts configuration for sidebar
export const parts = [
  {
    partNumber: 1,
    name: "Fundamentals",
    startScene: 1,
    endScene: 7,
    icon: "📖",
  },
  {
    partNumber: 2,
    name: "Advanced Topics",
    startScene: 8,
    endScene: 12,
    icon: "🔬",
  },
];

// Sections for navigation
export const sections = [
  { name: "Introduction", startStep: 1, endStep: 2 },
  { name: "The Problem", startStep: 3, endStep: 4 },
  { name: "The Solution", startStep: 5, endStep: 6 },
  { name: "Virtual Destructors", startStep: 7, endStep: 7 },
  { name: "Override & VTable", startStep: 8, endStep: 9 },
  { name: "Abstract Classes", startStep: 10, endStep: 10 },
  { name: "Summary", startStep: 11, endStep: 12 },
];

// Default export
export default {
  metadata,
  AnimationSteps,
  parts,
  sections,
};
