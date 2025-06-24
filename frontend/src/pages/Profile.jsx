import React, { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useProfileStore from "../store/profileStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import FormInput from "../components/Common/FormInput";
import PasswordInput from "../components/Common/PasswordInput";
import NationalIdSection from "../components/ProfileComp/NationalIdSection";

const Profile = () => {
  const { user } = useAuthStore();
  const { profileData, loading, error, fetchProfile, changePassword } =
    useProfileStore();

  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        dateOfBirth: profileData.dateOfBirth?.split("T")[0],
        nationalIdFront: profileData.validIDFrontUrl,
        nationalIdBack: profileData.validIDBackUrl,
        idType: profileData.validIDType?.name,
      });
    }
  }, [profileData]);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    try {
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password changed successfully!");
    } catch (err) {
      alert("Failed to change password");
    }
  };

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (loading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:py-6 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header - Responsive text sizes */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
            My Profile
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            View your profile information
          </p>
        </div>

        {/* Profile Information - Responsive padding and spacing */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Profile Information
          </h2>

          {/* Responsive grid layout that stacks on small screens */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {/* Name section - 2 columns on medium screens and up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormInput
                label="First Name"
                name="firstName"
                value={formData.firstName || ""}
                disabled={true}
              />
              <FormInput
                label="Last Name"
                name="lastName"
                value={formData.lastName || ""}
                disabled={true}
              />
            </div>

            {/* Email and DOB section - 2 columns on medium screens and up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email || ""}
                disabled={true}
              />
              <FormInput
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ""}
                disabled={true}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Role - Full width regardless of screen size */}
              <FormInput
                label="Role"
                name="role"
                value={profileData?.role || ""}
                disabled={true}
              />

              {/* Barangay - Only shown for users with assigned barangay */}
              {profileData?.assignedBrgy && (
                <FormInput
                  label="Assigned Barangay"
                  name="barangay"
                  value={profileData.assignedBrgy?.name || ""}
                  disabled={true}
                />
              )}
            </div>
          </div>
        </div>

        {/* National ID Images - Only shown if they exist */}
        {(formData.nationalIdFront || formData.nationalIdBack) && (
          <NationalIdSection
            frontImage={formData.nationalIdFront}
            backImage={formData.nationalIdBack}
            idType={formData.idType}
          />
        )}

        {/* Password Change Form - Responsive padding and spacing */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          {/* Responsive header with flex layout that works on all screens */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Change Password
            </h2>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="text-blue-600 hover:text-blue-800 text-sm sm:text-base py-1 px-3 border border-blue-600 rounded-md sm:border-0 sm:p-0 self-start sm:self-auto"
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-3 sm:space-y-4">
                <PasswordInput
                  label="Current Password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  showPassword={showPasswords.current}
                  togglePassword={() => togglePassword("current")}
                  required
                  showStrength={false}
                />
                <PasswordInput
                  label="New Password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  showPassword={showPasswords.new}
                  togglePassword={() => togglePassword("new")}
                  required
                  placeholder="Enter new password"
                />
                <PasswordInput
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  showPassword={showPasswords.confirm}
                  togglePassword={() => togglePassword("confirm")}
                  required
                  placeholder="Confirm new password"
                  showStrength={false}
                />
              </div>

              <div className="mt-4 sm:mt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                >
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
