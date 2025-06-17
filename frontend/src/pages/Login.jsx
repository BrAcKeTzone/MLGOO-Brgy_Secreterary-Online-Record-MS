import React from "react";
import LoginForm from "../components/Auth/LoginForm";
import AuthLayout from "../components/Common/AuthLayout";

const Login = () => {
  return (
    <AuthLayout title="Login to Your Account">
      <LoginForm />
      <p className="mt-4 text-center text-sm text-white">
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-500 hover:underline">
          Sign up
        </a>
      </p>
      <p className="text-center text-sm text-white">
        Forgot your password?{" "}
        <a href="/forgot-password" className="text-blue-500 hover:underline">
          Reset it here
        </a>
      </p>
    </AuthLayout>
  );
};

export default Login;
