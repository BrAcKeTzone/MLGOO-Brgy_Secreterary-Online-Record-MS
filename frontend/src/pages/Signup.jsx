import React from "react";
import SignupForm from "../components/Auth/SignupForm";
import AuthLayout from "../components/Common/AuthLayout";

const Signup = () => {
  return (
    <AuthLayout title="Create an Account">
      <SignupForm />
      <p className="mt-4 text-center text-sm text-gray-300">
        Already have an account?{" "}
        <a href="/login" className="text-blue-400 hover:underline">
          Login
        </a>
      </p>
    </AuthLayout>
  );
};

export default Signup;
