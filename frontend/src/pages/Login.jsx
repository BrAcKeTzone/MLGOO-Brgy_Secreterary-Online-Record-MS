import React from "react";
import LoginForm from "../components/Auth/LoginForm";
import AuthLayout from "../components/Common/AuthLayout";

const Login = ({ onForgotPasswordClick, onRegisterClick }) => {
  return (
    <AuthLayout title="Login to Your Account">
      <LoginForm />
      <p className="mt-4 text-center text-sm text-white">
        Don't have an account?{" "}
        <button
          onClick={onRegisterClick}
          className="text-blue-500 hover:underline bg-transparent border-none p-0 inline cursor-pointer"
        >
          Sign up
        </button>
      </p>
      <p className="text-center text-sm text-white">
        Forgot your password?{" "}
        <button
          onClick={onForgotPasswordClick}
          className="text-blue-500 hover:underline bg-transparent border-none p-0 inline cursor-pointer"
        >
          Reset it here
        </button>
      </p>
    </AuthLayout>
  );
};

export default Login;
