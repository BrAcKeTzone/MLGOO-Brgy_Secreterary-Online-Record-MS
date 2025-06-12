// src/pages/Signup.jsx
import React from "react";
import SignupForm from "../components/Auth/SignupForm";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create an Account
        </h1>
        <SignupForm />
      </div>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default Signup;
