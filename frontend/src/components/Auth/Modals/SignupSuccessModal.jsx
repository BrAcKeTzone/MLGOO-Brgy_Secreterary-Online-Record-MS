import React from "react";

const SignupSuccessModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Account Created Successfully!
        </h3>
        <p className="text-gray-600 mb-6">
          Your account has been created and is pending approval from the
          administrator. You will receive an email once your account is
          approved.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Okay
        </button>
      </div>
    </div>
  );
};

export default SignupSuccessModal;
