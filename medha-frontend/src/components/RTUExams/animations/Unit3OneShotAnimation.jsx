/**
 * Unit3OneShotAnimation - Main Entry Point
 * RTU OOP Unit 3: Inheritance, Polymorphism, Virtual Base Class, Abstract Classes
 * 
 * Structure:
 * - Part 1 (Scenes 1-12): C++ Inheritance
 * - Part 2 (Scenes 13-25): Runtime Polymorphism
 * - Part 3 (Scenes 26-36): Multiple Inheritance & Virtual Base Class
 * - Part 4 (Scenes 37-47): Abstract Class & Pure Virtual Functions
 */
import React from "react";
import { colors, containerStyle } from "./VirtualFunctionsTheme";

// Import scenes from existing lectures
import { InheritanceScenes } from "./InheritanceLecture";
import { RuntimePolymorphismScenes } from "./RuntimePolymorphismLecture";
import { MultipleInheritanceScenes } from "./MultipleInheritanceLecture";
import { AbstractClassScenes } from "./AbstractClassLecture";

// Re-export shared components
export { colors, containerStyle };

// ============================================
// METADATA
// ============================================
export const metadata = {
  id: "unit3-oneshot",
  title: "Unit 3 Complete One-Shot",
  description: "Master C++ Inheritance, Runtime Polymorphism, Virtual Base Class & Abstract Classes",
  totalSteps: 47,
  subject: "Object Oriented Programming",
  category: "cpp-unit3-oneshot",
  estimatedTime: "20 min",
  unit: "Unit 3",
  university: "RTU",
  topics: ["Inheritance", "Runtime Polymorphism", "Virtual Functions", "Multiple Inheritance", "Diamond Problem", "Virtual Base Class", "Abstract Class", "Pure Virtual Functions"],
  audioDuration: 0, // Will be set when audio is synced
};

// ============================================
// COMBINING ALL ANIMATION STEPS
// ============================================
export const AnimationSteps = [
  // Part 1: C++ Inheritance (Scenes 1-12)
  ...InheritanceScenes,
  
  // Part 2: Runtime Polymorphism (Scenes 13-25)
  ...RuntimePolymorphismScenes,
  
  // Part 3: Multiple Inheritance & Virtual Base Class (Scenes 26-36)
  ...MultipleInheritanceScenes,
  
  // Part 4: Abstract Class & Pure Virtual Functions (Scenes 37-47)
  ...AbstractClassScenes,
];

// ============================================
// PARTS (for multi-part audio support)
// Each part corresponds to a lecture with its own audio file
// ============================================
export const parts = [
  { 
    partNumber: 1, 
    name: "C++ Inheritance", 
    startScene: 1, 
    endScene: 12, 
    icon: "🧬",
    color: colors.primary,
  },
  { 
    partNumber: 2, 
    name: "Runtime Polymorphism", 
    startScene: 13, 
    endScene: 25, 
    icon: "🎭",
    color: colors.virtualColor,
  },
  { 
    partNumber: 3, 
    name: "Multiple Inheritance", 
    startScene: 26, 
    endScene: 36, 
    icon: "💎",
    color: colors.warning,
  },
  { 
    partNumber: 4, 
    name: "Abstract Classes", 
    startScene: 37, 
    endScene: 47, 
    icon: "📜",
    color: colors.success,
  },
];

// ============================================
// SECTION MARKERS (for navigation)
// ============================================
export const sections = [
  // Part 1: Inheritance
  { 
    name: "Why Inheritance", 
    startStep: 1, 
    endStep: 4,
    color: colors.primary,
    icon: "🧬",
  },
  { 
    name: "Types of Inheritance", 
    startStep: 5, 
    endStep: 9,
    color: colors.primary,
    icon: "📊",
  },
  { 
    name: "Access & Diamond", 
    startStep: 10, 
    endStep: 12,
    color: colors.primary,
    icon: "🔐",
  },
  // Part 2: Runtime Polymorphism
  { 
    name: "Virtual Functions", 
    startStep: 13, 
    endStep: 18,
    color: colors.virtualColor,
    icon: "✨",
  },
  { 
    name: "Real World Examples", 
    startStep: 19, 
    endStep: 22,
    color: colors.virtualColor,
    icon: "🎮",
  },
  { 
    name: "vtable & Design", 
    startStep: 23, 
    endStep: 25,
    color: colors.virtualColor,
    icon: "⚙️",
  },
  // Part 3: Multiple Inheritance
  { 
    name: "Multiple Inheritance Basics", 
    startStep: 26, 
    endStep: 30,
    color: colors.warning,
    icon: "💎",
  },
  { 
    name: "Diamond Problem", 
    startStep: 31, 
    endStep: 33,
    color: colors.danger,
    icon: "⚠️",
  },
  { 
    name: "Virtual Base Class", 
    startStep: 34, 
    endStep: 36,
    color: colors.success,
    icon: "✓",
  },
  // Part 4: Abstract Classes
  { 
    name: "Pure Virtual Functions", 
    startStep: 37, 
    endStep: 42,
    color: colors.accent,
    icon: "📜",
  },
  { 
    name: "Polymorphism Power", 
    startStep: 43, 
    endStep: 45,
    color: colors.accent,
    icon: "⚡",
  },
  { 
    name: "Design Philosophy", 
    startStep: 46, 
    endStep: 47,
    color: colors.accent,
    icon: "🏛️",
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
  return Math.min(Math.max(sceneEstimate, 1), 47);
};

export default { 
  metadata, 
  AnimationSteps, 
  parts, 
  sections, 
  getSceneAudioTime, 
  getSceneFromAudioTime 
};
