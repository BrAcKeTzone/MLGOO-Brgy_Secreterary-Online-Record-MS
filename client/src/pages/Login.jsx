// src/pages/Login.jsx
import React from "react";
import LoginForm from "../components/Auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login to Your Account
        </h1>
        <LoginForm />
      </div>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
      <p className="text-center text-sm text-gray-600">
        Forgot your password?{" "}
        <a href="/forgot-password" className="text-blue-600 hover:underline">
          Reset it here
        </a>
      </p>
    </div>
  );
};

export default Login;
