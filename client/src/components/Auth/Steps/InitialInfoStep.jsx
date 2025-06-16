import React, { useEffect } from "react";
import FormInput from "../../Common/FormInput";
import FormSelect from "../../Common/FormSelect";
import ErrorMessage from "../../Common/ErrorMessage";
import SubmitButton from "../../Common/SubmitButton";
import useBrgyStore from "../../../store/brgyStore";
import useRoleStore from "../../../store/roleStore";

const InitialInfoStep = ({
  form,
  loading,
  error,
  handleChange,
  handleSubmit,
}) => {
  const { barangays, error: fetchBrgyError, fetchBarangays } = useBrgyStore();
  const { roles, error: fetchRoleError, fetchRoles } = useRoleStore();

  useEffect(() => {
    fetchBarangays();
    fetchRoles();
  }, [fetchBarangays, fetchRoles]);

  const isFormValid =
    form.email &&
    form.role &&
    form.lastName &&
    form.firstName &&
    form.dateOfBirth &&
    (form.role === "role002" || (form.role === "role001" && form.assignedBrgy));

  const isBarangaySecretary = form.role === "role001";

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
        required
        placeholder="Enter your work email"
      />

      <FormSelect
        label="Role"
        name="role"
        value={form.role}
        onChange={handleChange}
        required
        options={roles}
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
          options={barangays}
          placeholder="Select a barangay"
          error={fetchBrgyError}
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
          placeholder="Enter last name"
        />
        <FormInput
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
          placeholder="Enter first name"
        />
      </div>

      <FormInput
        label="Date of Birth"
        type="date"
        name="dateOfBirth"
        value={form.dateOfBirth}
        onChange={handleChange}
        required
      />

      <ErrorMessage error={error} />

      <SubmitButton
        loading={loading}
        disabled={!isFormValid}
        loadingText="Verifying Details..."
        text="Get Verification Code"
      />
    </form>
  );
};

export default InitialInfoStep;
