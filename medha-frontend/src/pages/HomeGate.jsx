import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";
import { needsAcademicProfile } from "../lib/academicProfile";

/**
 * Post-GA home (`/`).
 * Guests → original marketing LandingPage.
 * Signed-in → Dashboard (never the landing).
 * Incomplete academic profile → /complete-profile first.
 */
export default function HomeGate() {
  const { user } = useContext(AuthContext);
  if (user && needsAcademicProfile(user)) {
    return <Navigate to="/complete-profile" replace />;
  }
  return user ? <Dashboard /> : <LandingPage />;
}
