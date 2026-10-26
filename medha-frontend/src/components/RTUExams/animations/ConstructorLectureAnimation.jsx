/**
 * ConstructorLectureAnimation.jsx
 * Orchestrator for Constructor and Its Types Lecture
 * 17 Scenes total
 */
import { ConstructorScenes } from "./ConstructorLecture";

// Metadata
export const metadata = {
  id: "constructor-lecture",
  title: "Constructor and Its Types - The Birth Protocol",
  description: "Complete visual journey through Default, Parameterized, and Copy Constructors in C++",
  totalSteps: 17,
  subject: "Object Oriented Programming",
  category: "constructors",
  estimatedTime: "18 min",
  unit: "Unit 1",
  university: "RTU",
  topics: ["Constructor", "Default Constructor", "Parameterized Constructor", "Copy Constructor", "Shallow Copy", "Deep Copy", "Constructor Overloading"],
  audioDuration: 0,
};

// All scenes
export const AnimationSteps = ConstructorScenes;

// Parts configuration for sidebar
export const parts = [
  {
    partNumber: 1,
    name: "The Birth Problem",
    startScene: 1,
    endScene: 5,
    icon: "⚠️",
  },
  {
    partNumber: 2,
    name: "Constructor Types",
    startScene: 6,
    endScene: 10,
    icon: "⚙️",
  },
  {
    partNumber: 3,
    name: "Copy Constructor & Memory",
    startScene: 11,
    endScene: 17,
    icon: "🔄",
  },
];

// Sections for navigation
export const sections = [
  { name: "Dangerous Birth", startStep: 1, endStep: 3 },
  { name: "Default Constructor", startStep: 4, endStep: 5 },
  { name: "Multiple Objects", startStep: 6, endStep: 7 },
  { name: "Parameterized", startStep: 8, endStep: 10 },
  { name: "Copy Constructor", startStep: 11, endStep: 14 },
  { name: "Memory Management", startStep: 15, endStep: 17 },
];

// Default export
export default {
  metadata,
  AnimationSteps,
  parts,
  sections,
};
