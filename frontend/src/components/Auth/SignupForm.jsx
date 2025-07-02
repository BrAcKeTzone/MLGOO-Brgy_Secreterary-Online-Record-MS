import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import InitialInfoStep from "./Steps/InitialInfoStep";
import OTPVerificationStep from "./Steps/OTPVerificationStep";
import AccountDetailsStep from "./Steps/AccountDetailsStep";
import { validatePassword } from "../../utils/passwordUtils";

const SignupForm = ({ onSignupSuccess }) => {
  // const navigate = useNavigate();
  const { requestOTP, verifyOTP, signup, loading, error } = useAuthStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    role: "",
    assignedBrgy: "",
    otp: "",
    lastName: "",
    firstName: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    validIDTypeId: "",
    nationalIdFront: null,
    nationalIdBack: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (form.confirmPassword && form.password !== form.confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }, [form.password, form.confirmPassword]);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    try {
      await requestOTP(form.email);
      setStep(2);
    } catch (error) {
      console.error("Error requesting OTP:", error);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await verifyOTP(form.email, form.otp);
      setStep(3);
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordValidationErrors = validatePassword(form.password);
    if (passwordValidationErrors.length > 0) {
      setPasswordError(passwordValidationErrors.join(". "));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      await signup(form);
      // Signal to the parent component that signup was successful
      if (onSignupSuccess) {
        onSignupSuccess();
      }
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  return (
    <>
      {step === 1 && (
        <InitialInfoStep
          form={form}
          loading={loading}
          error={error}
          handleChange={handleChange}
          handleSubmit={handleRequestOTP}
        />
      )}
      {step === 2 && (
        <OTPVerificationStep
          email={form.email}
          otp={form.otp}
          loading={loading}
          error={error}
          handleChange={handleChange}
          handleSubmit={handleVerifyOTP}
          handleBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <AccountDetailsStep
          form={form}
          loading={loading}
          error={error}
          passwordError={passwordError}
          showPassword={showPassword}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleBack={() => setStep(2)}
          togglePassword={() => setShowPassword(!showPassword)}
        />
      )}
    </>
  );
};

export default SignupForm;
