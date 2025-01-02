import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { authService } from "../../services/auth.service";
import Button from "../../components/common/Button/Button";
import "./reset-password.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (passwords.password !== passwords.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword(
        token,
        passwords.password
      );
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h1>Reset Password</h1>
        <p className="reset-password-subtitle">
          Please enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={passwords.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={passwords.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <Button type="submit" isLoading={isLoading} fullWidth>
            Reset Password
          </Button>

          <div className="form-footer">
            <Link to="/login" className="back-to-login">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
