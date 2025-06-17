import React from "react";
import Portal from "./Portal";
import { privacyPolicyOptions } from "../../data/options/optionsPrivacyPolicy";
import { termsOfServiceOptions } from "../../data/options/optionsTermsOfService";
import { FaTimes } from "react-icons/fa";

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
    <Portal>
      <div
        className="fixed inset-0  bg-opacity-80 z-[9999] overflow-y-auto"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="min-h-screen px-4 text-center">
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="inline-block w-full max-w-[90%] md:max-w-[600px] lg:max-w-[800px] p-6 my-8 text-left align-middle bg-white rounded-lg shadow-xl transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="mt-4 max-h-[60vh] overflow-y-auto">
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
            <div className="mt-6 pt-4 border-t">
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
    </Portal>
  );
};

export default Modal;
