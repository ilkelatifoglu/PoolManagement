import { useNavigate, useLocation, Link } from "react-router-dom";
import { authService } from "../../../services/auth.service";
import "./navbar.css";

import poolIcon from "../../../assets/icons/pool-icon.png";
import bellIconPrimary from "../../../assets/icons/bell-icon-primary.png";
import bellIconSecondary from "../../../assets/icons/bell-icon-secondary.png";
import cartIconPrimary from "../../../assets/icons/cart-icon-primary.png";
import cartIconSecondary from "../../../assets/icons/cart-icon-secondary.png";
import Button from "../../../components/common/Button/Button";

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
        <Link to="/dashboard" className="navbar-brand">
          <img src={poolIcon} alt="Pool Icon" />
          <span>Pool Management</span>
        </Link>

        {isAuthenticated ? (
          <div className="navbar-links">
            <Link
              to="/notifications"
              className={`nav-link icon-link ${
                isActive("/notifications") ? "active" : ""
              }`}
            >
              <img
                src={
                  isActive("/notifications")
                    ? bellIconPrimary
                    : bellIconSecondary
                }
                alt="Notifications"
                className="nav-icon"
              />
            </Link>
            <Link
              to="/cart"
              className={`nav-link icon-link ${
                isActive("/cart") ? "active" : ""
              }`}
            >
              <img
                src={isActive("/cart") ? cartIconPrimary : cartIconSecondary}
                alt="Cart"
                className="nav-icon"
              />
            </Link>
            <Button onClick={handleLogout} variant="primary" size="medium">
              Logout
            </Button>
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
