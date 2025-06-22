import React, { useState, useEffect } from "react";
import PasswordInput from "../../Common/PasswordInput";
import ErrorMessage from "../../Common/ErrorMessage";
import SubmitButton from "../../Common/SubmitButton";
import ImageUploadInput from "../../Common/ImageUploadInput";
import FormSelect from "../../Common/FormSelect";
import Modal from "../../Common/ModalPPandTOS";
import useSettingsStore from "../../../store/settingsStore";

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
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [selectedIdTypeDescription, setSelectedIdTypeDescription] = useState("");

  // Get valid ID types from settings store
  const {
    validIDTypes,
    fetchActiveValidIDTypes,
    loading: loadingIDTypes,
  } = useSettingsStore();

  // Fetch active valid ID types on component mount
  useEffect(() => {
    fetchActiveValidIDTypes();
  }, [fetchActiveValidIDTypes]);

  // Update description when ID type changes
  useEffect(() => {
    if (form.validIDTypeId && validIDTypes.length > 0) {
      const selectedType = validIDTypes.find(
        (type) =>
          type.id === parseInt(form.validIDTypeId, 10) ||
          type.id === form.validIDTypeId
      );
      setSelectedIdTypeDescription(selectedType?.description || "");
    } else {
      setSelectedIdTypeDescription("");
    }
  }, [form.validIDTypeId, validIDTypes]);

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

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  // Check if an ID type is selected
  const hasIdTypeSelected = !!form.validIDTypeId;

  const isFormValid =
    form.password &&
    form.confirmPassword &&
    form.validIDTypeId &&
    (hasIdTypeSelected ? form.nationalIdFront && form.nationalIdBack : true) &&
    acceptedPolicies &&
    !passwordError;

  // Format validIDTypes for the FormSelect component
  const formattedIDTypes = validIDTypes
    .filter((idType) => idType.isActive) // Only show active ID types
    .map((idType) => ({
      id: idType.id,
      name: idType.name,
    }));

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-6 bg-white p-8 rounded-lg shadow-md text-gray-700"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">ID Verification</h3>
        <p className="text-sm text-gray-500 mb-4">
          Please upload clear images of your valid government-issued ID
        </p>

        <div className="space-y-2">
          <FormSelect
            label="ID Type"
            name="validIDTypeId"
            value={form.validIDTypeId || ""}
            onChange={handleChange}
            required
            options={formattedIDTypes}
            placeholder="Select ID type"
            error={loadingIDTypes ? "Loading ID types..." : ""}
          />

          {selectedIdTypeDescription && (
            <div className="text-sm text-gray-600 italic px-2 py-1 bg-gray-50 rounded-md">
              {selectedIdTypeDescription}
            </div>
          )}
        </div>

        {hasIdTypeSelected && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploadInput
              label="Valid ID(Front)"
              name="nationalIdFront"
              onChange={handleImageChange}
              preview={previews.nationalIdFront}
              required
            />

            <ImageUploadInput
              label="Valid ID(Back)"
              name="nationalIdBack"
              onChange={handleImageChange}
              preview={previews.nationalIdBack}
              required
            />
          </div>
        )}
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
        showStrength={false}
      />

      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="policies"
              type="checkbox"
              checked={acceptedPolicies}
              onChange={() => setAcceptedPolicies((prev) => !prev)}
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="policies" className="font-medium text-gray-900">
              I accept the{" "}
              <button
                type="button"
                onClick={() => openModal("privacy")}
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => openModal("terms")}
                className="text-blue-600 hover:underline"
              >
                Terms of Service
              </button>
            </label>
          </div>
        </div>
      </div>

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

      <Modal isOpen={isModalOpen} onClose={closeModal} type={modalType} />
    </form>
  );
};

export default AccountDetailsStep;
