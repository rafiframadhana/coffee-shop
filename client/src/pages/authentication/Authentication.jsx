import "./../../styles/auth.css";
import coffeImg from "/background/hero/hero-bg.png";
import { Outlet } from "react-router-dom";

function Authentication() {
  return (
    <div className="auth-container">
      <div className="auth-form">
        <Outlet />
      </div>
    </div>
  );
}

export default Authentication;
