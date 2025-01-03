import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./sidebar.css";

const Sidebar = () => {
  const { isAuthenticated } = useAuth();
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
            to="/reports"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Reports
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
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Profile
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
            Evaluation
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/create-class"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Create Class
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/add-class"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Add Class
          </NavLink>
        </li>
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
            to="/create-event"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Create Event
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
        <li>
          <NavLink
            to="/cancel-event"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Cancel Event
          </NavLink>
        </li>
        <li>
          <Link to="/viewrate" onClick={toggleSidebar}>
            Coach/Class Evaluations
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
