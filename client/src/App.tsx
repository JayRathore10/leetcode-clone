import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { NotFound } from "./pages/NotFound";
import { Home } from "./pages/Home";
import { Problems } from "./pages/Problems";
import { ProblemDetail } from "./pages/ProblemDetail";
import { Profile } from "./pages/Profile";
import { Contests } from "./pages/Contests";
import { Discuss } from "./pages/Discuss";
import { Leaderboard } from "./components/Leaderboard/Leaderboard";
import { useEffect, useState } from "react";
import { env } from "./configs/env.config";
import { Logout } from "./pages/Logout";
import { EditProfile } from "./pages/EditProfile";
import { Submission } from "./pages/Submission";
import { Navigate } from "react-router-dom";
import { Analyze } from "./pages/Analyze";
import axios from "axios";
import "./App.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProtectedNavigate = ({ isLoading, isloggedIn, children }: any) => {
  // add loading 
  if (isLoading) {
    return (
      <div className="ap-loading-container">
        <div className="ap-spinner"></div>
        <div className="ap-loading-text">Loading app...</div>
      </div>
    )
  }

  if (!isloggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {

  const [isloggedIn, setIsloggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const call = async () => {
      try {
        const res = await axios.get(`${env.backendUrl}`);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
    call();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsloggedIn(false);
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`${env.backendUrl}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          setIsloggedIn(true);
        }

      } catch (error) {
        setIsloggedIn(false);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

  }, []);

  if (isLoading) {
    return (
      <div className="ap-loading-container">
        <div className="ap-spinner"></div>
        <div className="ap-loading-text">Loading app...</div>
      </div>

    );
  }


  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isloggedIn ? <Navigate to="/home" replace /> : (
              <Login
                setIsloggedIn={setIsloggedIn}
                isloggedIn={isloggedIn}
              />
            )
          }
        />

        <Route
          path="/signup"
          element={
            <SignUp
            />
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn} isLoading={isLoading}>
              <Home isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/problems"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn} isLoading={isLoading}>
              <Problems isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/problems/:id"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn} isLoading={isLoading}>
              <ProblemDetail isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/submission/:id"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn} isLoading={isLoading}>
              <Submission isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route 
          path="/analysis/:id"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn} isLoading={isLoading}>
              <Analyze isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn} isLoading={isLoading}>
              <Profile isloggedIn={isloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route 
          path="/profile/edit" 
          element={
            <ProtectedNavigate isloggedIn={isloggedIn} isLoading = {isLoading} >
              <EditProfile isloggedIn = {isloggedIn} />
            </ProtectedNavigate>
          }
          />

        <Route
          path="/logout"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn} isLoading={isLoading}>
              <Logout setIsloggedIn={setIsloggedIn} />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/contests"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn} isLoading={isLoading}>
              <Contests />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/discuss"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn} isLoading={isLoading}>
              <Discuss />
            </ProtectedNavigate>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedNavigate isloggedIn={isloggedIn} isLoading={isLoading}>
              <Leaderboard />
            </ProtectedNavigate>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

/**
 * 
 * When Someone open the Start Solving it goes to the Login page if its not login simple 
 * Add socket io for discusse and contest 
 */

/** 
 * complete 
 * Make the discuss section for each question(solution also)
 * Add some more things to the profile page 
 * Add the edit profile button and also solve the reload issue when reload the page the islogged is out so i have to make islogged is connected to the cookies (token) not to the state 
 * 
 */

/**
 * make things working 
 * pop window of explain how to write code in this website and 
 * add more questions 
 * and testing on diff ideas 
 */

/**
 * Add Code analyzer using API 
 */

/**
 * Add the loading animation every where 
 * Skelton ones are best
 */

// refined the file structure (style folder)

// also add the AI code analysis to it. 
