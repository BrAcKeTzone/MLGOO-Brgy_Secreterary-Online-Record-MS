import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import FormSelect from "../components/Common/FormSelect";
import FormInput from "../components/Common/FormInput";
import FormTextbox from "../components/Common/FormTextbox";
import FileUploader from "../components/Common/FileUploader";
import Button from "../components/Common/Button";
import useSubmitReportStore from "../store/submitReportStore";
import useAuthStore from "../store/authStore";
import useSettingsStore from "../store/settingsStore";

const SubmitReport = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { reportTypes, fetchReportTypes } = useSettingsStore();

  const {
    reportType,
    setReportType,
    reportName,
    setReportName,
    comments,
    setComments,
    selectedFiles,
    setSelectedFiles,
    submitting,
    success,
    resetSuccess,
    resetForm,
    submitReport,
    error,
  } = useSubmitReportStore();

  const [fileErrors, setFileErrors] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // Reset success flag when component mounts
    // This prevents redirect if returning to page after a successful submission
    resetSuccess();

    // Check for user permissions - only BARANGAY_SECRETARY can access this page
    if (user && user.role !== "BARANGAY_SECRETARY") {
      toast.error("Only Barangay Secretary accounts can submit reports");
      navigate("/");
    }

    // Check if user has assigned barangay
    if (user && user.role === "BARANGAY_SECRETARY" && !user.barangayId) {
      toast.error(
        "You need to be assigned to a barangay before submitting reports"
      );
      navigate("/profile");
    }

    // Fetch report types
    fetchReportTypes();
  }, [user, navigate, fetchReportTypes, resetSuccess]);

  // Show success modal when submission is successful
  useEffect(() => {
    if (success) {
      setShowSuccessModal(true);
    }
  }, [success]);

  const handleReportTypeChange = (e) => {
    // This handles both direct event objects and custom select components
    const value = e.target ? e.target.value : e;
    console.log("Report type selected:", value);
    setReportType(value);
  };

  const handleReportNameChange = (e) => {
    setReportName(e.target.value);
  };

  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };

  const handleFileSelect = (files) => {
    // Prevent form submission when files are selected
    // Note: This was likely causing the issue with file selection triggering submit

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
    e.preventDefault(); // Prevent default form submission
    await submitReport();
  };

  const handleSuccessOk = () => {
    // Close the modal and navigate
    setShowSuccessModal(false);
    navigate("/my-reports");
  };

  const prepareNewReport = () => {
    // Reset form to prepare for a new report
    resetForm();
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-12">
      <div className="relative py-3 sm:max-w-3xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative bg-white shadow-lg sm:rounded-3xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Submit Report
          </h1>

          {showSuccessModal ? (
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <FaCheck className="text-green-500" size={30} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Report Submitted Successfully!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your report has been submitted and is pending approval.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button
                    onClick={prepareNewReport}
                    className="w-full sm:w-auto"
                    secondary
                  >
                    Submit Another Report
                  </Button>
                  <Button
                    onClick={handleSuccessOk}
                    className="w-full sm:w-auto"
                    primary
                  >
                    View My Reports
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Report Type Selection */}
              <div className="mb-4">
                <FormSelect
                  id="reportType"
                  label="Report Type"
                  name="reportType"
                  value={reportType}
                  onChange={handleReportTypeChange}
                  options={reportTypes || []} // Pass the raw report types from settings store
                  valueField="id" // Explicitly use id field for values
                  labelField="name" // Use name field for display
                  placeholder="Select Report Type"
                  required
                />
              </div>

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
                  maxLength={500} // Set an appropriate limit
                />
              </div>

              {/* File Upload */}
              <div className="mb-4">
                <label
                  htmlFor="files"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Documents: <span className="text-red-500">*</span>
                </label>
                <FileUploader
                  onFileSelect={handleFileSelect}
                  selectedFiles={selectedFiles}
                  maxSize={10 * 1024 * 1024} // 10MB
                  maxFiles={5}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />

                {fileErrors.length > 0 && (
                  <div className="mt-2 text-sm text-red-600">
                    {fileErrors.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}

                <p className="mt-1 text-sm text-gray-500">
                  Upload up to 5 files (PDF, Word, Excel, images) - Max 10MB
                  each
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-md text-red-700">
                  <p>Error: {error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end">
                <Button
                  type="submit"
                  primary
                  disabled={submitting}
                  className="flex items-center"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitReport;
