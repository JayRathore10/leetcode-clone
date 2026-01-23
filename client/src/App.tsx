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

function App(){
  return(
    <>
      <Routes>
        <Route path="/" element={<Home/>}   />
        <Route path="/login" element={<Login />} />  
        <Route path="/signup" element={<SignUp />} />  
        <Route path="/problemset" element={<Problems/>}/>
        <Route path="/problem-detail" element={<ProblemDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contests" element={<Contests/>}/> 
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