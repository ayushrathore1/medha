/**
 * InheritanceLectureAnimation.jsx
 * Orchestrator for C++ Inheritance Lecture
 * 12 Scenes total
 */
import { InheritanceScenes } from "./InheritanceLecture";

// Metadata
export const metadata = {
  id: "inheritance-lecture",
  title: "C++ Inheritance - Why, What, and How",
  description: "Complete lecture on Inheritance - Base classes, Derived classes, Access Specifiers, Types, and Diamond Problem",
  totalSteps: 12,
  subject: "Object Oriented Programming",
  category: "cpp-inheritance",
  estimatedTime: "15 min",
  unit: "Unit 4",
  university: "RTU",
  topics: ["Inheritance", "Base Class", "Derived Class", "Access Specifiers", "IS-A Relationship", "Multiple Inheritance", "Diamond Problem"],
  audioDuration: 0,
};

// All scenes
export const AnimationSteps = InheritanceScenes;

// Parts configuration for sidebar
export const parts = [
  {
    partNumber: 1,
    name: "Why & Basics",
    startScene: 1,
    endScene: 7,
    icon: "🔗",
  },
  {
    partNumber: 2,
    name: "Advanced Topics",
    startScene: 8,
    endScene: 12,
    icon: "💎",
  },
];

// Sections for navigation
export const sections = [
  { name: "Introduction", startStep: 1, endStep: 3 },
  { name: "Base Class Concept", startStep: 4, endStep: 7 },
  { name: "Access & Modes", startStep: 8, endStep: 10 },
  { name: "Types & Diamond", startStep: 11, endStep: 12 },
];

// Default export
export default {
  metadata,
  AnimationSteps,
  parts,
  sections,
};
