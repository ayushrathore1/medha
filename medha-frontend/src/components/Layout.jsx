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
  const isAuthPage = ["/login", "/register", "/signup"].includes(location.pathname);
  const isFullScreenPage = isLandingPage || isAuthPage;

  return (
    <div className={`min-h-screen flex flex-col overflow-x-hidden relative ${isLandingPage ? '' : 'text-[var(--text-primary)]'}`}>
      {/* Tour Overlay */}
      <TourOverlay />
      <ThemeSetupPrompt />

      {/* Navbar — hidden on landing page and auth pages */}
      {!isFullScreenPage && <Navbar user={user} onLogout={logout} />}

      {/* Main Content — no padding on landing/auth pages */}
      {isFullScreenPage ? (
        <main className="flex-grow relative z-10">
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

