/**
 * Whether the user still needs college / branch / semester for personalization.
 * Matches the fields required on email registration step 2.
 */
export function needsAcademicProfile(user) {
  if (!user) return false;
  const college = String(user.college || user.university || "").trim();
  const branch = String(user.branch || "").trim();
  const semester = String(user.year || user.semester || "").trim();
  return !college || !branch || !semester;
}

export const PROFILE_BRANCHES = ["CSE", "ECE", "ME", "Civil", "IT", "AIDS", "CSD", "CAI", "EE"];
export const PROFILE_SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
