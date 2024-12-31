import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext"; // Corrected path
import ProtectedRoute from "./components/routing/ProtectedRoute"; // Corrected path
import Navbar from "./components/layout/Navbar/Navbar"; // Corrected path
import Login from "./pages/auth/Login"; // Corrected path
import Register from "./pages/auth/Register"; // Corrected path
import Dashboard from "./pages/dashboard/Dashboard"; // Corrected path
import CreateClass from "./pages/classes/CreateClass"; // Corrected path
import AddClass from "./pages/classes/ClassList"; // Corrected path

function App() {
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

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
