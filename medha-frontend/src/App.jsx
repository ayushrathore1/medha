import React, { Suspense, useContext, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loader from "./components/Common/Loader";
import PageTransition from "./components/Common/PageTransition";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./AuthProvider";
import { AuthContext } from "./AuthContext";
import { TourProvider } from "./context/TourContext";
import RequireAuth from "./components/Common/RequireAuth";
import GuestOnly from "./components/Common/GuestOnly";
import SessionGate from "./components/Common/SessionGate";
import StaffRoute from "./components/Common/StaffRoute";
import MobileTabLayout from "./layouts/MobileTabLayout";
import { usePlatformAccess } from "./hooks/usePlatformAccess";

const ComingSoon = React.lazy(() => import("./pages/ComingSoon"));
const MemberComingSoon = React.lazy(() => import("./pages/MemberComingSoon"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const GoogleAuthSuccess = React.lazy(() => import("./pages/GoogleAuthSuccess"));
const CompleteProfile = React.lazy(() => import("./pages/CompleteProfile"));
const Terms = React.lazy(() => import("./pages/Terms"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const EmailVerification = React.lazy(() => import("./pages/EmailVerification"));

const HomeGate = React.lazy(() => import("./pages/HomeGate"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Subjects = React.lazy(() => import("./pages/Subjects"));
const SubjectTopics = React.lazy(() => import("./pages/SubjectTopics"));
const TopicDetail = React.lazy(() => import("./pages/TopicDetail"));
const RevisionSearch = React.lazy(() => import("./pages/RevisionSearch"));
const PastPapers = React.lazy(() => import("./pages/PastPapers"));
const NotePreview = React.lazy(() => import("./pages/NotePreview"));
const NotesHub = React.lazy(() => import("./pages/NotesHub"));
const Profile = React.lazy(() => import("./pages/Profile"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const TeamDashboard = React.lazy(() => import("./pages/TeamDashboard"));
const JoinTeam = React.lazy(() => import("./pages/JoinTeam"));

const TAB_IMPORTS = [
  () => import("./pages/HomeGate"),
  () => import("./pages/Dashboard"),
  () => import("./pages/Subjects"),
  () => import("./pages/RevisionSearch"),
  () => import("./pages/PastPapers"),
  () => import("./pages/NotesHub"),
  () => import("./pages/Profile"),
];

const AUTH_IMPORTS = [
  () => import("./pages/Login"),
  () => import("./pages/Register"),
  () => import("./pages/ForgotPassword"),
];

function preloadChunks(loaders) {
  loaders.forEach((load) => {
    try {
      load();
    } catch {
      /* ignore */
    }
  });
}

function preloadTabChunks() {
  preloadChunks(TAB_IMPORTS);
}

function preloadAuthChunks() {
  preloadChunks(AUTH_IMPORTS);
}

/** Soft motion only for secondary auth/legal — primary Login/Register stay instant. */
const withAuthTransition = (node) => <PageTransition>{node}</PageTransition>;
const auth = (node) => <RequireAuth>{node}</RequireAuth>;
const guest = (node) => <GuestOnly>{node}</GuestOnly>;
const staff = (node) => <StaffRoute>{node}</StaffRoute>;

/**
 * PUBLIC auth/legal surfaces (no session required).
 * GuestOnly pages bounce signed-in users to the desk.
 */
const publicAuthRoutes = (
  <>
    <Route path="/login" element={guest(<Login />)} />
    <Route path="/register" element={guest(<Register />)} />
    <Route path="/signup" element={<Navigate to="/register" replace />} />
    <Route path="/forgot-password" element={guest(<ForgotPassword />)} />
    <Route path="/reset-password" element={withAuthTransition(<ResetPassword />)} />
    <Route path="/auth/google/success" element={withAuthTransition(<GoogleAuthSuccess />)} />
    <Route
      path="/complete-profile"
      element={auth(withAuthTransition(<CompleteProfile />))}
    />
    <Route path="/verify-email" element={withAuthTransition(<EmailVerification />)} />
    <Route path="/terms" element={withAuthTransition(<Terms />)} />
    <Route path="/privacy" element={withAuthTransition(<Privacy />)} />
  </>
);

/**
 * Pre-GA tree (until scheduled PLATFORM_GA_AT — see config/launch.js).
 * Guests → public coming soon · signed-in members → /inside · team → full app.
 */
const ComingSoonTree = () => (
  <Suspense fallback={<Loader fullScreen />}>
    <Routes>
      <Route path="/" element={withAuthTransition(<ComingSoon />)} />
      <Route path="/inside" element={withAuthTransition(<MemberComingSoon />)} />
      <Route
        path="/join-team"
        element={
          <SessionGate>{withAuthTransition(<JoinTeam />)}</SessionGate>
        }
      />
      {publicAuthRoutes}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

const RouteFallback = () => (
  <div className="min-h-[40vh] w-full" aria-hidden="true" />
);

/**
 * Post-GA tree (auto after PLATFORM_GA_AT — see config/launch.js).
 * PUBLIC:  / → HomeGate (Landing for guests, Dashboard for signed-in)
 * BROWSE:  /subjects/*, /search, /past-papers
 * AUTH:    /dashboard, /notes, /profile, /note/*
 * STAFF:   /admin, /team-dashboard
 * Legacy:  /inside and /coming-soon redirect home (never keep people on waitlist UI)
 */
const InsideAppTree = () => {
  const location = useLocation();

  useEffect(() => {
    preloadTabChunks();
    preloadAuthChunks();
  }, []);

  useEffect(() => {
    const id = window.setTimeout(preloadTabChunks, 200);
    return () => window.clearTimeout(id);
  }, [location.pathname]);

  return (
    <TourProvider>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<MobileTabLayout />}>
            {/* PUBLIC browse */}
            <Route path="/" element={<HomeGate />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/search" element={<RevisionSearch />} />
            <Route path="/past-papers" element={<PastPapers />} />
            <Route path="/rtu-exams" element={<Navigate to="/past-papers" replace />} />
            <Route path="/exams" element={<Navigate to="/past-papers" replace />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/subjects/:subjectSlug" element={<SubjectTopics />} />
            <Route path="/subjects/:subjectSlug/:unitSlug" element={<TopicDetail />} />

            {/* AUTH desk */}
            <Route path="/dashboard" element={auth(<Dashboard />)} />
            <Route path="/notes" element={<NotesHub />} />
            <Route path="/note/:noteId" element={<NotePreview />} />
            <Route path="/upload" element={<Navigate to="/notes?panel=upload" replace />} />
            <Route path="/uploads" element={<Navigate to="/notes?scope=mine" replace />} />
            <Route path="/profile" element={auth(<Profile />)} />
          </Route>

          <Route path="/inside" element={<Navigate to="/" replace />} />
          <Route path="/coming-soon" element={<Navigate to="/" replace />} />
          {publicAuthRoutes}

          {/* STAFF */}
          <Route path="/admin" element={staff(<AdminDashboard />)} />
          <Route path="/team-dashboard" element={staff(<TeamDashboard />)} />
          <Route path="/join-team" element={auth(<JoinTeam />)} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </TourProvider>
  );
};

const AppContent = () => {
  const { user } = useContext(AuthContext);
  const { comingSoon, canAccess } = usePlatformAccess(user);

  useEffect(() => {
    preloadAuthChunks();
    if (!comingSoon || canAccess) preloadTabChunks();
  }, [comingSoon, canAccess]);

  // Keep coming-soon until GA; after that HomeGate serves Landing vs Dashboard.
  if (comingSoon && !canAccess) {
    return <ComingSoonTree />;
  }
  return <InsideAppTree />;
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
