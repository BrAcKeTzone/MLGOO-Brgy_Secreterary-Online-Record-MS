import React, { useEffect } from "react";
import FormInput from "../../Common/FormInput";
import FormSelect from "../../Common/FormSelect";
import PasswordInput from "../../Common/PasswordInput";
import ErrorMessage from "../../Common/ErrorMessage";
import SubmitButton from "../../Common/SubmitButton";
import useSettingsStore from "../../../store/settingsStore";
import useRoleStore from "../../../store/roleStore";

const StandardLoginForm = ({
  form,
  loading,
  error,
  showPassword,
  handleChange,
  handleSubmit,
  togglePassword,
}) => {
  const { barangays, error: fetchBrgyError, fetchBarangays } = useSettingsStore();
  const { roles, error: fetchRoleError, fetchRoles } = useRoleStore();

  useEffect(() => {
    fetchBarangays();
    fetchRoles();
  }, [fetchBarangays, fetchRoles]);

  // Format barangays to ensure they have proper id structure
  const formattedBarangays = barangays.map((brgy) => ({
    _id: brgy.id || brgy._id,
    id: brgy.id || brgy._id, // Ensure both formats exist
    name: brgy.name,
  }));

  // Format roles to ensure they have proper id structure
  const formattedRoles = roles.map((role) => ({
    _id: role.id || role._id,
    id: role.id || role._id, // Ensure both formats exist
    name: role.name,
  }));

  const isBarangaySecretary = form.role === "BARANGAY_SECRETARY";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-6 bg-white p-8 rounded-lg shadow-md text-gray-700"
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

      <FormSelect
        label="Role"
        name="role"
        value={form.role}
        onChange={handleChange}
        required
        options={formattedRoles}
        placeholder="Select your role"
        error={fetchRoleError}
      />

      {isBarangaySecretary && (
        <FormSelect
          label="Assigned Barangay"
          name="assignedBrgy"
          value={form.assignedBrgy}
          onChange={handleChange}
          required
          options={formattedBarangays}
          placeholder="Select a barangay"
          error={fetchBrgyError}
        />
      )}

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
        disabled={!form.email || !form.password || !form.role || (isBarangaySecretary && !form.assignedBrgy)}
        loadingText="Logging in..."
        text="Login"
      />
    </form>
  );
};

export default StandardLoginForm;
