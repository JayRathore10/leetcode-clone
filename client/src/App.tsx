import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { NotFound } from "./components/NotFound";
import { Header } from "./components/Header";

function App(){
  return(
    <>
      <Routes>
        <Route path="/" element={<Header/>}   />
        <Route path="/login" element={<Login />} />  
        <Route path="/signup" element={<SignUp />} />  
        <Route path="*" element = {<NotFound/>} />  
      </Routes>    
    </>
  );
}

export default App;