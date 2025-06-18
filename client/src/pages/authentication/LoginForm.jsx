import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const validate = (field, value) => {
    let error = "";

    switch (field) {
      case "username":
        if (!/^[a-z0-9._]+$/.test(value)) {
          error =
            "Username can only contain lowercase letters, numbers, underscore and dot";
        }
        break;

      case "password":
        if (value.length < 8) {
          error = "Password must be at least 8 characters long";
        }
        break;

      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validate(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    Object.keys(formData).forEach((field) => {
      const error = validate(field, formData[field]);
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage("Login Successfully!");
        // Set user first before redirecting
        setUser(result.user);
        localStorage.setItem("user", JSON.stringify(result.user));
        setFormData({
          username: "",
          password: "",
        });
        navigate("/");
      } else {
        const errorJson = await response.json().catch(() => ({}));
        setFormErrors({
          general: "Login failed: " + (errorJson.error || "Unknown Error"),
        });
      }
    } catch (err) {
      setFormErrors({ general: "Error connecting to server" });
      console.log(err);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2 className="form-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              name="username"
              placeholder="e.g. johndoe123"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {formErrors.username && (
              <small className="error">{formErrors.username}</small>
            )}
          </label>

          <label>
            Password
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={togglePasswordVisibility}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <VisibilityOffIcon fontSize="small" />
                ) : (
                  <VisibilityIcon fontSize="small" />
                )}
              </button>
            </div>
            {formErrors.password && (
              <small className="error">{formErrors.password}</small>
            )}
          </label>

          {formErrors.general && (
            <p className="error general-error">{formErrors.general}</p>
          )}

          <button type="submit">Login</button>
        </form>
        <p className="login-link">
          {"Don't have an account?"} <a href="/auth/register">Sign Up here</a>
        </p>
      </div>
      {successMessage && <div className="success-toast">{successMessage}</div>}
    </div>
  );
}
