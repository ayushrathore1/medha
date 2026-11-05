import React, { Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import PageTransition from "./components/Common/PageTransition";
import Loader from "./components/Common/Loader";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./AuthProvider";

const ComingSoon = React.lazy(() => import("./pages/ComingSoon"));
const MemberComingSoon = React.lazy(() => import("./pages/MemberComingSoon"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const GoogleAuthSuccess = React.lazy(() => import("./pages/GoogleAuthSuccess"));
const Terms = React.lazy(() => import("./pages/Terms"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const EmailVerification = React.lazy(() => import("./pages/EmailVerification"));

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
            <Route
              path="/inside"
              element={
                <PageTransition>
                  <MemberComingSoon />
                </PageTransition>
              }
            />
            <Route
              path="/login"
              element={
                <PageTransition>
                  <Login />
                </PageTransition>
              }
            />
            <Route
              path="/register"
              element={
                <PageTransition>
                  <Register />
                </PageTransition>
              }
            />
            <Route
              path="/signup"
              element={<Navigate to="/register" replace />}
            />
            <Route
              path="/forgot-password"
              element={
                <PageTransition>
                  <ForgotPassword />
                </PageTransition>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PageTransition>
                  <ResetPassword />
                </PageTransition>
              }
            />
            <Route
              path="/auth/google/success"
              element={
                <PageTransition>
                  <GoogleAuthSuccess />
                </PageTransition>
              }
            />
            <Route
              path="/verify-email"
              element={
                <PageTransition>
                  <EmailVerification />
                </PageTransition>
              }
            />
            <Route
              path="/terms"
              element={
                <PageTransition>
                  <Terms />
                </PageTransition>
              }
            />
            <Route
              path="/privacy"
              element={
                <PageTransition>
                  <Privacy />
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
