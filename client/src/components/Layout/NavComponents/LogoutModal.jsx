import React from "react";

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-50"
        style={{
          opacity: isOpen ? 0.5 : 0,
        }}
        onClick={onCancel}
      />
      <div
        className={`
          fixed top-1/2 left-1/2 transform -translate-x-1/2 
          transition-all duration-300 ease-in-out z-50 
          w-[90%] max-w-md bg-white rounded-lg shadow-xl
          ${
            isOpen
              ? "opacity-100 -translate-y-1/2 scale-100"
              : "opacity-0 -translate-y-[40%] scale-95"
          }
        `}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Confirm Logout
          </h3>
          <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutModal;
