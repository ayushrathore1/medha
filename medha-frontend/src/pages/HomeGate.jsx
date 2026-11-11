import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";

/**
 * Post-GA home (`/`).
 * Guests → original marketing LandingPage.
 * Signed-in → Dashboard (never the landing).
 */
export default function HomeGate() {
  const { user } = useContext(AuthContext);
  return user ? <Dashboard /> : <LandingPage />;
}
