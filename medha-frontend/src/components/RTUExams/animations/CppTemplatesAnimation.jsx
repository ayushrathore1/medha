/**
 * CppTemplatesAnimation - Main Entry Point (Apple Dark Theme)
 * RTU OOP Unit 5: Generic Programming & Code Reuse
 *
 * Modular Structure:
 * - Part 1 (Scenes 1-9): Basics, Syntax, Instantiation
 * - Part 2 (Scenes 10-18): Polymorphism, Specialization, STL
 * - Part 3 (Scenes 19-26): Big Picture, Philosophy, Closing
 */
import React from "react";
import { colors, containerStyle } from "./CppTemplatesTheme";
import {
  AnimationStepsPart1,
  GlassCard,
  CodeBlock,
} from "./CppTemplatesAnimationPart1";
import { AnimationStepsPart2 } from "./CppTemplatesAnimationPart2";
import { AnimationStepsPart3 } from "./CppTemplatesAnimationPart3";

// METADATA
export const metadata = {
  id: "cpp-templates",
  title: "Templates in C++",
  description: "Master generic programming with zero-cost abstractions.",
  totalSteps: 26,
  subject: "Object Oriented Programming",
  category: "cpp-templates",
  estimatedTime: "18 min",
  unit: "Unit 5",
  university: "RTU",
};

// Re-export shared components for external use
export { colors, containerStyle, GlassCard, CodeBlock };

// COMBINING ALL STEPS WITH TITLES FOR SIDEBAR
export const AnimationSteps = [
  ...AnimationStepsPart1,
  ...AnimationStepsPart2,
  ...AnimationStepsPart3,
];

export default { metadata, AnimationSteps };
