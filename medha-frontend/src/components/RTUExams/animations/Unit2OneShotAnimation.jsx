/**
 * Unit2OneShotAnimation - Main Entry Point
 * RTU OOP Unit 2: Functions, Memory, References, this Pointer, Constructors, Friend Functions
 *
 * Structure:
 * - Part 1 (Scenes 1-24): Versatile Functions (Overloading, Default Args, Inline)
 * - Part 2 (Scenes 25-41): Constructor and Its Types
 * - Part 3 (Scenes 42-55): C++ Memory & References
 * - Part 4 (Scenes 56-74): this Pointer, Constructors & Friend Functions
 */
import React from "react";
import { colors, containerStyle } from "./VirtualFunctionsTheme";

// Import scenes from existing lectures
import { VersatileScenesPart1 as VersatileFunctionsScenesPart1 } from "./VersatileFunctionsLecture";
import { VersatileScenesPart2 as VersatileFunctionsScenesPart2 } from "./VersatileFunctionsLecturePart2";
import { ConstructorScenes } from "./ConstructorLecture";
import { RefScenesPart1 as CppReferencesScenes } from "./CppReferencesLecture";
import { ThisPointerScenesPart1 as ThisPointerScenes } from "./ThisPointerLecture";

// Re-export shared components
export { colors, containerStyle };

// ============================================
// METADATA
// ============================================
export const metadata = {
  id: "unit2-oneshot",
  title: "Unit 2 Complete One-Shot",
  description:
    "Master Versatile Functions, Constructors, C++ Memory & References, this Pointer & Friend Functions",
  totalSteps: 74,
  subject: "Object Oriented Programming",
  category: "cpp-unit2-oneshot",
  estimatedTime: "35 min",
  unit: "Unit 2",
  university: "RTU",
  topics: [
    "Function Overloading",
    "Default Arguments",
    "Inline Functions",
    "Constructors",
    "Copy Constructor",
    "References",
    "Pointers",
    "this Pointer",
    "Friend Functions",
  ],
  audioDuration: 0, // Will be set when audio is synced
};

// ============================================
// COMBINING ALL ANIMATION STEPS
// ============================================
export const AnimationSteps = [
  // Part 1: Versatile Functions (Scenes 1-24)
  ...VersatileFunctionsScenesPart1,
  ...VersatileFunctionsScenesPart2,

  // Part 2: Constructor and Its Types (Scenes 25-41)
  ...ConstructorScenes,

  // Part 3: C++ Memory & References (Scenes 42-55)
  ...CppReferencesScenes,

  // Part 4: this Pointer, Constructors & Friend Functions (Scenes 56-74)
  ...ThisPointerScenes,
];

// ============================================
// PARTS (for multi-part audio support)
// Each part corresponds to a lecture with its own audio file
// ============================================
export const parts = [
  {
    partNumber: 1,
    name: "Versatile Functions",
    startScene: 1,
    endScene: 24,
    icon: "🔀",
    color: colors.primary,
  },
  {
    partNumber: 2,
    name: "Constructor & Its Types",
    startScene: 25,
    endScene: 41,
    icon: "🏗️",
    color: colors.warning,
  },
  {
    partNumber: 3,
    name: "C++ Memory & References",
    startScene: 42,
    endScene: 55,
    icon: "📍",
    color: colors.success,
  },
  {
    partNumber: 4,
    name: "this Pointer & Friends",
    startScene: 56,
    endScene: 74,
    icon: "👈",
    color: colors.virtualColor,
  },
];

// ============================================
// SECTION MARKERS (for navigation)
// ============================================
export const sections = [
  // Part 1: Versatile Functions
  {
    name: "Function Overloading",
    startStep: 1,
    endStep: 8,
    color: colors.primary,
    icon: "🔀",
  },
  {
    name: "Default Arguments",
    startStep: 9,
    endStep: 12,
    color: colors.primary,
    icon: "⚙️",
  },
  {
    name: "Inline Functions",
    startStep: 13,
    endStep: 20,
    color: colors.primary,
    icon: "⚡",
  },
  {
    name: "Performance Summary",
    startStep: 21,
    endStep: 24,
    color: colors.primary,
    icon: "📊",
  },
  // Part 2: Constructors
  {
    name: "Constructor Intro",
    startStep: 25,
    endStep: 29,
    color: colors.warning,
    icon: "🏗️",
  },
  {
    name: "Constructor Types",
    startStep: 30,
    endStep: 35,
    color: colors.warning,
    icon: "⚙️",
  },
  {
    name: "Copy & Memory",
    startStep: 36,
    endStep: 41,
    color: colors.warning,
    icon: "🔄",
  },
  // Part 3: C++ References
  {
    name: "Pointers vs References",
    startStep: 42,
    endStep: 47,
    color: colors.success,
    icon: "📍",
  },
  {
    name: "Reference Usage",
    startStep: 48,
    endStep: 52,
    color: colors.success,
    icon: "🔗",
  },
  {
    name: "Memory Patterns",
    startStep: 53,
    endStep: 55,
    color: colors.success,
    icon: "💾",
  },
  // Part 4: this Pointer & Friends
  {
    name: "this Pointer",
    startStep: 56,
    endStep: 62,
    color: colors.virtualColor,
    icon: "👈",
  },
  {
    name: "Advanced Constructors",
    startStep: 63,
    endStep: 68,
    color: colors.virtualColor,
    icon: "🏗️",
  },
  {
    name: "Friend Functions",
    startStep: 69,
    endStep: 74,
    color: colors.danger,
    icon: "🤝",
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
  return Math.min(Math.max(sceneEstimate, 1), 74);
};

export default {
  metadata,
  AnimationSteps,
  parts,
  sections,
  getSceneAudioTime,
  getSceneFromAudioTime,
};

