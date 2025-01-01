import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";

const Sidebar = ({ isVisible, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isVisible ? "visible" : ""}`}>
      <button className="sidebar-close" onClick={toggleSidebar}>
        &times;
      </button>
      <ul>
        <li>
          <Link to="/dashboard" onClick={toggleSidebar}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/sessions" onClick={toggleSidebar}>
            Sessions
          </Link>
        </li>
        <li>
          <Link to="/membership" onClick={toggleSidebar}>
            Membership
          </Link>
        </li>
        <li>
          <Link to="/reports" onClick={toggleSidebar}>
            Reports
          </Link>
        </li>
        <li>
          <Link to="/events" onClick={toggleSidebar}>
            Events
          </Link>
        </li>
        <li>
          <Link to="/my-activities" onClick={toggleSidebar}>
            My Activities
          </Link>
        </li>
        <li>
          <Link to="/training" onClick={toggleSidebar}>
            Training
          </Link>
        </li>
        <li>
          <Link to="/profile" onClick={toggleSidebar}>
            Profile
          </Link>
        </li>
        <li>
          <Link to="/cart" onClick={toggleSidebar}>
            Cart
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
