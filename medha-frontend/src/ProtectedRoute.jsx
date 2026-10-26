import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useTour } from "./context/TourContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { isTourActive } = useTour();
  const location = useLocation();

  // If no user and no tour, redirect to welcome
  if (!user && !isTourActive) {
    return <Navigate to="/" replace />;
  }

  // Check if user has completed personalization
  // Use explicit checks for non-empty strings
  const hasUniversity = user?.university && user.university.trim().length > 0;
  const hasBranch = user?.branch && user.branch.trim().length > 0;
  const hasGender = user?.gender && user.gender.trim().length > 0;
  const isPersonalized = hasUniversity && hasBranch && hasGender;

  // If user exists but hasn't completed personalization, redirect to /personalize
  // Skip this check if already on /personalize to prevent redirect loop
  if (user && !isPersonalized) {
    if (location.pathname !== "/personalize") {
      return <Navigate to="/personalize" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;


