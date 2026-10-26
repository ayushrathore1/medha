/**
 * OopIntroLectureAnimation.jsx
 * Orchestrator for OOP Introduction Lecture
 * 13 Scenes total
 */
import { OopIntroScenes } from "./OopIntroLecture";

// Metadata
export const metadata = {
  id: "oop-intro-lecture",
  title: "OOP Introduction & Programming Paradigms",
  description: "Complete introduction to Object Oriented Programming - Why OOP, Programming Paradigms, Procedural Problems, and Encapsulation",
  totalSteps: 13,
  subject: "Object Oriented Programming",
  category: "oop-introduction",
  estimatedTime: "15 min",
  unit: "Unit 4",
  university: "RTU",
  topics: ["Programming Paradigms", "Procedural Programming", "OOP Introduction", "Encapsulation", "Data Hiding"],
  audioDuration: 0,
};

// All scenes
export const AnimationSteps = OopIntroScenes;

// Parts configuration for sidebar
export const parts = [
  {
    partNumber: 1,
    name: "The Problem",
    startScene: 1,
    endScene: 8,
    icon: "🔓",
  },
  {
    partNumber: 2,
    name: "The Solution",
    startScene: 9,
    endScene: 13,
    icon: "🔐",
  },
];

// Sections for navigation
export const sections = [
  { name: "Introduction", startStep: 1, endStep: 3 },
  { name: "Paradigms", startStep: 4, endStep: 5 },
  { name: "Procedural Problems", startStep: 6, endStep: 8 },
  { name: "OOP Solution", startStep: 9, endStep: 12 },
  { name: "What's Next", startStep: 13, endStep: 13 },
];

// Default export
export default {
  metadata,
  AnimationSteps,
  parts,
  sections,
};
