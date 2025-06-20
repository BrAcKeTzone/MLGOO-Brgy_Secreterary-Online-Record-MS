import React from "react";
import OTPInput from "../../Common/OTPInput";
import ErrorMessage from "../../Common/ErrorMessage";
import SubmitButton from "../../Common/SubmitButton";

const OTPVerificationStep = ({
  email,
  otp,
  loading,
  error,
  handleChange,
  handleSubmit,
  handleBack,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-6 bg-white p-8 rounded-lg shadow-md text-gray-700"
    >
      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Enter Verification Code
        </label>
        <p className="text-sm text-gray-600 mb-4">
          We sent a verification code to {email}
        </p>
        <OTPInput value={otp} onChange={handleChange} />
      </div>

      <ErrorMessage error={error} />

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
        >
          Back
        </button>
        <SubmitButton
          loading={loading}
          disabled={otp.length !== 6}
          loadingText="Verifying..."
          text="Verify OTP"
        />
      </div>
    </form>
  );
};

export default OTPVerificationStep;
