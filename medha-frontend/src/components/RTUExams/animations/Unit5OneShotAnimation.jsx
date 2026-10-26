/**
 * Unit5OneShotAnimation - Main Entry Point
 * RTU OOP Unit 5: Exception Handling, Templates, Stream Classes & File Handling
 * 
 * REORDERED: Exception Handling first, then Templates
 * 
 * AUDIO SYNC: Based on actual transcript timestamps (9:11 = 551 seconds total)
 * Slides are evenly distributed within each section's audio duration.
 */
import React from "react";
import { colors, containerStyle } from "./TemplatesUnit5Theme";
import {
  AnimationStepsPart1,
  GlassCard,
  CodeBlock,
} from "./TemplatesOneShotPart1";
import { AnimationStepsPart2 } from "./TemplatesOneShotPart2";
import { AnimationStepsPart3 } from "./TemplatesOneShotPart3";
import { AnimationStepsPart4 } from "./ExceptionHandlingPart1";
import { AnimationStepsPart5 } from "./ExceptionHandlingPart2";
import { AnimationStepsPart6 } from "./StreamClassesPart1";
import { AnimationStepsPart7 } from "./StreamClassesPart2";
import { AnimationStepsPart8 } from "./FileHandlingPart1";
import { AnimationStepsPart9 } from "./FileHandlingPart2";

// ============================================
// METADATA
// ============================================
export const metadata = {
  id: "unit5-oneshot",
  title: "Unit 5 Complete One-Shot",
  description: "Master Exception Handling, Templates, Stream Classes & File Handling in C++",
  totalSteps: 104,
  subject: "Object Oriented Programming",
  category: "cpp-unit5-oneshot",
  estimatedTime: "10 min",
  unit: "Unit 5",
  university: "RTU",
  topics: ["Exception Handling", "Templates", "Stream Classes", "File Handling"],
  audioDuration: 551, // 9:11
};

// Re-export shared components for external use
export { colors, containerStyle, GlassCard, CodeBlock };

// ============================================
// COMBINING ALL ANIMATION STEPS (REORDERED)
// Exception Handling FIRST, then Templates
// ============================================
export const AnimationSteps = [
  // Part 1: Exception Handling Basics (Scenes 1-13)
  ...AnimationStepsPart4,
  
  // Part 2: Exception Handling Advanced (Scenes 14-26)
  ...AnimationStepsPart5,
  
  // Part 3: Templates Basics (Scenes 27-35)
  ...AnimationStepsPart1,
  
  // Part 4: Templates Advanced (Scenes 36-44)
  ...AnimationStepsPart2,
  
  // Part 5: Templates Big Picture (Scenes 45-52)
  ...AnimationStepsPart3,
  
  // Part 6: Stream Classes Basics (Scenes 53-65)
  ...AnimationStepsPart6,
  
  // Part 7: Stream Classes Advanced (Scenes 66-78)
  ...AnimationStepsPart7,
  
  // Part 8: File Handling Basics (Scenes 79-91)
  ...AnimationStepsPart8,
  
  // Part 9: File Handling Advanced (Scenes 92-104)
  ...AnimationStepsPart9,
];

// ============================================
// PARTS (for multi-part audio support)
// Each part has its own audio file
// ============================================
export const parts = [
  { partNumber: 1, name: "Exception Handling", startScene: 1, endScene: 26, icon: "🛡️", color: colors.danger },
  { partNumber: 2, name: "Templates", startScene: 27, endScene: 52, icon: "📐", color: colors.primary },
  { partNumber: 3, name: "Stream Classes", startScene: 53, endScene: 78, icon: "🌊", color: colors.success },
  { partNumber: 4, name: "File Handling", startScene: 79, endScene: 104, icon: "📁", color: colors.secondary },
];
// ============================================
// SECTION MARKERS (for navigation)
// Each section has a defined audio range
// ============================================
export const sections = [
  { 
    name: "Intro", 
    startScene: 1, 
    endScene: 1,
    color: colors.accent,
    icon: "🎬",
    audioStart: 0,      // 0:00
    audioEnd: 38,       // 0:38
  },
  { 
    name: "Exception Handling", 
    startScene: 2, 
    endScene: 26,
    color: colors.danger,
    icon: "🛡️",
    audioStart: 38,     // 0:38
    audioEnd: 184,      // 3:04
  },
  { 
    name: "Templates", 
    startScene: 27, 
    endScene: 52,
    color: colors.primary,
    icon: "📐",
    audioStart: 184,    // 3:04
    audioEnd: 304,      // 5:04
  },
  { 
    name: "Stream Classes", 
    startScene: 53, 
    endScene: 78,
    color: colors.success,
    icon: "🌊",
    audioStart: 304,    // 5:04
    audioEnd: 394,      // 6:34
  },
  { 
    name: "File Handling", 
    startScene: 79, 
    endScene: 104,
    color: colors.secondary,
    icon: "📁",
    audioStart: 394,    // 6:34
    audioEnd: 551,      // 9:11 (end)
  },
];

// ============================================
// AUDIO SYNC FUNCTIONS
// Evenly distributes slides within each section's audio duration
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
  // Find which section this audio time belongs to
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
  if (audioTime >= 551) return 104;
  return 1;
};

export default { metadata, AnimationSteps, parts, sections, getSceneAudioTime, getSceneFromAudioTime };
