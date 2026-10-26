/**
 * MultipleInheritanceLectureAnimation.jsx
 * Orchestrator for Multiple Inheritance Lecture
 * 11 Scenes total
 */
import { MultipleInheritanceScenes } from "./MultipleInheritanceLecture";

// Metadata
export const metadata = {
  id: "multiple-inheritance-lecture",
  title: "Multiple Inheritance & Virtual Base Class",
  description: "Complete lecture on Multiple Inheritance, Diamond Problem, Virtual Base Class, and Design Philosophy",
  totalSteps: 11,
  subject: "Object Oriented Programming",
  category: "multiple-inheritance",
  estimatedTime: "12 min",
  unit: "Unit 4",
  university: "RTU",
  topics: ["Multiple Inheritance", "Diamond Problem", "Virtual Base Class", "Composition vs Inheritance", "Memory Layout"],
  audioDuration: 0,
};

// All scenes
export const AnimationSteps = MultipleInheritanceScenes;

// Parts configuration for sidebar
export const parts = [
  {
    partNumber: 1,
    name: "Basics & Problem",
    startScene: 1,
    endScene: 7,
    icon: "💎",
  },
  {
    partNumber: 2,
    name: "Solution & Design",
    startScene: 8,
    endScene: 11,
    icon: "✨",
  },
];

// Sections for navigation
export const sections = [
  { name: "Introduction", startStep: 1, endStep: 4 },
  { name: "Diamond Problem", startStep: 5, endStep: 7 },
  { name: "Virtual Base Class", startStep: 8, endStep: 9 },
  { name: "Design Philosophy", startStep: 10, endStep: 11 },
];

// Default export
export default {
  metadata,
  AnimationSteps,
  parts,
  sections,
};
