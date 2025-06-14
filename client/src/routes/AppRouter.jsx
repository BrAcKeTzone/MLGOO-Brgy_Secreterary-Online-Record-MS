// src/routes/AppRouter.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPass from "../pages/ForgotPass";
import Dashboard from "../pages/Dashboard";
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

const PublicRoute = ({ element, redirectTo, condition }) =>
  condition ? (
    element
  ) : (
    <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
  );

const ProtectedRoute = ({ element, redirectTo, condition }) =>
  condition ? (
    element
  ) : (
    <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
  );

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
      {/* Default route with improved handling */}
      <Route
        path="/"
        element={
          !user ? (
            <Navigate to="/login" />
          ) : isMLGOOStaff ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/home" replace />
          )
        }
      />

      {/* Public routes - don't redirect if already on these paths */}
      <Route
        path="/login"
        element={
          <PublicRoute
            element={<Login />}
            redirectTo={
              location.state?.from || (isMLGOOStaff ? "/dashboard" : "/home")
            }
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
        path="/notifications"
        element={
          <ProtectedRoute
            element={
              isMLGOOStaff ? <AdminNotification /> : <BrgyNotifications />
            }
            redirectTo="/login"
            condition={!!user}
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
