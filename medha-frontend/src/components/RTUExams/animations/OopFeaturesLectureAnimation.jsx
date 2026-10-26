/**
 * OopFeaturesLectureAnimation.jsx
 * Orchestrator for Features of OOP Lecture
 * 10 Scenes total
 */
import { OopFeaturesScenes } from "./OopFeaturesLecture";

// Metadata
export const metadata = {
  id: "oop-features-lecture",
  title: "Features of OOP - From Chaos to a City",
  description: "Complete visual journey through the four pillars of OOP - Encapsulation, Abstraction, Inheritance, and Polymorphism",
  totalSteps: 10,
  subject: "Object Oriented Programming",
  category: "oop-features",
  estimatedTime: "12 min",
  unit: "Unit 4",
  university: "RTU",
  topics: ["Encapsulation", "Abstraction", "Inheritance", "Polymorphism", "Data Hiding", "OOP Philosophy"],
  audioDuration: 0,
};

// All scenes
export const AnimationSteps = OopFeaturesScenes;

// Parts configuration for sidebar
export const parts = [
  {
    partNumber: 1,
    name: "The Journey",
    startScene: 1,
    endScene: 5,
    icon: "🏙️",
  },
  {
    partNumber: 2,
    name: "The Pillars",
    startScene: 6,
    endScene: 10,
    icon: "🏛️",
  },
];

// Sections for navigation
export const sections = [
  { name: "Introduction", startStep: 1, endStep: 3 },
  { name: "Encapsulation & Hiding", startStep: 4, endStep: 5 },
  { name: "Abstraction & Inheritance", startStep: 6, endStep: 7 },
  { name: "Polymorphism & Philosophy", startStep: 8, endStep: 10 },
];

// Default export
export default {
  metadata,
  AnimationSteps,
  parts,
  sections,
};
