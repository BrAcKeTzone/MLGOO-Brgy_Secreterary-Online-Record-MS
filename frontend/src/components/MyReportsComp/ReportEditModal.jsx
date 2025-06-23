import React, { useState, useEffect } from "react";
import { FaSpinner, FaCheck, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "../Common/Modal";
import FormInput from "../Common/FormInput";
import FormTextbox from "../Common/FormTextbox";
import FileUploader from "../Common/FileUploader";
import Button from "../Common/Button";
import useSubmitReportStore from "../../store/submitReportStore";
import useMyReportsStore from "../../store/myReportsStore";
import { reportAPI } from "../../services/api";

const ReportEditModal = ({ isOpen, onClose }) => {
  const { selectedReport, updateReport, closeEditModal, fetchReports } =
    useMyReportsStore();

  const [reportName, setReportName] = useState("");
  const [comments, setComments] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fileErrors, setFileErrors] = useState([]);

  // Initialize form with selected report data
  useEffect(() => {
    if (selectedReport) {
      setReportName(selectedReport.reportName || "");
      setComments(selectedReport.comments || "");
      setExistingAttachments(selectedReport.attachments || []);
    }
  }, [selectedReport]);

  const handleReportNameChange = (e) => {
    setReportName(e.target.value);
  };

  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };

  const handleFileSelect = (files) => {
    // Validate files
    const errors = [];
    const validFiles = [];

    files.forEach((file) => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`File "${file.name}" exceeds the 10MB size limit`);
        return;
      }

      // Check file type (optional)
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!allowedTypes.includes(file.type)) {
        errors.push(
          `File "${file.name}" has unsupported format. Allowed: PDF, Images, Word, Excel`
        );
        return;
      }

      // File is valid
      validFiles.push(file);
    });

    setFileErrors(errors);
    if (errors.length > 0) {
      toast.error(`${errors.length} file(s) couldn't be added`);
    }

    setSelectedFiles(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedReport) {
      toast.error("Report data missing");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let attachments = existingAttachments;

      // If new files are selected, upload them
      if (selectedFiles.length > 0) {
        try {
          // We need the report type for the file naming
          const reportType = selectedReport.reportType;
          const uploadResponse = await reportAPI.uploadReportFiles(
            selectedFiles,
            reportType
          );

          if (!uploadResponse.data || !uploadResponse.data.files) {
            throw new Error("Failed to upload files");
          }

          // Replace existing attachments with new ones
          attachments = uploadResponse.data.files;
          console.log("New attachments uploaded:", attachments);
        } catch (uploadError) {
          console.error("Error uploading files:", uploadError);
          toast.error("Failed to upload files. Please try again.");
          setSubmitting(false);
          return;
        }
      }

      // Make sure we have at least one attachment
      if (!attachments || attachments.length === 0) {
        toast.error("At least one attachment is required");
        setSubmitting(false);
        return;
      }

      const reportData = {
        reportName,
        comments,
        attachments,
      };

      console.log("Updating report with data:", reportData);
      await updateReport(selectedReport.id, reportData);

      // Refresh the reports list to show the updated report
      await fetchReports();

      // Close the modal
      closeEditModal();

      // Show success message
      toast.success("Report updated successfully");
    } catch (error) {
      console.error("Error updating report:", error);
      setError(error.response?.data?.message || "Failed to update report");
      toast.error(error.response?.data?.message || "Failed to update report");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    closeEditModal();
  };

  // Function to render file icon based on content type
  const getFileIcon = (contentType) => {
    const iconClass = "mr-2";
    if (!contentType) return <span className={iconClass}>📄</span>;

    if (contentType.includes("pdf"))
      return <span className={iconClass}>📕</span>;
    if (contentType.includes("word") || contentType.includes("doc"))
      return <span className={iconClass}>📘</span>;
    if (contentType.includes("excel") || contentType.includes("sheet"))
      return <span className={iconClass}>📊</span>;
    if (contentType.includes("image"))
      return <span className={iconClass}>🖼️</span>;

    return <span className={iconClass}>📄</span>;
  };

  if (!selectedReport) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Report"
      size="lg" // Larger modal size for the form
    >
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          {/* Report Name */}
          <div className="mb-4">
            <FormInput
              label="Report Name"
              name="reportName"
              value={reportName}
              onChange={handleReportNameChange}
              placeholder="Enter a descriptive name for the report"
              required={true}
            />
          </div>

          {/* Comments */}
          <div className="mb-4">
            <FormTextbox
              label="Comments or Description"
              name="comments"
              value={comments}
              onChange={handleCommentsChange}
              placeholder="Enter any additional comments or description for this report"
              rows={4}
              maxLength={500}
            />
          </div>

          {/* Current Attachments */}
          {existingAttachments && existingAttachments.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Attachments
              </label>
              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-md">
                {existingAttachments.map((file, index) => (
                  <div key={index} className="flex items-center text-sm">
                    {getFileIcon(file.contentType || file.mimetype)}
                    <span className="truncate flex-grow">
                      {file.fileName || file.originalname}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {((file.fileSize || file.size) / 1024).toFixed(2)} KB
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-amber-500">
                {selectedFiles.length > 0
                  ? "New files will replace current attachments"
                  : ""}
              </p>
            </div>
          )}

          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Replace Attachments
              {selectedFiles.length > 0 && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <FileUploader
              onFileSelect={handleFileSelect}
              selectedFiles={selectedFiles}
              maxSize={10 * 1024 * 1024} // 10MB
              maxFiles={5}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              className="mt-1"
            />

            {fileErrors.length > 0 && (
              <div className="mt-2 text-sm text-red-600">
                {fileErrors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}

            <p className="mt-1 text-sm text-gray-500">
              {selectedFiles.length > 0
                ? "These files will replace the current attachments"
                : "Leave empty to keep current attachments"}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-md text-red-700">
              <p>Error: {error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              onClick={handleCancel}
              secondary
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              primary
              disabled={submitting}
              className="flex items-center px-4 py-2"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Updating...
                </>
              ) : (
                "Update Report"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ReportEditModal;
