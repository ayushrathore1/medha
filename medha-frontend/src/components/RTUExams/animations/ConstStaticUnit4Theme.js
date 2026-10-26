/**
 * ConstStaticUnit4Theme - Shared Theme Constants
 * OOPS Unit 4: const and static Members in C++
 * Premium Apple Dark Theme with const/static specific colors
 */

// Apple Dark Theme System Colors for Unit 4
export const colors = {
  // Primary Colors
  primary: "#BF5AF2",      // Purple for const (locked/protected)
  secondary: "#64D2FF",    // Cyan for static (shared/connected)
  accent: "#FFD60A",       // Yellow for highlights
  success: "#30D158",      // Green for success
  danger: "#FF453A",       // Red for errors
  warning: "#FF9F0A",      // Orange for warnings
  
  // Concept-specific colors
  constColor: "#BF5AF2",   // Purple for const
  staticColor: "#64D2FF",  // Cyan for static
  classColor: "#5E5CE6",   // Indigo for class
  objectColor: "#30D158",  // Green for objects
  lockedColor: "#FF375F",  // Pink for locked/protected
  sharedColor: "#0A84FF",  // Blue for shared
  
  // Text colors
  text: "#F5F5F7",
  textSec: "#86868B",
  textMuted: "#48484A",
  
  // Code syntax colors
  keyword: "#FF79C6",
  function: "#50FA7B",
  string: "#F1FA8C",
  comment: "#6272A4",
  operator: "#FF79C6",
  
  // Background shades
  bgDark: "#000000",
  bgCard: "rgba(28, 28, 30, 0.65)",
  bgHover: "rgba(255, 255, 255, 0.08)",
};

// Container style for all scenes
export const containerStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: "2rem",
  boxSizing: "border-box",
};

// Floating particles background effect
export const floatingParticleStyle = {
  position: "absolute",
  borderRadius: "50%",
  filter: "blur(1px)",
  opacity: 0.6,
};

// Glass morphism card base style
export const glassCardBase = {
  background: "rgba(28, 28, 30, 0.65)",
  backdropFilter: "blur(25px) saturate(180%)",
  WebkitBackdropFilter: "blur(25px) saturate(180%)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  borderRadius: "24px",
  padding: "2rem",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
};

// Code block base style
export const codeBlockBase = {
  fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
  fontSize: "15px",
  lineHeight: 1.6,
  color: colors.text,
  margin: 0,
  whiteSpace: "pre-wrap",
  fontWeight: 500,
};

export default { colors, containerStyle, glassCardBase, codeBlockBase };
