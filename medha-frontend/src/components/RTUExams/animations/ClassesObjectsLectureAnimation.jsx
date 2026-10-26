/**
 * ClassesObjectsLectureAnimation.jsx
 * Orchestrator for Classes and Objects Lecture
 * 15 Scenes total
 */
import { ClassesObjectsScenes } from "./ClassesObjectsLecture";

// Metadata
export const metadata = {
  id: "classes-objects-lecture",
  title: "Classes & Objects - From Ideas to Living Systems",
  description: "Complete visual journey through Classes, Objects, Encapsulation, and OOP Philosophy in C++",
  totalSteps: 15,
  subject: "Object Oriented Programming",
  category: "classes-objects",
  estimatedTime: "15 min",
  unit: "Unit 1",
  university: "RTU",
  topics: ["Classes", "Objects", "Encapsulation", "Data Hiding", "struct vs class", "Dot Operator", "OOP Philosophy"],
  audioDuration: 0,
};

// All scenes
export const AnimationSteps = ClassesObjectsScenes;

// Parts configuration for sidebar
export const parts = [
  {
    partNumber: 1,
    name: "The Problem & Blueprint",
    startScene: 1,
    endScene: 7,
    icon: "📐",
  },
  {
    partNumber: 2,
    name: "Encapsulation & Design",
    startScene: 8,
    endScene: 15,
    icon: "🔒",
  },
];

// Sections for navigation
export const sections = [
  { name: "The Problem", startStep: 1, endStep: 2 },
  { name: "Class Blueprint", startStep: 3, endStep: 5 },
  { name: "Inside Objects", startStep: 6, endStep: 7 },
  { name: "Encapsulation", startStep: 8, endStep: 10 },
  { name: "Multiple Objects", startStep: 11, endStep: 13 },
  { name: "Philosophy", startStep: 14, endStep: 15 },
];

// Default export
export default {
  metadata,
  AnimationSteps,
  parts,
  sections,
};
