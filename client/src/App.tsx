import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { NotFound } from "./components/NotFound";
import { Home } from "./components/Home";

function App(){
  return(
    <>
      <Routes>
        <Route path="/" element={<Home/>}   />
        <Route path="/login" element={<Login />} />  
        <Route path="/signup" element={<SignUp />} />  
        <Route path="*" element = {<NotFound/>} />  
      </Routes>    
    </>
  );
}

export default App;