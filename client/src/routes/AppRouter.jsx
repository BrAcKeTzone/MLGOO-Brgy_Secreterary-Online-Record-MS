// src/routes/AppRouter.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPass from "../pages/ForgotPass";
import Dashboard from "../pages/Dashboard";
import useAuthStore from "../store/authStore";

// Import new pages (you'll need to create these)
import SubmitReport from "../pages/SubmitReport";
import MyReports from "../pages/MyReports";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";
import ManageUsers from "../pages/ManageUsers";
import ManageDocuments from "../pages/ManageDocuments";
import Logs from "../pages/Logs";

const PublicRoute = ({ element, redirectTo, condition }) =>
  condition ? element : <Navigate to={redirectTo} />;

const ProtectedRoute = ({ element, redirectTo, condition }) =>
  condition ? element : <Navigate to={redirectTo} />;

const AppRouter = () => {
  const { user, initializeAuth } = useAuthStore();
  const isBarangaySecretary = user?.role === "role001";
  const isMLGOOStaff = user?.role === "role002";
  const location = useLocation();

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Show loading while initializing auth
  if (!user && location.pathname !== "/login" && location.pathname !== "/signup" && location.pathname !== "/forgot-password") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Default route with smarter redirection */}
      <Route
        path="/"
        element={
          !user ? (
            <Navigate to="/login" />
          ) : isMLGOOStaff ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/home" />
          )
        }
      />

      {/* Add explicit home route for barangay secretary */}
      <Route
        path="/home"
        element={
          <ProtectedRoute
            element={<Home />}
            redirectTo="/login"
            condition={!!user && isBarangaySecretary}
          />
        }
      />

      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute
            element={<Login />}
            redirectTo={isMLGOOStaff ? "/dashboard" : "/"}
            condition={!user}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute
            element={<Signup />}
            redirectTo={isMLGOOStaff ? "/dashboard" : "/"}
            condition={!user}
          />
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute
            element={<ForgotPass />}
            redirectTo={isMLGOOStaff ? "/dashboard" : "/"}
            condition={!user}
          />
        }
      />

      {/* Barangay Secretary Routes */}
      <Route
        path="/submit-report"
        element={
          <ProtectedRoute
            element={<SubmitReport />}
            redirectTo="/login"
            condition={!!user && isBarangaySecretary}
          />
        }
      />
      <Route
        path="/my-reports"
        element={
          <ProtectedRoute
            element={<MyReports />}
            redirectTo="/login"
            condition={!!user && isBarangaySecretary}
          />
        }
      />

      {/* MLGOO Staff Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            element={<Dashboard />}
            redirectTo="/login"
            condition={!!user && isMLGOOStaff}
          />
        }
      />
      <Route
        path="/manage-users"
        element={
          <ProtectedRoute
            element={<ManageUsers />}
            redirectTo="/login"
            condition={!!user && isMLGOOStaff}
          />
        }
      />
      <Route
        path="/manage-documents"
        element={
          <ProtectedRoute
            element={<ManageDocuments />}
            redirectTo="/login"
            condition={!!user && isMLGOOStaff}
          />
        }
      />
      <Route
        path="/logs"
        element={
          <ProtectedRoute
            element={<Logs />}
            redirectTo="/login"
            condition={!!user && isMLGOOStaff}
          />
        }
      />

      {/* Shared Routes */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute
            element={<Notifications />}
            redirectTo="/login"
            condition={!!user}
          />
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute
            element={<Profile />}
            redirectTo="/login"
            condition={!!user}
          />
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
