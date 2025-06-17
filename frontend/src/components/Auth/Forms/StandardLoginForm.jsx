import React from "react";
import FormInput from "../../Common/FormInput";
import PasswordInput from "../../Common/PasswordInput";
import ErrorMessage from "../../Common/ErrorMessage";
import SubmitButton from "../../Common/SubmitButton";

const StandardLoginForm = ({
  form,
  loading,
  error,
  showPassword,
  handleChange,
  handleSubmit,
  togglePassword,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-6 bg-white p-8 rounded-lg shadow-md"
    >
      <FormInput
        label="Email Address"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
      />

      <PasswordInput
        label="Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        showPassword={showPassword}
        togglePassword={togglePassword}
        placeholder="Enter your password"
        required
        showStrength={false}
      />

      <ErrorMessage error={error} />

      <SubmitButton
        loading={loading}
        disabled={!form.email || !form.password}
        loadingText="Logging in..."
        text="Login"
      />
    </form>
  );
};

export default StandardLoginForm;
