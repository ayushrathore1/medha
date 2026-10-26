/**
 * AccessSpecifiersLectureAnimation.jsx
 * Orchestrator for Access Specifiers, Member Functions & Array of Objects Lecture
 * 15 Scenes total
 */
import { AccessSpecifiersScenes } from "./AccessSpecifiersLecture";

// Metadata
export const metadata = {
  id: "access-specifiers-lecture",
  title: "Access Specifiers, Member Functions & Array of Objects",
  description: "Complete visual journey through Access Specifiers, Encapsulation, Scope Resolution, and Array of Objects in C++",
  totalSteps: 15,
  subject: "Object Oriented Programming",
  category: "access-specifiers",
  estimatedTime: "15 min",
  unit: "Unit 1",
  university: "RTU",
  topics: ["Access Specifiers", "public", "private", "Encapsulation", "Scope Resolution", "Header/Source Split", "Array of Objects", "Member Functions"],
  audioDuration: 0,
};

// All scenes
export const AnimationSteps = AccessSpecifiersScenes;

// Parts configuration for sidebar
export const parts = [
  {
    partNumber: 1,
    name: "Access & Encapsulation",
    startScene: 1,
    endScene: 8,
    icon: "🔒",
  },
  {
    partNumber: 2,
    name: "Array of Objects",
    startScene: 9,
    endScene: 15,
    icon: "📦",
  },
];

// Sections for navigation
export const sections = [
  { name: "The Problem", startStep: 1, endStep: 2 },
  { name: "Access Specifiers", startStep: 3, endStep: 4 },
  { name: "Code Organization", startStep: 5, endStep: 8 },
  { name: "Array of Objects", startStep: 9, endStep: 12 },
  { name: "Architecture", startStep: 13, endStep: 15 },
];

// Default export
export default {
  metadata,
  AnimationSteps,
  parts,
  sections,
};
