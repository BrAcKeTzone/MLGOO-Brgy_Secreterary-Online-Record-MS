import React from "react";
import SignupForm from "../components/Auth/SignupForm";
import AuthLayout from "../components/Common/AuthLayout";

const Signup = ({ onLoginClick }) => {
  return (
    <AuthLayout title="Create an Account">
      <SignupForm />
      <p className="mt-4 text-center text-sm text-gray-300">
        Already have an account?{" "}
        <button
          onClick={onLoginClick}
          className="text-blue-400 hover:underline bg-transparent border-none p-0 inline cursor-pointer"
        >
          Login
        </button>
      </p>
    </AuthLayout>
  );
};

export default Signup;
