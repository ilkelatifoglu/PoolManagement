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
        <li>
          <NavLink
            to="/my-activities"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            My Activities
          </NavLink>
        </li>
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
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Profile
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
