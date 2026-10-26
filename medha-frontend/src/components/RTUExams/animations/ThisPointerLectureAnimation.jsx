/**
 * ThisPointerLectureAnimation.jsx
 * Orchestrator for this Pointer & Friend Functions Lecture
 * 19 Scenes total
 */
import { ThisPointerScenesPart1 } from "./ThisPointerLecture";
import { ThisPointerScenesPart2 } from "./ThisPointerLecturePart2";

// Metadata
export const metadata = {
  id: "this-pointer-lecture",
  title: "this Pointer, Constructors & Friend Functions",
  description: "Complete lecture on this Pointer, Constructors, Destructors, and Friend Functions in C++",
  totalSteps: 19,
  subject: "Object Oriented Programming",
  category: "cpp-this-pointer-friend",
  estimatedTime: "18 min",
  unit: "Unit 4",
  university: "RTU",
  topics: ["this Pointer", "Constructors", "Destructors", "Friend Functions", "Friend Class", "Encapsulation"],
  audioDuration: 0,
};

// Combine all scenes
export const AnimationSteps = [
  ...ThisPointerScenesPart1,
  ...ThisPointerScenesPart2,
];

// Parts configuration for sidebar
export const parts = [
  {
    partNumber: 1,
    name: "this & Constructors",
    startScene: 1,
    endScene: 10,
    icon: "👆",
  },
  {
    partNumber: 2,
    name: "Friend Functions",
    startScene: 11,
    endScene: 19,
    icon: "🤝",
  },
];

// Sections for navigation
export const sections = [
  { name: "Introduction", startStep: 1, endStep: 1 },
  { name: "this Pointer", startStep: 2, endStep: 5 },
  { name: "Constructors", startStep: 6, endStep: 8 },
  { name: "Destructors", startStep: 9, endStep: 11 },
  { name: "Encapsulation", startStep: 12, endStep: 12 },
  { name: "Friend Functions", startStep: 13, endStep: 16 },
  { name: "Summary", startStep: 17, endStep: 19 },
];

// Default export
export default {
  metadata,
  AnimationSteps,
  parts,
  sections,
};
