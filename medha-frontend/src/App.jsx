import React, { Suspense, useContext, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loader from "./components/Common/Loader";
import PageTransition from "./components/Common/PageTransition";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./AuthProvider";
import { AuthContext } from "./AuthContext";
import { TourProvider } from "./context/TourContext";
import { canAccessPlatform, IS_COMING_SOON_MODE } from "./config/appMode";
import RequireAuth from "./components/Common/RequireAuth";
import GuestOnly from "./components/Common/GuestOnly";
import SessionGate from "./components/Common/SessionGate";
import StaffRoute from "./components/Common/StaffRoute";
import MobileTabLayout from "./layouts/MobileTabLayout";

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

const HomeGate = React.lazy(() => import("./pages/HomeGate"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Subjects = React.lazy(() => import("./pages/Subjects"));
const SubjectTopics = React.lazy(() => import("./pages/SubjectTopics"));
const TopicDetail = React.lazy(() => import("./pages/TopicDetail"));
const RevisionSearch = React.lazy(() => import("./pages/RevisionSearch"));
const NotePreview = React.lazy(() => import("./pages/NotePreview"));
const UploadNotes = React.lazy(() => import("./pages/UploadNotes"));
const MyUploads = React.lazy(() => import("./pages/MyUploads"));
const Profile = React.lazy(() => import("./pages/Profile"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const TeamDashboard = React.lazy(() => import("./pages/TeamDashboard"));
const JoinTeam = React.lazy(() => import("./pages/JoinTeam"));

const TAB_IMPORTS = [
  () => import("./pages/HomeGate"),
  () => import("./pages/Dashboard"),
  () => import("./pages/Subjects"),
  () => import("./pages/RevisionSearch"),
  () => import("./pages/UploadNotes"),
  () => import("./pages/Profile"),
];

function preloadTabChunks() {
  TAB_IMPORTS.forEach((load) => {
    try {
      load();
    } catch {
      /* ignore */
    }
  });
}

const withAuthTransition = (node) => <PageTransition>{node}</PageTransition>;
const auth = (node) => <RequireAuth>{node}</RequireAuth>;
const guest = (node) => <GuestOnly>{withAuthTransition(node)}</GuestOnly>;
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
    <Route path="/verify-email" element={withAuthTransition(<EmailVerification />)} />
    <Route path="/terms" element={withAuthTransition(<Terms />)} />
    <Route path="/privacy" element={withAuthTransition(<Privacy />)} />
  </>
);

/** Production early-access tree — waitlist + auth only (non-team). */
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
 * Full platform tree.
 *
 * PUBLIC:  /  (landing), /subjects/*, /search
 * AUTH:    desk home (via HomeGate), /dashboard, /upload(s), /profile, /note/*, /join-team
 * STAFF:   /admin, /team-dashboard
 */
const InsideAppTree = () => {
  const location = useLocation();

  useEffect(() => {
    preloadTabChunks();
  }, []);

  useEffect(() => {
    const id = window.setTimeout(preloadTabChunks, 400);
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
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/subjects/:subjectSlug" element={<SubjectTopics />} />
            <Route path="/subjects/:subjectSlug/:unitSlug" element={<TopicDetail />} />

            {/* AUTH desk */}
            <Route path="/dashboard" element={auth(<Dashboard />)} />
            <Route path="/note/:noteId" element={auth(<NotePreview />)} />
            <Route path="/upload" element={auth(<UploadNotes />)} />
            <Route path="/uploads" element={auth(<MyUploads />)} />
            <Route path="/profile" element={auth(<Profile />)} />
          </Route>

          <Route path="/inside" element={<Navigate to="/" replace />} />
          <Route path="/coming-soon" element={withAuthTransition(<ComingSoon />)} />
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
  if (IS_COMING_SOON_MODE && !canAccessPlatform(user)) {
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
