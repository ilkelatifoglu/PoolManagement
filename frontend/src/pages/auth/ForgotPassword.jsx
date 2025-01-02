import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/auth.service";
import Button from "../../components/common/Button/Button";
import "./forgot-password.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await authService.forgotPassword(email);
      // Always show success message for security
      setSuccess(
        "If an account exists with this email, a recovery link has been sent."
      );
      setEmail("");
    } catch (err) {
      // Don't expose whether the email exists or not
      setSuccess(
        "If an account exists with this email, a recovery link has been sent."
      );
      setEmail("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h1>Forgot Password</h1>
        <p className="forgot-password-subtitle">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <Button type="submit" isLoading={isLoading} fullWidth>
            Send Recovery Link
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

export default ForgotPassword;
