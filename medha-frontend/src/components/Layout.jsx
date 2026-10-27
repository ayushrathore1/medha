import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navigation/Navbar";
import { AuthContext } from "../AuthContext";
import TourOverlay from "./Common/TourOverlay";
import ThemeSetupPrompt from "./Common/ThemeSetupPrompt";
import BottomNav from "./Revision/BottomNav";

const MainLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isAuthPage = ["/login", "/register", "/signup"].includes(location.pathname);
  const isRevisionApp = [
    "/dashboard",
    "/search",
    "/subjects",
    "/upload",
    "/uploads",
  ].some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`))
    || location.pathname.startsWith("/note/");
  const isFullScreenPage = isLandingPage || isAuthPage || isRevisionApp;
  const isProfileArea = location.pathname.startsWith("/profile");

  return (
    <div className={`min-h-screen flex flex-col overflow-x-hidden relative ${isLandingPage ? '' : 'text-[var(--text-primary)]'}`}>
      {/* Tour Overlay */}
      <TourOverlay />
      <ThemeSetupPrompt />

      {/* Navbar — hidden on landing page and auth pages */}
      {!isFullScreenPage && <Navbar user={user} onLogout={logout} />}
      {isProfileArea && <BottomNav />}

      {/* Main Content — no padding on landing/auth pages */}
      {isFullScreenPage ? (
        <main className="flex-grow relative z-10">
          {children}
        </main>
      ) : (
        <main className={`flex-grow relative z-10 pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full ${isProfileArea ? "pb-24" : ""}`}>
          {children}
        </main>
      )}
    </div>
  );
};

export default MainLayout;

