import "./../../styles/user-profile.css";
import { useAuth } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useAuth";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";

function UserProfile() {
  const { user, isLoading: loading, error } = useAuth();
  const logoutMutation = useLogout();

  return (
    <div className="user-profile-page">
      {loading && <p className="info-message">Loading user...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && user && (
        <div className="user-profile-wrapper">
          <div className="user-left">
            <img
              src={user.avatarUrl || "/default-avatar.png"}
              alt="User avatar"
              className="user-avatar-large"
            />
            <button className="btn-profile primary icon-btn">
              <EditIcon className="icon" />
              Edit Profile
            </button>

            <button onClick={() => logoutMutation.mutate()} className="btn-profile danger icon-btn">
              <LogoutIcon className="icon" />
              Logout
            </button>
          </div>

          <div className="user-right">
            <div className="user-info-section">
              <h2>{user.displayName}</h2>
              <p className="muted">@{user.username}</p>
              <p className="muted">{user.username}@gmail.com</p>
              <p className="role-tag"><strong>Role:</strong> {user.role}</p>
            </div>

            <div className="divider"></div>

            <div className="user-stats-section">
              <div className="stat-box">
                <h4>N/A</h4>
                <p>Orders</p>
              </div>
              <div className="stat-box">
                <h4>N/A</h4>
                <p>Wishlist</p>
              </div>
              <div className="stat-box">
                <h4>N/A</h4>
                <p>Addresses</p>
              </div>
              <div className="stat-box">
                <h4>Active</h4>
                <p>Status</p>
              </div>
            </div>

            <div className="divider"></div>

            <div className="settings-section">
              <h3>Account Settings</h3>
              <ul>
                <li>Change Password</li>
                <li>Notification Preferences</li>
                <li>Privacy Settings</li>
                <li>Connected Apps</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
