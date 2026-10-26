import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";
import RTUExams from "./RTUExams";
import ExamsComingSoon from "./ExamsComingSoon";

/**
 * ExamsPage - Wrapper component that conditionally renders
 * RTUExams or ComingSoon based on user's university and branch
 * 
 * Currently supported: RTU + CSE (3rd Semester)
 * All other combinations show Coming Soon
 */
const ExamsPage = () => {
  const { user } = useContext(AuthContext);
  
  // Check if user has access to RTU Exams content
  // Guests (no user) get access by default to look around
  const isGuest = !user;
  const isRTU = user?.university === "RTU";
  // CSE and AIDS have the same syllabus
  const isSupportedBranch = user?.branch === "CSE" || user?.branch === "AIDS";
  
  // Show RTU Exams if guest OR (user is RTU + CSE/AIDS)
  if (isGuest || (isRTU && isSupportedBranch)) {
    return <RTUExams />;
  }
  
  // For all other combinations, show Coming Soon
  return <ExamsComingSoon />;
};

export default ExamsPage;
