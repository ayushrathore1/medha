import React, { Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import PageTransition from "./components/Common/PageTransition";
import Loader from "./components/Common/Loader";
import { ThemeProvider } from "./context/ThemeContext";

const ComingSoon = React.lazy(() => import("./pages/ComingSoon"));

/**
 * Temporary site gate: every URL loads the Diwali coming-soon page.
 * Restore the full route tree from git history when the relaunch ships.
 */
const AppContent = () => {
  const location = useLocation();

  return (
    <>
      <Analytics />
      <AnimatePresence mode="wait">
        <Suspense fallback={<Loader fullScreen />}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <ComingSoon />
                </PageTransition>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  );
};

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
