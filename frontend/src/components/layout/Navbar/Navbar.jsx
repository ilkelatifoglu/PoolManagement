import { useNavigate, useLocation, Link } from "react-router-dom";
import { authService } from "../../../services/auth.service";
import "./navbar.css";

import poolIcon from "../../../assets/icons/pool-icon.png";
import cartIcon from "../../../assets/icons/cart-icon.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src={poolIcon} alt="Pool Icon" />
          <span>Pool Management</span>
        </div>

        {isAuthenticated ? (
          <div className="navbar-links">
            <Link
              to="/dashboard"
              className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
            >
              Dashboard
            </Link>
            <Link
              to="/sessions"
              className={`nav-link ${isActive("/sessions") ? "active" : ""}`}
            >
              Sessions
            </Link>
            <Link
              to="/membership"
              className={`nav-link ${isActive("/membership") ? "active" : ""}`}
            >
              Membership
            </Link>
            <Link
              to="/reports"
              className={`nav-link ${isActive("/reports") ? "active" : ""}`}
            >
              Reports
            </Link>
            <Link
              to="/events"
              className={`nav-link ${isActive("/events") ? "active" : ""}`}
            >
              Events
            </Link>
            <Link
              to="/profile"
              className={`nav-link ${isActive("/profile") ? "active" : ""}`}
            >
              Profile
            </Link>
            <Link
              to="/cart"
              className={`nav-link cart-link ${
                isActive("/cart") ? "active" : ""
              }`}
            >
              <img src={cartIcon} alt="Cart" className="cart-icon" />
              Cart
            </Link>
            <button onClick={handleLogout} className="logout">
              Log out
            </button>
          </div>
        ) : (
          <div className="navbar-links">
            <Link
              to="/login"
              className={`nav-link ${isActive("/login") ? "active" : ""}`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`nav-link ${isActive("/register") ? "active" : ""}`}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
