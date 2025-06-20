import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import useAuthStore from "../../../store/authStore";
import FormInput from "../../Common/FormInput";
import PasswordInput from "../../Common/PasswordInput";
import ErrorMessage from "../../Common/ErrorMessage";
import SubmitButton from "../../Common/SubmitButton";
import OTPInput from "../../Common/OTPInput";

const ModalForgotPass = ({ isOpen, onClose, onBackToLogin, isMobile }) => {
  const {
    requestPasswordReset,
    verifyPasswordResetOtp,
    resetPassword,
    loading,
    error,
  } = useAuthStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setForm({
          email: "",
          otp: "",
          password: "",
          confirmPassword: "",
        });
        setPasswordError("");
      }, 300);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Special handler for OTP input
  const handleOtpChange = (value) => {
    setForm((prev) => ({ ...prev, otp: value }));
  };

  // Validate passwords when either password field changes
  useEffect(() => {
    if (form.password || form.confirmPassword) {
      if (form.password.length < 8) {
        setPasswordError("Password must be at least 8 characters long");
      } else if (form.password !== form.confirmPassword) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }
  }, [form.password, form.confirmPassword]);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(form.email);
      setStep(2);
    } catch (error) {
      console.error("Error requesting reset code:", error);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await verifyPasswordResetOtp(form.email, form.otp);
      setStep(3);
    } catch (error) {
      console.error("Error verifying code:", error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (passwordError) return;

    try {
      await resetPassword(form.email, form.password);
      setStep(4);
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  if (!isOpen) return null;

  // Determine the form background based on the step and mobile status
  const getFormClass = () => {
    if (isMobile) {
      return "max-w-md mx-auto space-y-6 bg-white p-8 rounded-lg shadow-md text-gray-700";
    } else {
      return step === 1
        ? "max-w-md mx-auto space-y-6 bg-white p-8 rounded-lg shadow-md text-gray-700"
        : "space-y-6";
    }
  };

  return (
    <motion.div
      initial={isMobile ? { opacity: 0, y: 20 } : { opacity: 0, scale: 0.95 }}
      animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1 }}
      exit={isMobile ? { opacity: 0, y: 20 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`${
        isMobile
          ? "bg-black/90 h-full w-full flex flex-col justify-center"
          : "bg-black/30 backdrop-blur-md p-8 rounded-lg shadow-xl w-full max-w-md"
      }`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100/20 z-10 text-white"
      >
        <FaTimes />
      </button>

      <div className={`${isMobile ? "px-6 py-8" : "p-6"}`}>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Reset Password
        </h2>

        {step === 1 && (
          <form onSubmit={handleRequestOTP} className={getFormClass()}>
            <p className="text-sm text-gray-600">
              Enter your email address and we'll send you a verification code to
              reset your password.
            </p>

            <FormInput
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />

            <ErrorMessage error={error} />

            <SubmitButton
              loading={loading}
              disabled={!form.email}
              loadingText="Sending Code..."
              text="Send Reset Code"
            />
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={handleVerifyOTP}
            className="max-w-md mx-auto space-y-6 bg-white p-8 rounded-lg shadow-md text-gray-700"
          >
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-2">
                Enter Verification Code
              </label>
              <p className="text-sm text-gray-600 mb-4">
                We sent a verification code to {form.email}
              </p>
              <OTPInput
                value={form.otp || ""}
                onChange={(e) =>
                  handleChange({
                    target: { name: "otp", value: e.target.value },
                  })
                }
              />
            </div>

            <ErrorMessage error={error} />

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
              >
                Back
              </button>
              <SubmitButton
                loading={loading}
                disabled={form.otp.length !== 6}
                loadingText="Verifying..."
                text="Verify Code"
              />
            </div>
          </form>
        )}

        {step === 3 && (
          <form
            onSubmit={handleResetPassword}
            className="max-w-md mx-auto space-y-6 bg-white p-8 rounded-lg shadow-md text-gray-700"
          >
            <h2 className="text-xl font-semibold text-gray-600">
              Create New Password
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Please enter your new password
            </p>

            <PasswordInput
              label="New Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
              required
              placeholder="Enter new password"
            />

            <PasswordInput
              label="Confirm New Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
              required
              placeholder="Confirm your new password"
              showStrength={false}
            />

            <ErrorMessage error={error || passwordError} />

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
              >
                Back
              </button>
              <SubmitButton
                loading={loading}
                disabled={
                  !form.password || !form.confirmPassword || passwordError
                }
                loadingText="Resetting..."
                text="Reset Password"
              />
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="max-w-md mx-auto space-y-6 bg-white p-8 rounded-lg shadow-md text-gray-700 text-center">
            <div className="text-green-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-600">
              Password Reset Successful
            </h2>
            <p className="text-gray-600">
              Your password has been successfully reset. You can now login with
              your new password.
            </p>
            <button
              onClick={onBackToLogin}
              className="block w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Go to Login
            </button>
          </div>
        )}

        {step !== 4 && (
          <p className="mt-6 text-center text-sm text-gray-300">
            Remember your password?{" "}
            <button
              onClick={onBackToLogin}
              className="text-blue-500 hover:underline bg-transparent border-none p-0 inline cursor-pointer"
            >
              Login here
            </button>
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ModalForgotPass;
