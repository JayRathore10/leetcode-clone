import { NavLink, useNavigate  , useLocation} from "react-router-dom";
import "../styles/Header.css";
import { LoginProps } from "./Login";
import { motion } from "framer-motion";

const fadeup = {
  hidden : {opacity : 0 , y : -10},
  visible : {opacity : 1 ,  y : 0}
}

export function Header({isloggedIn} : LoginProps) {
  const navigate = useNavigate();

  const location = useLocation();
  const isOnProfilePage = location.pathname === "/profile";

  return (
    <motion.header className="header"
      initial="hidden"
      animate="visible"
      variants={fadeup} 
      transition={{duration : 0.3}}
    >
      <div className="header-left">
        <span className="logo" onClick={() => navigate("/home")}>
          CodeChamp
        </span>
      </div>

      <nav className="header-nav">
        <NavLink to="/problems" className="nav-link">
          Problems
        </NavLink>

        <NavLink to="/contests" className="nav-link">
          Contests
        </NavLink>

        <NavLink to="/discuss" className="nav-link">
          Discuss
        </NavLink>

        <NavLink to="/leaderboard" className="nav-link">
          Leaderboard
        </NavLink>
      </nav>

      <div className="header-right">
        <button
          className="header-btn"
          onClick={() => {
            if(isloggedIn === false ){
              navigate("/");
            }else if(isOnProfilePage) {
              navigate("/logout");
            }else {
              navigate("/profile");
            }
          }}
        >
         {
          isloggedIn ? 
            isOnProfilePage ? 
              `Logout` :
              'Profile'
            : 
            `Login` 
         }
        </button>
      </div>
    </motion.header>
  );
}

