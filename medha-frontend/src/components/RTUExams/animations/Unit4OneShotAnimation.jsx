/**
 * Unit4OneShotAnimation - Main Entry Point
 * RTU OOP Unit 4: const, static, Polymorphism, Virtual Functions
 * 
 * Structure:
 * - Part 1 (Scenes 1-13): const data members, const functions
 * - Part 2 (Scenes 14-26): static data members, static functions  
 * - Part 3 (Scenes 27-39): Polymorphism, Operator Overloading
 * - Part 4 (Scenes 40-52): Virtual Functions, Dynamic Binding
 */
import React from "react";
import { colors, containerStyle } from "./ConstStaticUnit4Theme";
import {
  AnimationStepsPart1,
  GlassCard,
  CodeBlock,
} from "./ConstStaticPart1";
import { AnimationStepsPart2 } from "./ConstStaticPart2";
import { AnimationStepsPart3 } from "./PolymorphismPart3";
import { AnimationStepsPart4 } from "./PolymorphismPart4";

// ============================================
// METADATA
// ============================================
export const metadata = {
  id: "unit4-oneshot",
  title: "Unit 4 Complete One-Shot",
  description: "Master const, static, Polymorphism, Operator Overloading, Virtual Functions & Dynamic Binding",
  totalSteps: 52,
  subject: "Object Oriented Programming",
  category: "cpp-unit4-oneshot",
  estimatedTime: "15 min",
  unit: "Unit 4",
  university: "RTU",
  topics: ["const Members", "static Members", "Polymorphism", "Operator Overloading", "Virtual Functions", "Dynamic Binding"],
  audioDuration: 780, // ~13 min estimated
};

// Re-export shared components for external use
export { colors, containerStyle, GlassCard, CodeBlock };

// ============================================
// COMBINING ALL ANIMATION STEPS
// ============================================
export const AnimationSteps = [
  // Part 1: const Members (Scenes 1-13)
  ...AnimationStepsPart1,
  
  // Part 2: static Members (Scenes 14-26)
  ...AnimationStepsPart2,
  
  // Part 3: Polymorphism & Operator Overloading (Scenes 27-39)
  ...AnimationStepsPart3,
  
  // Part 4: Virtual Functions & Dynamic Binding (Scenes 40-52)
  ...AnimationStepsPart4,
];

// ============================================
// PARTS (for multi-part audio support)
// Each part has its own audio file
// ============================================
export const parts = [
  { partNumber: 1, name: "const & static Members", startScene: 1, endScene: 26, icon: "🔒", color: colors.constColor },
  { partNumber: 2, name: "Polymorphism", startScene: 27, endScene: 52, icon: "🔀", color: colors.primary },
];

// ============================================
// SECTION MARKERS (for navigation)
// ============================================
export const sections = [
  { 
    name: "Intro", 
    startScene: 1, 
    endScene: 1,
    color: colors.accent,
    icon: "🎬",
    audioStart: 0,
    audioEnd: 30,
  },
  { 
    name: "const Data Members", 
    startScene: 2, 
    endScene: 8,
    color: colors.constColor,
    icon: "🔒",
    audioStart: 30,
    audioEnd: 150,
  },
  { 
    name: "const Functions", 
    startScene: 9, 
    endScene: 13,
    color: colors.constColor,
    icon: "🛡️",
    audioStart: 150,
    audioEnd: 240,
  },
  { 
    name: "static Data Members", 
    startScene: 14, 
    endScene: 21,
    color: colors.staticColor,
    icon: "🔗",
    audioStart: 240,
    audioEnd: 360,
  },
  { 
    name: "static Summary", 
    startScene: 22, 
    endScene: 26,
    color: colors.staticColor,
    icon: "📋",
    audioStart: 360,
    audioEnd: 420,
  },
  { 
    name: "Polymorphism Intro", 
    startScene: 27, 
    endScene: 30,
    color: colors.primary,
    icon: "🔀",
    audioStart: 420,
    audioEnd: 480,
  },
  { 
    name: "Operator Overloading", 
    startScene: 31, 
    endScene: 39,
    color: colors.success,
    icon: "➕",
    audioStart: 480,
    audioEnd: 580,
  },
  { 
    name: "Virtual Functions", 
    startScene: 40, 
    endScene: 47,
    color: colors.warning,
    icon: "✨",
    audioStart: 580,
    audioEnd: 680,
  },
  { 
    name: "Dynamic Binding", 
    startScene: 48, 
    endScene: 52,
    color: colors.accent,
    icon: "⚙️",
    audioStart: 680,
    audioEnd: 780,
  },
];

// ============================================
// AUDIO SYNC FUNCTIONS
// ============================================

// Get audio time for a scene (evenly distributed within section)
export const getSceneAudioTime = (sceneNumber) => {
  for (const section of sections) {
    if (sceneNumber >= section.startScene && sceneNumber <= section.endScene) {
      const scenesInSection = section.endScene - section.startScene + 1;
      const sectionDuration = section.audioEnd - section.audioStart;
      const timePerScene = sectionDuration / scenesInSection;
      const sceneIndex = sceneNumber - section.startScene;
      return section.audioStart + (sceneIndex * timePerScene);
    }
  }
  return 0;
};

// Get scene number from audio time
export const getSceneFromAudioTime = (audioTime) => {
  for (const section of sections) {
    if (audioTime >= section.audioStart && audioTime < section.audioEnd) {
      const scenesInSection = section.endScene - section.startScene + 1;
      const sectionDuration = section.audioEnd - section.audioStart;
      const timeInSection = audioTime - section.audioStart;
      const timePerScene = sectionDuration / scenesInSection;
      const sceneIndex = Math.floor(timeInSection / timePerScene);
      return Math.min(section.startScene + sceneIndex, section.endScene);
    }
  }
  // If past the last section, return last scene
  if (audioTime >= 780) return 52;
  return 1;
};

export default { metadata, AnimationSteps, parts, sections, getSceneAudioTime, getSceneFromAudioTime };
