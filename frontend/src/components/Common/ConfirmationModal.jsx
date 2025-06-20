import React from "react";

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmButtonClass = "bg-blue-600 hover:bg-blue-700",
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-50"
        style={{ opacity: isOpen ? 0.5 : 0 }}
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
          <h3 className="text-lg font-medium mb-4">{title}</h3>
          <p className="mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
            <button
              className={`px-4 py-2 text-white rounded font-medium transition-colors duration-200 ${confirmButtonClass}`}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;