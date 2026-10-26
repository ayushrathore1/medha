/**
 * Unit1OneShotAnimation - Main Entry Point
 * RTU OOP Unit 1: OOP Introduction, Features, Classes & Objects, Access Specifiers
 *
 * Structure:
 * - Part 1 (Scenes 1-13): OOP Introduction & Programming Paradigms
 * - Part 2 (Scenes 14-23): Features of OOP (Four Pillars)
 * - Part 3 (Scenes 24-38): Classes & Objects
 * - Part 4 (Scenes 39-53): Access Specifiers & Array of Objects
 */
import React from "react";
import { colors, containerStyle } from "./VirtualFunctionsTheme";

// Import scenes from existing lectures
import { OopIntroScenes } from "./OopIntroLecture";
import { OopFeaturesScenes } from "./OopFeaturesLecture";
import { ClassesObjectsScenes } from "./ClassesObjectsLecture";
import { AccessSpecifiersScenes } from "./AccessSpecifiersLecture";

// Re-export shared components
export { colors, containerStyle };

// ============================================
// METADATA
// ============================================
export const metadata = {
  id: "unit1-oneshot",
  title: "Unit 1 Complete One-Shot",
  description:
    "Master OOP Introduction, Four Pillars, Classes & Objects, Access Specifiers",
  totalSteps: 53,
  subject: "Object Oriented Programming",
  category: "cpp-unit1-oneshot",
  estimatedTime: "25 min",
  unit: "Unit 1",
  university: "RTU",
  topics: [
    "OOP Introduction",
    "Programming Paradigms",
    "Encapsulation",
    "Abstraction",
    "Inheritance",
    "Polymorphism",
    "Classes",
    "Objects",
    "Access Specifiers",
    "Array of Objects",
  ],
  audioDuration: 0, // Will be set when audio is synced
};

// ============================================
// COMBINING ALL ANIMATION STEPS
// ============================================
export const AnimationSteps = [
  // Part 1: OOP Introduction (Scenes 1-13)
  ...OopIntroScenes,

  // Part 2: Features of OOP (Scenes 14-23)
  ...OopFeaturesScenes,

  // Part 3: Classes & Objects (Scenes 24-38)
  ...ClassesObjectsScenes,

  // Part 4: Access Specifiers & Array of Objects (Scenes 39-53)
  ...AccessSpecifiersScenes,
];

// ============================================
// PARTS (for multi-part audio support)
// Each part corresponds to a lecture with its own audio file
// ============================================
export const parts = [
  {
    partNumber: 1,
    name: "OOP Introduction",
    startScene: 1,
    endScene: 13,
    icon: "🎯",
    color: colors.primary,
  },
  {
    partNumber: 2,
    name: "Features of OOP",
    startScene: 14,
    endScene: 23,
    icon: "🏛️",
    color: colors.success,
  },
  {
    partNumber: 3,
    name: "Classes & Objects",
    startScene: 24,
    endScene: 38,
    icon: "📦",
    color: colors.virtualColor,
  },
  {
    partNumber: 4,
    name: "Access Specifiers",
    startScene: 39,
    endScene: 53,
    icon: "🔒",
    color: colors.warning,
  },
];

// ============================================
// SECTION MARKERS (for navigation)
// ============================================
export const sections = [
  // Part 1: OOP Introduction
  {
    name: "Programming Paradigms",
    startStep: 1,
    endStep: 5,
    color: colors.primary,
    icon: "🎯",
  },
  {
    name: "Procedural Problems",
    startStep: 6,
    endStep: 9,
    color: colors.primary,
    icon: "⚠️",
  },
  {
    name: "OOP Philosophy",
    startStep: 10,
    endStep: 13,
    color: colors.primary,
    icon: "💡",
  },
  // Part 2: Features of OOP
  {
    name: "Chaos to Order",
    startStep: 14,
    endStep: 16,
    color: colors.success,
    icon: "🏙️",
  },
  {
    name: "Four Pillars",
    startStep: 17,
    endStep: 21,
    color: colors.success,
    icon: "🏛️",
  },
  {
    name: "OOP Architecture",
    startStep: 22,
    endStep: 23,
    color: colors.success,
    icon: "🏗️",
  },
  // Part 3: Classes & Objects
  {
    name: "Blueprint Concept",
    startStep: 24,
    endStep: 28,
    color: colors.virtualColor,
    icon: "📐",
  },
  {
    name: "Object Creation",
    startStep: 29,
    endStep: 33,
    color: colors.virtualColor,
    icon: "✨",
  },
  {
    name: "struct vs class",
    startStep: 34,
    endStep: 38,
    color: colors.virtualColor,
    icon: "⚖️",
  },
  // Part 4: Access Specifiers
  {
    name: "Access Control",
    startStep: 39,
    endStep: 44,
    color: colors.warning,
    icon: "🔒",
  },
  {
    name: "Code Organization",
    startStep: 45,
    endStep: 48,
    color: colors.warning,
    icon: "📁",
  },
  {
    name: "Array of Objects",
    startStep: 49,
    endStep: 53,
    color: colors.warning,
    icon: "📦",
  },
];

// ============================================
// AUDIO SYNC FUNCTIONS
// ============================================

// Get audio time for a scene (evenly distributed within section)
export const getSceneAudioTime = (sceneNumber) => {
  for (const section of sections) {
    if (sceneNumber >= section.startStep && sceneNumber <= section.endStep) {
      const scenesInSection = section.endStep - section.startStep + 1;
      const sceneIndex = sceneNumber - section.startStep;
      // Each scene gets equal time - placeholder until actual audio timings
      return sceneIndex * 30; // 30 seconds per scene estimate
    }
  }
  return 0;
};

// Get scene number from audio time
export const getSceneFromAudioTime = (audioTime) => {
  // Placeholder - will be calculated based on actual audio durations
  const sceneEstimate = Math.floor(audioTime / 30) + 1;
  return Math.min(Math.max(sceneEstimate, 1), 53);
};

export default {
  metadata,
  AnimationSteps,
  parts,
  sections,
  getSceneAudioTime,
  getSceneFromAudioTime,
};
