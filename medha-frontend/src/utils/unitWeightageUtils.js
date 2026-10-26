/**
 * Unit Weightage Utilities
 * Data transformation and type definitions for unit weightage visualization
 */

/**
 * @typedef {Object} UnitWeightage
 * @property {number} unitSerial - Unit number (1-5)
 * @property {string} unitName - Unit title
 * @property {number} totalMarks - Sum of marks for this unit
 * @property {number} weightageRatio - totalMarks / totalPaperMarks (0-1)
 * @property {number} weightagePercentage - weightageRatio * 100
 */

/**
 * @typedef {Object} WeightageResponse
 * @property {boolean} success
 * @property {string} subject
 * @property {number} year
 * @property {number} totalPaperMarks
 * @property {UnitWeightage[]} units
 */

/**
 * Transforms raw unit data to include computed weightage values (client-side fallback)
 * @param {Array} units - Array of raw unit objects
 * @param {number} totalPaperMarks - Total marks for the paper
 * @returns {UnitWeightage[]} Sorted array with weightage computed
 */
export const transformUnitData = (units, totalPaperMarks) => {
  return units
    .map((unit) => ({
      unitSerial: unit.unitSerial,
      unitName: unit.unitName,
      totalMarks: unit.totalMarks,
      weightageRatio: unit.totalMarks / totalPaperMarks,
      weightagePercentage: (unit.totalMarks / totalPaperMarks) * 100,
    }))
    .sort((a, b) => b.totalMarks - a.totalMarks);
};

/**
 * Gets color for a unit bar based on weightage
 * Higher weightage = more emphasized color
 * @param {number} weightagePercentage - Percentage value
 * @returns {string} Gradient CSS value
 */
export const getBarGradient = (weightagePercentage) => {
  if (weightagePercentage >= 30) {
    return "linear-gradient(90deg, #8b5cf6, #a78bfa)"; // High: Purple
  } else if (weightagePercentage >= 20) {
    return "linear-gradient(90deg, #6366f1, #818cf8)"; // Medium-high: Indigo
  } else if (weightagePercentage >= 15) {
    return "linear-gradient(90deg, #3b82f6, #60a5fa)"; // Medium: Blue
  } else {
    return "linear-gradient(90deg, #06b6d4, #22d3ee)"; // Lower: Cyan
  }
};
