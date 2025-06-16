// src/routes/AppRouter.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";

import Home from "../pages/BrgyDashboard";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPass from "../pages/ForgotPass";
import Dashboard from "../pages/AdminDashboard";
import useAuthStore from "../store/authStore";

import SubmitReport from "../pages/SubmitReport";
import MyReports from "../pages/MyReports";
import AdminNotification from "../pages/AdminNotifications";
import BrgyNotifications from "../pages/BrgyNotifications";
import Profile from "../pages/Profile";
import ManageUsers from "../pages/ManageUsers";
import ManageDocuments from "../pages/ManageDocuments";
import Logs from "../pages/Logs";

import LoadingScreen from "../components/Common/LoadingScreen";

// Higher-Order Component for Protected Routes
const ProtectedRoute = ({ children, redirectTo, condition, location }) => {
  return condition ? (
    children
  ) : (
    <Navigate to={redirectTo} state={{ from: location }} replace />
  );
};

const AppRouter = () => {
  const { user, loading, initializeAuth } = useAuthStore();
  const isBarangaySecretary = user?.role === "role001";
  const isMLGOOStaff = user?.role === "role002";
  const location = useLocation();

  useEffect(() => {
    initializeAuth();
  }, []);

  // Show loading screen only during initial auth check
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/home" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/home" replace /> : <Signup />}
      />
      <Route
        path="/forgot-password"
        element={user ? <Navigate to="/home" replace /> : <ForgotPass />}
      />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute
            condition={!!user}
            redirectTo="/login"
            location={location.pathname}
          >
            {isMLGOOStaff ? <Navigate to="/dashboard" replace /> : <Home />}
          </ProtectedRoute>
        }
      />

      {/* Barangay Secretary Routes */}
      <Route
        path="/submit-report"
        element={
          <ProtectedRoute
            condition={!!user && isBarangaySecretary}
            redirectTo="/login"
            location={location.pathname}
          >
            <SubmitReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-reports"
        element={
          <ProtectedRoute
            condition={!!user && isBarangaySecretary}
            redirectTo="/login"
            location={location.pathname}
          >
            <MyReports />
          </ProtectedRoute>
        }
      />

      {/* MLGOO Staff Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            condition={!!user && isMLGOOStaff}
            redirectTo="/login"
            location={location.pathname}
          >
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-users"
        element={
          <ProtectedRoute
            condition={!!user && isMLGOOStaff}
            redirectTo="/login"
            location={location.pathname}
          >
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-documents"
        element={
          <ProtectedRoute
            condition={!!user && isMLGOOStaff}
            redirectTo="/login"
            location={location.pathname}
          >
            <ManageDocuments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute
            condition={!!user}
            redirectTo="/login"
            location={location.pathname}
          >
            {isMLGOOStaff ? <AdminNotification /> : <BrgyNotifications />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs"
        element={
          <ProtectedRoute
            condition={!!user && isMLGOOStaff}
            redirectTo="/login"
            location={location.pathname}
          >
            <Logs />
          </ProtectedRoute>
        }
      />

      {/* Shared Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute
            condition={!!user}
            redirectTo="/login"
            location={location.pathname}
          >
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
