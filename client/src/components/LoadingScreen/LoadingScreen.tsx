import logo from "../../assets/logo.png";
import "./LoadingScreen.css";

export const LoadingScreen = () => (
  <div className="ap-loading-container">
    <div className="ap-loading-brand">
      <img
        src={logo}
        alt="CodeChamp"
        className="ap-loading-logo"
      />
      <h1 className="ap-loading-text">   CodeChamp</h1>
    </div>
  </div>
);

// Have to add {its take a little time to load first time or the server is awaking its take a little time messgae if app those not load in 2-3 sec at the top}