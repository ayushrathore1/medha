/**
 * AbstractClassLectureAnimation.jsx
 * Orchestrator for Abstract Class Lecture
 * 11 Scenes total
 */
import { AbstractClassScenes } from "./AbstractClassLecture";

// Metadata
export const metadata = {
  id: "abstract-class-lecture",
  title: "Abstract Class & Pure Virtual Functions",
  description: "Complete lecture on Abstract Classes, Pure Virtual Functions, Contracts, Polymorphism, and Virtual Destructors",
  totalSteps: 11,
  subject: "Object Oriented Programming",
  category: "abstract-class",
  estimatedTime: "12 min",
  unit: "Unit 4",
  university: "RTU",
  topics: ["Abstract Class", "Pure Virtual Function", "Polymorphism", "Virtual Destructor", "Interface Design"],
  audioDuration: 0,
};

// All scenes
export const AnimationSteps = AbstractClassScenes;

// Parts configuration for sidebar
export const parts = [
  {
    partNumber: 1,
    name: "Problem & Concept",
    startScene: 1,
    endScene: 6,
    icon: "📜",
  },
  {
    partNumber: 2,
    name: "Implementation & Design",
    startScene: 7,
    endScene: 11,
    icon: "🏗️",
  },
];

// Sections for navigation
export const sections = [
  { name: "Introduction", startStep: 1, endStep: 2 },
  { name: "The Problem", startStep: 3, endStep: 4 },
  { name: "Pure Virtual", startStep: 5, endStep: 6 },
  { name: "Implementation", startStep: 7, endStep: 9 },
  { name: "Big Picture", startStep: 10, endStep: 11 },
];

// Default export
export default {
  metadata,
  AnimationSteps,
  parts,
  sections,
};
