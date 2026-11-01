import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navigation/Navbar";
import { AuthContext } from "../AuthContext";
import TourOverlay from "./Common/TourOverlay";
import ThemeSetupPrompt from "./Common/ThemeSetupPrompt";

const MainLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isAuthPage = ["/login", "/register", "/signup", "/forgot-password", "/reset-password"].includes(location.pathname);
  const isLegalPage = ["/terms", "/privacy"].includes(location.pathname);
  const isRevisionApp = [
    "/dashboard",
    "/search",
    "/subjects",
    "/upload",
    "/uploads",
    "/profile",
  ].some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`))
    || location.pathname.startsWith("/note/");
  const isFullScreenPage = isLandingPage || isAuthPage || isRevisionApp || isLegalPage;

  return (
    <div className={`min-h-screen flex flex-col overflow-x-hidden relative ${isLandingPage ? '' : 'text-[var(--text-primary)]'}`}>
      {/* Tour Overlay */}
      <TourOverlay />
      <ThemeSetupPrompt />

      {/* Navbar — hidden on landing, auth, legal, and inside-app pages */}
      {!isFullScreenPage && <Navbar user={user} onLogout={logout} />}

      {/* Main Content — no padding on landing/auth pages */}
      {isFullScreenPage ? (
        <main className={`flex-grow relative z-10 ${isLegalPage ? "h-svh overflow-hidden" : ""}`}>
          {children}
        </main>
      ) : (
        <main className="flex-grow relative z-10 pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      )}
    </div>
  );
};

export default MainLayout;

