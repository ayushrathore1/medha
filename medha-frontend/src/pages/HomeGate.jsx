import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";

/** Guests see the marketing landing; signed-in users get the themed home dashboard. */
export default function HomeGate() {
  const { user } = useContext(AuthContext);
  return user ? <Dashboard /> : <LandingPage />;
}
