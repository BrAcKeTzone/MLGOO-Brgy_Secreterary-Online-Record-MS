import React, { useState, useEffect } from "react";
import Portal from "./Portal";
import { FaTimes } from "react-icons/fa";
import useSettingsStore from "../../store/settingsStore";
import LoadingScreen from "./LoadingScreen";

const Modal = ({ isOpen, onClose, type }) => {
  const {
    fetchPrivacyPolicy,
    fetchTermsOfService,
    privacyPolicy,
    termsOfService,
    loading,
  } = useSettingsStore();

  const [sections, setSections] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (type === "privacy") {
        setTitle("Privacy Policy");
        fetchPrivacyPolicy();
      } else if (type === "terms") {
        setTitle("Terms of Service");
        fetchTermsOfService();
      }
    }
  }, [isOpen, type, fetchPrivacyPolicy, fetchTermsOfService]);

  useEffect(() => {
    if (type === "privacy") {
      // Sort sections by order
      const sortedSections = [...privacyPolicy].sort(
        (a, b) => a.order - b.order
      );
      setSections(sortedSections);
    } else if (type === "terms") {
      // Sort sections by order
      const sortedSections = [...termsOfService].sort(
        (a, b) => a.order - b.order
      );
      setSections(sortedSections);
    }
  }, [type, privacyPolicy, termsOfService]);

  if (!isOpen) return null;

  return (
    <Portal>
      <>
        <div
          className="fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-[9999]"
          style={{
            opacity: 0.5,
          }}
          onClick={onClose}
        />
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className={`
                inline-block w-full max-w-[90%] md:max-w-[600px] lg:max-w-[800px] 
                p-6 my-8 text-left align-middle bg-white rounded-lg shadow-xl 
                transform transition-all duration-300 ease-in-out
                ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}
              `}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center transition-colors duration-200"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <LoadingScreen message={`Loading ${title}...`} />
                  </div>
                ) : sections.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No content available at this time.
                    </p>
                  </div>
                ) : (
                  sections.map((section) => (
                    <div key={section.id} className="mb-6 last:mb-0">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {section.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {section.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className={`w-full inline-flex justify-center items-center px-4 py-2 
                    ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } 
                    focus:ring-4 focus:outline-none focus:ring-blue-300 
                    font-medium rounded-lg text-sm text-white
                    transition-colors duration-200
                  `}
                >
                  I understand and accept
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </Portal>
  );
};

export default Modal;
