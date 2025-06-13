import React, { useState } from "react";
import FormInput from "../../Common/FormInput";
import PasswordInput from "../../Common/PasswordInput";
import ErrorMessage from "../../Common/ErrorMessage";
import SubmitButton from "../../Common/SubmitButton";
import ImageUploadInput from "../../Common/ImageUploadInput";

const AccountDetailsStep = ({
  form,
  loading,
  error,
  showPassword,
  passwordError,
  handleChange,
  handleSubmit,
  handleBack,
  togglePassword,
}) => {
  const [previews, setPreviews] = useState({
    nationalIdFront: null,
    nationalIdBack: null,
  });

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    handleChange(e);

    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({
          ...prev,
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const isFormValid =
    form.password &&
    form.confirmPassword &&
    form.dateOfBirth &&
    form.nationalIdFront &&
    form.nationalIdBack;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-6 bg-white p-8 rounded-lg shadow-md"
    >
      <FormInput
        label="Date of Birth"
        type="date"
        name="dateOfBirth"
        value={form.dateOfBirth}
        onChange={handleChange}
        required
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">ID Verification</h3>
        <p className="text-sm text-gray-500 mb-4">
          Please upload clear images of your valid government-issued ID
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUploadInput
            label="National ID (Front)"
            name="nationalIdFront"
            onChange={handleImageChange}
            preview={previews.nationalIdFront}
            required
          />

          <ImageUploadInput
            label="National ID (Back)"
            name="nationalIdBack"
            onChange={handleImageChange}
            preview={previews.nationalIdBack}
            required
          />
        </div>
      </div>

      <PasswordInput
        label="Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        showPassword={showPassword}
        togglePassword={togglePassword}
        required
        placeholder="Create password"
      />

      <PasswordInput
        label="Confirm Password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        showPassword={showPassword}
        togglePassword={togglePassword}
        required
        placeholder="Confirm your password"
        error={passwordError}
        showStrength={false}
      />

      <ErrorMessage error={error || passwordError} />

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
          disabled={!isFormValid || passwordError}
          loadingText="Creating account..."
          text="Create Account"
        />
      </div>
    </form>
  );
};

export default AccountDetailsStep;
