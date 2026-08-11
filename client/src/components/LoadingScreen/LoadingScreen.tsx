import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import "./LoadingScreen.css";

export const LoadingScreen = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="ap-loading-container">
      {showMessage && (
        <p className="ap-loading-message">
          This is taking a little longer than usual. The server may be waking
          up — please wait a moment.
        </p>
      )}

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
};