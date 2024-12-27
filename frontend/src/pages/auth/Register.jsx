import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import Button from "../../components/common/Button/Button";
import "./register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    swimLevel: "Beginner",
    birthDate: "",
    gender: "",
    bloodType: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await authService.register(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Create an Account</h1>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="First and Last Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Swimmer Level:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="swimLevel"
                  value="Beginner"
                  checked={formData.swimLevel === "Beginner"}
                  onChange={handleChange}
                />
                Beginner
              </label>
              <label>
                <input
                  type="radio"
                  name="swimLevel"
                  value="Inter"
                  checked={formData.swimLevel === "Inter"}
                  onChange={handleChange}
                />
                Inter
              </label>
              <label>
                <input
                  type="radio"
                  name="swimLevel"
                  value="Advanced"
                  checked={formData.swimLevel === "Advanced"}
                  onChange={handleChange}
                />
                Advanced
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <input
                type="text"
                name="birthDate"
                placeholder="YYYY-MM-DD"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group half">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              required
            >
              <option value="">Select Blood Type</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <Button type="submit" isLoading={isLoading} fullWidth>
            Register
          </Button>

          <div className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
