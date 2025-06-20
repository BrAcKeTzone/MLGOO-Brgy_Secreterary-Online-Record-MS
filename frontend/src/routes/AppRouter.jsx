import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

import Home from "../pages/BrgyDashboard";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPass from "../pages/ForgotPass";
import Dashboard from "../pages/AdminDashboard";

import SubmitReport from "../pages/SubmitReport";
import MyReports from "../pages/MyReports";
import AdminNotification from "../pages/AdminNotifications";
import BrgyNotifications from "../pages/BrgyNotifications";
import Profile from "../pages/Profile";
import ManageUsers from "../pages/ManageUsers";
import ManageDocuments from "../pages/ManageDocuments";
import Logs from "../pages/Logs";
import Settings from "../pages/Settings";

import LoadingScreen from "../components/Common/LoadingScreen";

// Higher-Order Component for Protected Routes
const ProtectedRoute = ({ children, redirectTo, condition }) => {
  const { initialized } = useAuthStore();

  // Don't render anything while auth is initializing
  if (!initialized) {
    return <LoadingScreen />;
  }

  return condition ? children : <Navigate to={redirectTo} replace />;
};

const AppRouter = () => {
  const { user, loading, initialized, initializeAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!initialized) {
      initializeAuth();
    }
  }, [initialized]); // Keep initialized in dependencies

  // Only show loading screen during initial auth check
  if (!initialized) {
    return <LoadingScreen />;
  }

  const isBarangaySecretary = user?.role === "BARANGAY_SECRETARY";
  const isMLGOOStaff = user?.role === "MLGOO_STAFF";

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={user ? <Navigate to="/home" replace /> : <Landing />}
      />
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
            redirectTo="/"
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
            redirectTo="/"
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
            redirectTo="/"
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
            redirectTo="/"
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
            redirectTo="/"
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
            redirectTo="/"
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
            redirectTo="/"
            location={location.pathname}
          >
            <Logs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute
            condition={!!user && isMLGOOStaff}
            redirectTo="/"
            location={location.pathname}
          >
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Shared Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute
            condition={!!user}
            redirectTo="/"
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
