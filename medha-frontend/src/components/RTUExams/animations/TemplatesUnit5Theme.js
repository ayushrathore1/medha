/**
 * TemplatesUnit5Theme - Shared Theme Constants
 * OOPS Unit 5: Templates, Exception Handling, Stream Classes
 * Premium Apple Dark Theme with C++ specific colors
 */

// Apple Dark Theme System Colors
export const colors = {
  // Primary Colors
  primary: "#0A84FF",
  secondary: "#FFD60A",
  accent: "#BF5AF2",
  success: "#30D158",
  danger: "#FF453A",
  warning: "#FF9F0A",
  
  // Type-specific colors for C++ templates
  typeInt: "#64D2FF",
  typeFloat: "#5E5CE6",
  typeString: "#30D158",
  typeDouble: "#BF5AF2",
  typeChar: "#FF9F0A",
  typeT: "#0A84FF",
  typeU: "#FF375F",
  
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
