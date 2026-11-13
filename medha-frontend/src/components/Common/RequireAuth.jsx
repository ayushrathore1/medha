import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { useTour } from "../../context/TourContext";
import { loginPath } from "../Revision/revisionUtils";
import { hasSession } from "../../config/access";
import { usePlatformAccess } from "../../hooks/usePlatformAccess";
import { needsAcademicProfile } from "../../lib/academicProfile";

/** Requires a signed-in session (token + user). */
export default function RequireAuth({ children }) {
  const { user, logout } = useContext(AuthContext);
  const { isTourActive } = useTour();
  const location = useLocation();
  const { comingSoon, canAccess } = usePlatformAccess(user);
  const authenticated = hasSession(user);

  if (!authenticated && !isTourActive) {
    if (user && !localStorage.getItem("token")) logout?.();
    const next = `${location.pathname}${location.search || ""}`;
    return <Navigate to={loginPath(next)} replace />;
  }

  if (
    authenticated &&
    needsAcademicProfile(user) &&
    location.pathname !== "/complete-profile"
  ) {
    const next = `${location.pathname}${location.search || ""}`;
    const q =
      next && next !== "/complete-profile"
        ? `?next=${encodeURIComponent(next)}`
        : "";
    return <Navigate to={`/complete-profile${q}`} replace />;
  }

  if (
    comingSoon &&
    user &&
    !canAccess &&
    location.pathname !== "/complete-profile"
  ) {
    return <Navigate to="/inside" replace />;
  }

  return children;
}
