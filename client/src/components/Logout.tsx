import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { env } from "../configs/env.config";
import "../styles/Logout.css";

interface LogoutProps {
  setIsloggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Logout({ setIsloggedIn }: LogoutProps) {
  const navigate = useNavigate();

  useEffect(() => {

    const callLogoutApi = async () => {
      try {
        const response = await axios.post(`${env.backendUrl}/api/auth/logout` , {} , {
          withCredentials : true
        });
        if (response.data.success === true) {
          console.log("SuccessFully Logout");
        }
      } catch (error) {
        console.log(error);
      }
    }

    localStorage.removeItem("token");
    setIsloggedIn(false);
    callLogoutApi();

    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate, setIsloggedIn]);

  return (
    <div className="logout-container">
      <div className="logout-card">
        <div className="logout-icon">✅</div>
        <h2>Successfully Logged Out</h2>
        <p>
          You have been logged out safely.
          Redirecting to login page…
        </p>

        <button
          className="logout-btn"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
