import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./sidebar.css";

const Sidebar = () => {
  const { isAuthenticated, user } = useAuth();
  if (!localStorage.getItem("token")) {
    return null;
  }

  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dashboard
          </NavLink>
        </li>
        {(localStorage.getItem("role") === "swimmer" || localStorage.getItem("role") === "coach") && (
        <li>
          <NavLink
            to="/my-activities"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            My Activities
          </NavLink>
        </li>)}
        <li>
          <NavLink
            to="/training"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Training
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/add-class"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Enroll to Class
          </NavLink>
        </li>
        {user?.user_type === "coach" && (
          <li>
            <NavLink
              to="/create-class"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Create Class
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/cancel-class"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Cancel Class
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/events"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Events
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/attend-event"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Attend Event
          </NavLink>
        </li>
        {user?.user_type === "manager" && (
          <>
            <li>
              <NavLink
                to="/create-event"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Create Event
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/manager-page"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Manager Dashboard
              </NavLink>
            </li>
          </>
        )}
        {user?.user_type === "admin" && (
          <li>
            <NavLink
              to="/reports"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Reports
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/cancel-event"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Cancel Event
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/sessions"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Sessions
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/membership"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Membership
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/become-member"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Be Member
          </NavLink>
        </li>  
        <li>
          <NavLink
            to="/cart"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Cart
          </NavLink>
        </li>        
        <li>
          <NavLink
            to="/evaluation"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Evaluate
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/viewrate"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Coach/Class Evaluations
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Profile
          </NavLink>
        </li>

        {/* Conditionally Render System Reports Link */}
        {localStorage.getItem("role") === "administrator" && (
          <li>
            <NavLink
              to="/system-reports"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              System Reports
            </NavLink>
          </li>)}
      </ul>
    </div>
  );
};

export default Sidebar;
