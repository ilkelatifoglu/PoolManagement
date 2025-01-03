import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./sidebar.css";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";

const Sidebar = () => {
  const { isAuthenticated, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!localStorage.getItem("token")) {
    return null;
  }

  // Only show limited options for lifeguards
  const isLifeguard = user?.user_type === "lifeguard";

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <HiChevronDoubleRight /> : <HiChevronDoubleLeft />}
      </button>
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Dashboard
            </NavLink>
          </li>
          {(localStorage.getItem("role") === "swimmer" ||
            localStorage.getItem("role") === "coach") && (
            <li>
              <NavLink
                to="/my-activities"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                My Activities
              </NavLink>
            </li>
          )}
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
              to="/attend-event"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Attend Event
            </NavLink>
          </li>
          {user?.user_type === "manager" && (
            <>
              {user?.user_type !== "manager" && (
                <li>
                  <NavLink
                    to="/my-activities"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    My Activities
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  to="/training"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Training
                </NavLink>
              </li>
              {user?.user_type !== "coach" && user?.user_type !== "manager" && (
                <li>
                  <NavLink
                    to="/add-class"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Enroll to Class
                  </NavLink>
                </li>
              )}
              {user?.user_type === "coach" ||
                (user?.user_type === "administrator" && (
                  <li>
                    <NavLink
                      to="/create-class"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      Create Class
                    </NavLink>
                  </li>
                ))}

              <li>
                <NavLink
                  to="/attend-event"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Attend Event
                </NavLink>
              </li>
              {user?.user_type === "manager" ||
                (user?.user_type === "administrator" && (
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
                ))}
              {user?.user_type === "administrator" && (
                <li>
                  <NavLink
                    to="/reports"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Reports
                  </NavLink>
                </li>
              )}
              {user?.user_type !== "swimmer" && user?.user_type !== "coach" && (
                <li>
                  <NavLink
                    to="/cancel-event"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Cancel Event
                  </NavLink>
                </li>
              )}

              {user?.user_type !== "coach" && user?.user_type !== "manager" && (
                <li>
                  <NavLink
                    to="/become-member"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Be Member
                  </NavLink>
                </li>
              )}

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
                  Coach/Class Evals.
                </NavLink>
              </li>
            </>
          )}
          {user?.user_type === "administrator" && (
            <li>
              <NavLink
                to="/system-reports"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                System Reports
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
              to="/become-member"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Be Member
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
              Coach/Class Evals.
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
          {(user?.user_type === "manager" ||
            user?.user_type === "administrator") && (
            <>
              <li>
                <NavLink
                  to="/lifeguard-schedules"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Lifeguard Schedules
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
