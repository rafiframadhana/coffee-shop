import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const validate = (field, value) => {
    let error = "";

    switch (field) {
      case "name":
        if (!/^[A-Za-z\s]+$/.test(value)) {
          error = "Name must contain only letters and spaces";
        }
        break;

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

      case "confirmPassword":
        if (value !== formData.password) {
          error = "Passwords do not match";
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
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: formData.name,
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage("User Registered Succesfully!");
        setFormData({
          name: "",
          username: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => navigate("/auth/login"), 3000);
      } else {
        const errorJson = await response.json().catch(() => ({}));
        setFormErrors({ general: "Registration failed: " + errorJson.error });
      }
    } catch (err) {
      setFormErrors({ general: "Error connecting to server" });
      console.log(err);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2 className="form-title">Register</h2>

        <form onSubmit={handleSubmit} noValidate>
          <label>
            Name
            <input
              type="text"
              name="name"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {formErrors.name && (
              <small className="error">{formErrors.name}</small>
            )}
          </label>

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
                placeholder="password goes here..."
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
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

          <label>
            Confirm Password
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="write it once again..."
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
              >
                {showConfirmPassword ? (
                  <VisibilityOffIcon fontSize="small" />
                ) : (
                  <VisibilityIcon fontSize="small" />
                )}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <small className="error">{formErrors.confirmPassword}</small>
            )}
          </label>

          {formErrors.general && (
            <p className="error general-error">{formErrors.general}</p>
          )}

          <button type="submit">Register</button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/auth/login">Click here to login</a>
        </p>
      </div>
      {successMessage && <div className="success-toast">{successMessage}</div>}
    </div>
  );
}
