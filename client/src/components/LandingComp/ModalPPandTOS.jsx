import React from "react";
import { privacyPolicyOptions } from "../../data/options/optionsPrivacyPolicy";
import { termsOfServiceOptions } from "../../data/options/optionsTermsOfService";
import { FaTimes } from "react-icons/fa"; // Import close icon

const Modal = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  let title = "";
  let content = {};

  if (type === "privacy") {
    title = "Privacy Policy";
    content = privacyPolicyOptions;
  } else if (type === "terms") {
    title = "Terms of Service";
    content = termsOfServiceOptions;
  } else {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-y-auto h-full w-full z-50">
      <div className="min-h-screen bg-black bg-opacity-80 flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {Object.entries(content).map(([key, value]) => (
              <div key={key} className="mb-6 last:mb-0">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </h4>
                <p className="text-gray-600 leading-relaxed">{value}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-white"
            >
              I understand and accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
