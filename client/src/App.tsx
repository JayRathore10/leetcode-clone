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
import { useEffect } from "react";
import axios from "axios";
import { env } from "./configs/env.config";
function App(){

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
        <Route path="/" element={<Home/>}   />
        <Route path="/login" element={<Login />} />  
        <Route path="/signup" element={<SignUp />} />  
        <Route path="/problems" element={<Problems/>}/>
        <Route path="/problems/:id" element={<ProblemDetail />} />
        <Route path="/profile" element={<Profile />} />
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
 * make things working 
 */