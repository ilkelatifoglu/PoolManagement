import React, { useState } from "react"; // Added `useState` import
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import Navbar from "./components/layout/Navbar/Navbar";
import Sidebar from "./components/layout/Sidebar/Sidebar";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import CreateClass from "./pages/classes/CreateClass"; // Corrected path
import AddClass from "./pages/classes/ClassList"; // Corrected path
import MyActivities from "./pages/my_activities/MyActivities";
import SystemReport from "./pages/system-report/SystemReport"; // Corrected path

function App() {
  const [apiStatus, setApiStatus] = useState({ status: "loading" });
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <AuthProvider>
      <Router>
      <div style={{ display: "flex" }}>
          <Sidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
          <div style={{ flex: 1 }}>
            <Navbar toggleSidebar={toggleSidebar} />
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-class" element={<CreateClass />} />
              <Route path="/add-class" element={<AddClass />} />
              <Route path="/system-reports" element={<SystemReport />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-activities"
                element={
                  <ProtectedRoute>
                    <MyActivities />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
