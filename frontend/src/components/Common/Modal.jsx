import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({ isOpen, onClose, title, children }) => {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Background overlay - using fixed black with opacity like in ModalPPandTOS */}
      <div
        className="fixed inset-0 bg-black transition-opacity duration-300 ease-in-out"
        style={{ opacity: 0.5 }}
        aria-hidden="true"
        onClick={onClose}
      ></div>

      {/* Center container */}
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <div className="min-h-screen px-4 text-center flex items-center justify-center">
          {/* Modal panel - centered alignment */}
          <div className="relative w-full max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
            <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all duration-300 ease-in-out">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                  <h3
                    className="text-xl font-semibold text-gray-900"
                    id="modal-title"
                  >
                    {title}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center transition-colors duration-200"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
