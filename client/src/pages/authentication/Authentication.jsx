import "./../../styles/auth.css";
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
