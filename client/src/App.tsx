import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { NotFound } from "./components/NotFound";
import { Home } from "./components/Home";
import { Problems } from "./components/Problems";
import { ProblemDetail } from "./components/ProblemDetail";
import { Profile } from "./components/Profile";
import { Contests } from "./components/Contests";
import { Discuss } from "./components/Discuss";
import { Leaderboard } from "./components/Leaderboard";
import { useEffect , useState } from "react";
import axios from "axios";
import { env } from "./configs/env.config";
import { Logout } from "./components/Logout";
import { Submission } from "./components/Submission";
function App(){

  const [isloggedIn, setIsloggedIn] = useState<boolean>(false);

  useEffect(()=>{
    const call = async()=>{
      try{
        const res = await axios.get(`${env.backendUrl}`);
        console.log(res);
      }catch(error){
        console.log(error);
      }
    }
    call();
  })

  return(
    <>
      <Routes>
        <Route path="/" element={<Login 
          setIsloggedIn={setIsloggedIn}
          isloggedIn={isloggedIn}
        />} />  
        <Route path="/home" element={<Home
           isloggedIn={isloggedIn}
        />}   />
        <Route path="/signup" element={<SignUp 
          setIsloggedIn={setIsloggedIn}
          isloggedIn={isloggedIn}
        />} />  
        <Route path="/problems" element={<Problems
           isloggedIn={isloggedIn}
        />}/>
        <Route path="/problems/:id" element={<ProblemDetail
           isloggedIn={isloggedIn}
        />} />
        <Route path="/submission/:id" element={<Submission
            isloggedIn={isloggedIn}
        />}/>
        <Route path="/profile" element={<Profile
          isloggedIn={isloggedIn}
        />} />
        <Route path="/logout" element={<Logout 
          setIsloggedIn={setIsloggedIn}
        />}/>
        <Route path="/contests" element={<Contests/>}/>
        <Route path="/discuss" element={<Discuss/>}/>
        <Route path="/leaderboard" element={<Leaderboard/>}/> 
        <Route path="*" element = {<NotFound/>} /> 
      </Routes>    
    </>
  );
}

export default App;

/**
 * 
 * When Someone open the Start Solving it goes to the Login page if its not login simple 
 * 
 */

/** 
 * complete 
 * Make the discuss section for each question(solution also)
 * Add some more things to the profile page 
 * and connect sign up login to the profile with there middleware
 */

/**
 * make things working 
 * pop window of explain how to write code in this website and 
 * add more questions 
 * and testing on diff ideas 
 */