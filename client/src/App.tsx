import { lazy, Suspense, useEffect, useState, ReactNode } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";

import { env } from "./configs/env.config";
import "./App.css";

const Login = lazy(() =>
  import("./pages/Login/Login").then((module) => ({
    default: module.Login,
  }))
);

const SignUp = lazy(() =>
  import("./pages/SignUp/SignUp").then((module) => ({
    default: module.SignUp,
  }))
);

const Home = lazy(() =>
  import("./pages/Home/Home").then((module) => ({
    default: module.Home,
  }))
);

const Problems = lazy(() =>
  import("./pages/Problems/Problems").then((module) => ({
    default: module.Problems,
  }))
);

const ProblemDetail = lazy(() =>
  import("./pages/ProblemDetail/ProblemDetail").then((module) => ({
    default: module.ProblemDetail,
  }))
);

const Profile = lazy(() =>
  import("./pages/Profile/Profile").then((module) => ({
    default: module.Profile,
  }))
);

const EditProfile = lazy(() =>
  import("./pages/EditProfile/EditProfile").then((module) => ({
    default: module.EditProfile,
  }))
);

const Submission = lazy(() =>
  import("./pages/Submission/Submission").then((module) => ({
    default: module.Submission,
  }))
);

const Analyze = lazy(() =>
  import("./pages/Analyze/Analyze").then((module) => ({
    default: module.Analyze,
  }))
);

const Logout = lazy(() =>
  import("./pages/Logout/Logout").then((module) => ({
    default: module.Logout,
  }))
);

const Contests = lazy(() =>
  import("./pages/Contests/Contests").then((module) => ({
    default: module.Contests,
  }))
);

const ContestDetail = lazy(() =>
  import("./pages/ContestDetail/ContestDetail").then((module) => ({
    default: module.ContestDetail,
  }))
);

const ContestLeaderboard = lazy(() =>
  import("./pages/ContestLeaderboard/ContestLeaderboard").then((module) => ({
    default: module.ContestLeaderboard,
  }))
);

const ContestResults = lazy(() =>
  import("./pages/ContestResults/ContestResults").then((module) => ({
    default: module.ContestResults,
  }))
);

const Discuss = lazy(() =>
  import("./pages/Discuss/Discuss").then((module) => ({
    default: module.Discuss,
  }))
);

const NewDiscuss = lazy(() =>
  import("./pages/NewDiscuss/NewDiscuss").then((module) => ({
    default: module.NewDiscuss,
  }))
);

const DiscussDetail = lazy(() =>
  import("./pages/DiscussDetail/DiscussDetail").then((module) => ({
    default: module.DiscussDetail,
  }))
);

const NotFound = lazy(() =>
  import("./pages/NotFound/NotFound").then((module) => ({
    default: module.NotFound,
  }))
);

const Leaderboard = lazy(() =>
  import("./components/Leaderboard/Leaderboard").then((module) => ({
    default: module.Leaderboard,
  }))
);

const LoadingScreen = lazy(()=>
  import("./components/LoadingScreen/LoadingScreen").then((module)=>({
    default : module.LoadingScreen
  }))
);

const AdminLayout = lazy(() => import("./components/AdminLayout/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminProblems = lazy(() => import("./pages/Admin/AdminProblems/AdminProblems").then(m => ({ default: m.AdminProblems })));
const AdminProblemForm = lazy(() => import("./pages/Admin/AdminProblemForm/AdminProblemForm").then(m => ({ default: m.AdminProblemForm })));
const AdminContests = lazy(() => import("./pages/Admin/AdminContests/AdminContests").then(m => ({ default: m.AdminContests })));
const AdminContestForm = lazy(() => import("./pages/Admin/AdminContestForm/AdminContestForm").then(m => ({ default: m.AdminContestForm })));
const AdminUsers = lazy(() => import("./pages/Admin/AdminUsers/AdminUsers").then(m => ({ default: m.AdminUsers })));
const AdminSubmissions = lazy(() => import("./pages/Admin/AdminSubmissions/AdminSubmissions").then(m => ({ default: m.AdminSubmissions })));
const AdminSubmissionDetail = lazy(() => import("./pages/Admin/AdminSubmissionDetail/AdminSubmissionDetail").then(m => ({ default: m.AdminSubmissionDetail })));
const AdminDiscussions = lazy(() => import("./pages/Admin/AdminDiscussions/AdminDiscussions").then(m => ({ default: m.AdminDiscussions })));
const AdminReports = lazy(() => import("./pages/Admin/AdminReports/AdminReports").then(m => ({ default: m.AdminReports })));
const AdminSettings = lazy(() => import("./pages/Admin/AdminSettings/AdminSettings").then(m => ({ default: m.AdminSettings })));
  
interface ProtectedNavigateProps {
  isloggedIn: boolean;
  children: ReactNode;
}

const ProtectedNavigate = ({
  isloggedIn,
  children,
}: ProtectedNavigateProps) => {
  if (!isloggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

interface AdminProtectedRouteProps {
  isloggedIn: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  children: ReactNode;
}

const AdminProtectedRoute = ({ isloggedIn, user, children }: AdminProtectedRouteProps) => {
  if (!isloggedIn) return <Navigate to="/" replace />;
  if (user?.role !== "admin") return <Navigate to="/home" replace />;
  return <>{children}</>;
};

function App() {
  const [isloggedIn, setIsloggedIn] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Theme sync
    const savedTheme = localStorage.getItem("theme") || "system";
    let activeTheme = savedTheme;
    if (savedTheme === "system") {
      activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", activeTheme);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsloggedIn(false);
          return;
        }

        const response = await axios.get(
          `${env.backendUrl}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setIsloggedIn(true);
          setUser(response.data.user);
        }
      } catch (error) {
        setIsloggedIn(false);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route
          path="/"
          element={
            (
              <Login
                setIsloggedIn={setIsloggedIn}
                isloggedIn={isloggedIn}
              />
            )
          }
        />

        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/home"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <Home isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/problems"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <Problems isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/problems/:id"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <ProblemDetail isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/submission/:id"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <Submission isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/analysis/:id"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <Analyze isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <Profile isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/profile/:username"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <Profile isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <EditProfile isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/logout"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <Logout setIsloggedIn={setIsloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/contests"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <Contests />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/contest/:contestId"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <ContestDetail />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/contest/:contestId/problem/:id"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <ProblemDetail isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/contest/:contestId/leaderboard"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <ContestLeaderboard />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/contest/:contestId/results"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <ContestResults />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/discuss"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <Discuss isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/discuss/new"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <NewDiscuss isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/discuss/:id"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <DiscussDetail isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <Leaderboard isloggedIn={isloggedIn}/>
            </ProtectedNavigate>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute isloggedIn={isloggedIn} user={user}>
              <AdminLayout user={user} setIsloggedIn={setIsloggedIn} />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="problems" element={<AdminProblems />} />
          <Route path="problems/new" element={<AdminProblemForm />} />
          <Route path="problems/:id/edit" element={<AdminProblemForm />} />
          <Route path="contests" element={<AdminContests />} />
          <Route path="contests/new" element={<AdminContestForm />} />
          <Route path="contests/:id/edit" element={<AdminContestForm />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="submissions/:id" element={<AdminSubmissionDetail />} />
          <Route path="discussions" element={<AdminDiscussions />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;

// Add the likes to reply 
// have to add direct access to  admin 