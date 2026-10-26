/**
 * VirtualFunctionsTheme.js
 * Theme for Virtual Functions & Operator Overloading Animation
 */

export const colors = {
  // Primary Colors
  primary: "#0A84FF",        // Blue (general)
  secondary: "#FFD60A",      // Yellow (highlight)
  accent: "#BF5AF2",         // Purple (compile-time)
  success: "#30D158",        // Green (virtual)
  danger: "#FF453A",         // Red (errors)
  warning: "#FF9F0A",        // Orange (operator)
  
  // Topic-specific colors
  compileTime: "#BF5AF2",    // Purple
  runTime: "#0A84FF",        // Blue
  operatorColor: "#FF9F0A",  // Orange
  virtualColor: "#30D158",   // Green
  pointerColor: "#64D2FF",   // Cyan
  baseClass: "#86868B",      // Gray
  derivedClass: "#5E5CE6",   // Indigo
  
  // Text colors
  text: "#F5F5F7",
  textSec: "#86868B",
  
  // Code syntax
  keyword: "#FF79C6",
  function: "#50FA7B",
  string: "#F1FA8C",
  comment: "#6272A4",
  
  // Backgrounds
  bgDark: "#000000",
  bgCard: "rgba(28, 28, 30, 0.65)",
};

export const containerStyle = {
  minHeight: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  background: `radial-gradient(ellipse at top, ${colors.primary}08 0%, transparent 50%),
               radial-gradient(ellipse at bottom, ${colors.accent}05 0%, transparent 50%),
               ${colors.bgDark}`,
  position: "relative",
  overflow: "hidden",
};

export const glassCardBase = {
  background: colors.bgCard,
  backdropFilter: "blur(25px) saturate(180%)",
  WebkitBackdropFilter: "blur(25px) saturate(180%)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  borderRadius: "24px",
  padding: "2rem",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
};
