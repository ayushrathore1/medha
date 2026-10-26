/**
 * RuntimePolymorphismLectureAnimation.jsx
 * Orchestrator for Runtime Polymorphism Lecture
 * 13 Scenes total
 */
import { RuntimePolymorphismScenes } from "./RuntimePolymorphismLecture";

// Metadata
export const metadata = {
  id: "runtime-polymorphism-lecture",
  title: "Runtime Polymorphism & Function Overriding",
  description: "Complete lecture on Virtual Functions, Function Overriding, vtable/vptr, override keyword, and performance considerations",
  totalSteps: 13,
  subject: "Object Oriented Programming",
  category: "runtime-polymorphism",
  estimatedTime: "15 min",
  unit: "Unit 4",
  university: "RTU",
  topics: ["Virtual Functions", "Function Overriding", "Runtime Polymorphism", "vtable", "vptr", "override keyword", "Dynamic Binding"],
  audioDuration: 0,
};

// All scenes
export const AnimationSteps = RuntimePolymorphismScenes;

// Parts configuration for sidebar
export const parts = [
  {
    partNumber: 1,
    name: "The Problem & Fix",
    startScene: 1,
    endScene: 6,
    icon: "🎯",
  },
  {
    partNumber: 2,
    name: "Advanced Topics",
    startScene: 7,
    endScene: 13,
    icon: "⚙️",
  },
];

// Sections for navigation
export const sections = [
  { name: "Introduction", startStep: 1, endStep: 2 },
  { name: "The Problem", startStep: 3, endStep: 4 },
  { name: "The Solution", startStep: 5, endStep: 6 },
  { name: "Real World", startStep: 7, endStep: 8 },
  { name: "Rules & Safety", startStep: 9, endStep: 10 },
  { name: "Under The Hood", startStep: 11, endStep: 13 },
];

// Default export
export default {
  metadata,
  AnimationSteps,
  parts,
  sections,
};
