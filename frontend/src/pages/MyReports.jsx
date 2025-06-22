import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useMyReportsStore from "../store/myReportsStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import MyReportsFilters from "../components/MyReportsComp/MyReportsFilters";
import MyReportsTable from "../components/MyReportsComp/MyReportsTable";
import Modal from "../components/Common/Modal";
import { format } from "date-fns";
import {
  FaFile,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaDownload,
  FaEdit,
} from "react-icons/fa";

const MyReports = () => {
  const navigate = useNavigate();
  const {
    reports,
    loading,
    error,
    filters,
    pagination,
    fetchReports,
    updateFilters,
    deleteReport,
    setPage,
    selectedReport,
    viewModalOpen,
    openViewModal,
    closeViewModal,
  } = useMyReportsStore();

  // State for overlay loading during actions
  const [actionLoading, setActionLoading] = useState(false);

  // Initial fetch with default filters
  useEffect(() => {
    fetchReports();

    // Clean up function to close modal if open when unmounting
    return () => {
      if (viewModalOpen) {
        closeViewModal();
      }
    };
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handleDeleteReport = async (reportId) => {
    setActionLoading(true);
    try {
      await deleteReport(reportId);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewReport = (reportId) => {
    openViewModal(reportId);
  };

  const handleEditReport = (reportId) => {
    // Navigate to edit report page
    navigate(`/reports/edit/${reportId}`);
  };

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPp");
  };

  // Get file icon based on mimetype
  const getFileIcon = (mimetype) => {
    if (!mimetype) return <FaFile className="text-gray-500" />;

    if (mimetype.includes("pdf")) {
      return <FaFilePdf className="text-red-500" />;
    } else if (mimetype.includes("word") || mimetype.includes("doc")) {
      return <FaFileWord className="text-blue-500" />;
    } else if (
      mimetype.includes("excel") ||
      mimetype.includes("sheet") ||
      mimetype.includes("csv")
    ) {
      return <FaFileExcel className="text-green-500" />;
    } else if (mimetype.includes("image")) {
      return <FaFileImage className="text-purple-500" />;
    } else {
      return <FaFile className="text-gray-500" />;
    }
  };

  // Get status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading && !actionLoading && reports.length === 0) {
    return <LoadingScreen message="Loading reports..." />;
  }

  if (error && !reports.length) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Reports</h1>
        <p className="text-gray-600">
          View, edit, and manage your submitted reports
        </p>
      </div>

      <MyReportsFilters filters={filters} onFilterChange={handleFilterChange} />

      {actionLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-700">Processing...</p>
          </div>
        </div>
      )}

      {loading && reports.length > 0 && !actionLoading && (
        <div className="flex justify-center my-4">
          <div className="animate-pulse text-gray-500">
            Loading updated results...
          </div>
        </div>
      )}

      <MyReportsTable
        reports={reports}
        pagination={pagination}
        onDelete={handleDeleteReport}
        onView={handleViewReport}
        onEdit={handleEditReport}
        onPageChange={handlePageChange}
      />

      {/* Report Details Modal */}
      {viewModalOpen && selectedReport && (
        <Modal
          isOpen={viewModalOpen}
          onClose={closeViewModal}
          title={`Report Details - ${selectedReport.reportName}`}
        >
          <div className="p-4">
            {/* Report Information Section */}
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Report Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Report Name
                  </div>
                  <div className="text-gray-900">
                    {selectedReport.reportName}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Report Type
                  </div>
                  <div className="text-gray-900">
                    {selectedReport.reportType}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Status
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(
                        selectedReport.status
                      )}`}
                    >
                      {selectedReport.status}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Barangay
                  </div>
                  <div className="text-gray-900">
                    {selectedReport.barangayName}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Submission Date
                  </div>
                  <div className="text-gray-900">
                    {formatDate(selectedReport.submittedDate)}
                  </div>
                </div>
                {selectedReport.updatedAt &&
                  selectedReport.updatedAt !== selectedReport.submittedDate && (
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">
                        Last Updated
                      </div>
                      <div className="text-gray-900">
                        {formatDate(selectedReport.updatedAt)}
                      </div>
                    </div>
                  )}
                <div className="md:col-span-2">
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Comments
                  </div>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
                    {selectedReport.comments || "No comments provided"}
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Attachments
              </h3>
              {selectedReport.attachments &&
              selectedReport.attachments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedReport.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex items-center mb-2">
                        {getFileIcon(file.contentType || file.mimetype)}
                        <span className="ml-2 text-sm font-medium text-gray-700 truncate flex-grow">
                          {file.fileName || file.originalname}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {((file.fileSize || file.size) / 1024).toFixed(2)} KB
                          {file.fileExt && (
                            <span className="ml-1">
                              ({file.fileExt.replace(".", "")})
                            </span>
                          )}
                        </span>

                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={
                            // Ensure the download filename has an extension
                            (file.fileName || file.originalname) +
                            ((!file.fileName || !file.fileName.includes(".")) &&
                            file.fileExt
                              ? file.fileExt
                              : "")
                          }
                          className="text-blue-600 hover:text-blue-800 flex items-center text-xs"
                        >
                          <FaDownload className="mr-1" /> Download
                        </a>
                      </div>

                      {/* Preview for images */}
                      {file.contentType &&
                        file.contentType.includes("image") && (
                          <div className="mt-2">
                            <img
                              src={file.url}
                              alt={file.fileName}
                              className="w-full h-auto object-contain rounded-md"
                              style={{ maxHeight: "150px" }}
                            />
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  No attachments available
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="border-t pt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                {selectedReport.status === "PENDING" && (
                  <button
                    onClick={() => {
                      closeViewModal();
                      handleEditReport(selectedReport.id);
                    }}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md text-sm font-medium flex items-center gap-1"
                  >
                    <FaEdit size={14} /> Edit Report
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                {selectedReport.status === "PENDING" && (
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this report?"
                        )
                      ) {
                        handleDeleteReport(selectedReport.id);
                        closeViewModal();
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md text-sm"
                  >
                    Delete Report
                  </button>
                )}
                <button
                  onClick={closeViewModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyReports;
