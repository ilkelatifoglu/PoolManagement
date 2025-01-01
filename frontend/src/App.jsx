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
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import CreateClass from "./pages/classes/CreateClass"; // Corrected path
import AddClass from "./pages/classes/ClassList"; // Corrected path
import SystemReport from "./pages/system-report/SystemReport"; // Corrected path

function App() {
  const [apiStatus, setApiStatus] = useState({ status: "loading" }); // Correctly initialized `useState`

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
