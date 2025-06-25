import React, { useState } from "react";
import Modal from "../../Common/Modal";
import FormTextbox from "../../Common/FormTextbox";
import { FaExclamationTriangle } from "react-icons/fa";

const RejectReasonModal = ({ isOpen, onClose, onSubmit, documentName }) => {
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // Validate if reason is provided
    if (!rejectReason.trim()) {
      setError("Rejection reason is required");
      return;
    }

    // Reset error and call parent submit handler with reason
    setError("");
    onSubmit(rejectReason);
    setRejectReason(""); // Reset after submit
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Document"
    >
      <div className="p-4">
        <div className="flex items-center mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <FaExclamationTriangle className="text-yellow-500 mr-3 flex-shrink-0" size={20} />
          <p className="text-sm text-yellow-700">
            You are about to reject the document{" "}
            <span className="font-semibold">{documentName}</span>. 
            Please provide a reason for rejection.
          </p>
        </div>

        <FormTextbox
          label="Rejection Reason"
          name="rejectReason"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Please provide a clear reason for rejecting this document"
          required={true}
          error={error}
          rows={4}
        />

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          >
            Reject Document
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RejectReasonModal;
