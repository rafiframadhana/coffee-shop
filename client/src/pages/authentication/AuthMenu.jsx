import { useAuth } from "../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";

export default function AuthMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  if (!user) {
    return (
      <div className={`auth-menu ${isHome ? "home" : "nothome"}`}>
        <Link to="/auth/login">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="auth-menu">
      <Tooltip title={user.displayName} arrow>
        <div className="avatar-container" onClick={() => setOpen(!open)}>
          <img src={user.avatarUrl} alt="avatar" className="avatar" />
        </div>
      </Tooltip>

      {open && (
        <div className="dropdown-menu">
          <Link to="/profile" style={{color: "black"}}>Profile</Link>
          {user.role === "admin" && <Link to="/admin" style={{color: "black"}}>Admin</Link>}
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}
