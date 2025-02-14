import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import Navbar from "./components/layout/Navbar/Navbar";
import Sidebar from "./components/layout/Sidebar/Sidebar";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import ShoppingPage from "./pages/cart/ShoppingPage";
import CreateClass from "./pages/classes/CreateClass";
import AddClass from "./pages/classes/ClassList";
import MyActivities from "./pages/my_activities/MyActivities";
import EvaluationPage from "./pages/evaluation/EvaluationPage";
import TrainingPage from "./pages/training/TrainingPage";
import CreateEvent from "./pages/eventts/CreateEvent";
import CancelClass from "./pages/classes/CancelClass";
import AttendEvent from "./pages/eventts/EventList";
import AddMoneyPage from "./pages/addMoney/AddMoneyPage";
import CancelEvent from "./pages/eventts/CancelEvent";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import SystemReport from "./pages/system-report/SystemReport";
import ManagerPage from "./pages/manager/ManagerPage";
import ViewRatePage from "./pages/viewrate/ViewRatePage"; // Corrected path
import CoachEvaluationPage from "./pages/evalcoach/CoachEvaluationPage";
import ViewClassEvaluationsPage from "./pages/viewclasseval/ViewClassEvaluationPage";
import BeMemberPage from "./pages/bemember/BeMemberPage";
import LifeguardSchedules from "./pages/lifeguard/LifeguardSchedules";

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      {isAuthenticated && <Sidebar />}
      <div className={`main-content ${!isAuthenticated ? "no-sidebar" : ""}`}>
        <Navbar />
        {children}
      </div>
    </div>
  );
};

function App() {
  const [apiStatus, setApiStatus] = useState({ status: "loading" });

  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-class" element={<CreateClass />} />
            <Route path="/add-class" element={<AddClass />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/cancel-class" element={<CancelClass />} />
            <Route path="/attend-event" element={<AttendEvent />} />
            <Route path="/cancel-event" element={<CancelEvent />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/coach-evaluations/:coachId"
              element={<CoachEvaluationPage />}
            />
            <Route
              path="/class-evaluations/:coachId"
              element={<ViewClassEvaluationsPage />}
            />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/system-reports" element={<SystemReport />} />
            <Route path="/manager-page" element={<ManagerPage />} />

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
              path="/cart"
              element={
                <ProtectedRoute>
                  <ShoppingPage />
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
            <Route
              path="/evaluation"
              element={
                <ProtectedRoute>
                  <EvaluationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/training"
              element={
                <ProtectedRoute>
                  <TrainingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-money"
              element={
                <ProtectedRoute>
                  <AddMoneyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/viewrate"
              element={
                <ProtectedRoute>
                  <ViewRatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/become-member"
              element={
                <ProtectedRoute>
                  <BeMemberPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lifeguard-schedules"
              element={
                <ProtectedRoute>
                  <LifeguardSchedules />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
