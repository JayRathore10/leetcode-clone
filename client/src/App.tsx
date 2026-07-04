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

const Discuss = lazy(() =>
  import("./pages/Discuss/Discuss").then((module) => ({
    default: module.Discuss,
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

const LoadingScreen = () => (
  <div className="ap-loading-container">
    <div className="ap-spinner"></div>
    <div className="ap-loading-text">Loading app...</div>
  </div>
);

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

function App() {
  const [isloggedIn, setIsloggedIn] = useState(false);
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
              <Contests/>
            </ProtectedNavigate>
          }
        />

        <Route
          path="/discuss"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <Discuss />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn}>
              <Leaderboard />
            </ProtectedNavigate>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;

// Have to add logic for the dicuss section 
// Make leaderboard