import React from "react";
import { format } from "date-fns";
import {
  FaCheck,
  FaTimes,
  FaTrash,
  FaEye,
  FaDownload,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFile,
  FaCalendarAlt,
  FaBuilding,
  FaFolder,
} from "react-icons/fa";
import TableActions from "../Common/TableActions";
import Pagination from "../Common/Pagination";
import Modal from "../Common/Modal";
import useDocumentStore from "../../store/documentStore";

const DocumentTable = ({
  documents,
  pagination,
  onPageChange,
  onApprove,
  onReject,
  onDelete,
  onView,
}) => {
  const { selectedDocument, viewModalOpen, closeViewModal } =
    useDocumentStore();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPp");
  };

  const handleDelete = (docId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      onDelete(docId);
    }
  };

  const handlePageChange = (newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  // Function to get the appropriate file icon based on mimetype
  const getFileIcon = (mimetype) => {
    if (!mimetype) return <FaFile />;

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

  // Function to get status badge styling
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

  // Function to get border color based on status
  const getBorderColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "#10B981"; // Tailwind's green-500
      case "REJECTED":
        return "#EF4444"; // Tailwind's red-500
      case "PENDING":
      default:
        return "#F59E0B"; // Tailwind's yellow-500
    }
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No documents found
      </div>
    );
  }

  return (
    <>
      {/* Mobile view (card-based) - show on small screens, hide on md and above */}
      <div className="md:hidden">
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col border-l-4 hover:shadow-lg transition-shadow"
              style={{
                borderLeftColor: getBorderColor(doc.status),
              }}
            >
              {/* Header with name and status */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg flex items-center">
                  {doc.reportName}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(
                    doc.status
                  )}`}
                >
                  {doc.status}
                </span>
              </div>

              {/* Document details */}
              <div className="space-y-2 mb-4 flex-grow">
                <div className="flex items-center text-sm">
                  <FaFolder className="mr-2 text-gray-400" />
                  <span>{doc.reportType}</span>
                </div>

                <div className="flex items-center text-sm">
                  <FaBuilding className="mr-2 text-gray-400" />
                  <span>{doc.barangayName}</span>
                </div>

                <div className="flex items-center text-sm">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  <span>{formatDate(doc.submittedDate)}</span>
                </div>

                {doc.attachments && doc.attachments.length > 0 && (
                  <div className="flex items-center text-sm">
                    <FaFile className="mr-2 text-gray-400" />
                    <span>{doc.attachments.length} file(s) attached</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="border-t pt-3 flex justify-center">
                <TableActions
                  actions={[
                    {
                      icon: <FaEye />,
                      onClick: () => onView(doc.id),
                      className:
                        "text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100",
                      title: "View Details",
                    },
                    ...(doc.status === "PENDING"
                      ? [
                          {
                            icon: <FaCheck />,
                            onClick: () => onApprove(doc.id),
                            className:
                              "text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100",
                            title: "Approve",
                          },
                          {
                            icon: <FaTimes />,
                            onClick: () => onReject(doc.id),
                            className:
                              "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100",
                            title: "Reject",
                          },
                        ]
                      : []),
                    {
                      icon: <FaTrash />,
                      onClick: () => handleDelete(doc.id),
                      className:
                        "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100",
                      title: "Delete",
                    },
                  ]}
                  buttonClassName="rounded-full p-2"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop view (table-based) - hide on small screens, show on md and above */}
      <div className="hidden md:block bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barangay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {doc.reportName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {doc.attachments && doc.attachments.length > 0 ? (
                        <span>{doc.attachments.length} file(s)</span>
                      ) : (
                        <span>No files</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {doc.reportType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {doc.barangayName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        doc.status
                      )}`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(doc.submittedDate)}
                    {doc.updatedAt && doc.updatedAt !== doc.submittedDate && (
                      <div className="text-xs text-gray-400">
                        Updated: {formatDate(doc.updatedAt)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <TableActions
                      actions={[
                        {
                          icon: <FaEye />,
                          onClick: () => onView(doc.id),
                          className: "text-blue-600 hover:text-blue-900",
                          title: "View Details",
                        },
                        ...(doc.status === "PENDING"
                          ? [
                              {
                                icon: <FaCheck />,
                                onClick: () => onApprove(doc.id),
                                className:
                                  "text-green-600 hover:text-green-900",
                                title: "Approve",
                              },
                              {
                                icon: <FaTimes />,
                                onClick: () => onReject(doc.id),
                                className: "text-red-600 hover:text-red-900",
                                title: "Reject",
                              },
                            ]
                          : []),
                        {
                          icon: <FaTrash />,
                          onClick: () => handleDelete(doc.id),
                          className: "text-gray-600 hover:text-gray-900",
                          title: "Delete",
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagination.total > 0 && (
        <div className="py-3 px-6 bg-white border-t border-gray-200 mt-0 rounded-b-lg">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Document Details Modal */}
      {viewModalOpen && selectedDocument && (
        <Modal
          isOpen={viewModalOpen}
          onClose={closeViewModal}
          title={`Document Details - ${selectedDocument.reportName}`}
        >
          <div className="p-4">
            {/* Document Information Section */}
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
                    {selectedDocument.reportName}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Report Type
                  </div>
                  <div className="text-gray-900">
                    {selectedDocument.reportType}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Status
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(
                        selectedDocument.status
                      )}`}
                    >
                      {selectedDocument.status}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Barangay
                  </div>
                  <div className="text-gray-900">
                    {selectedDocument.barangayName}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Submitted By
                  </div>
                  <div className="text-gray-900">
                    {selectedDocument.submittedBy?.name || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Submission Date
                  </div>
                  <div className="text-gray-900">
                    {formatDate(selectedDocument.submittedDate)}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Comments
                  </div>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
                    {selectedDocument.comments || "No comments provided"}
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Attachments
              </h3>
              {selectedDocument.attachments &&
              selectedDocument.attachments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDocument.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex items-center mb-2">
                        {getFileIcon(file.contentType)}
                        <span className="ml-2 text-sm font-medium text-gray-700 truncate flex-grow">
                          {file.fileName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {(file.fileSize / 1024).toFixed(2)} KB
                        </span>

                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
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

            {/* Rejection Reason Section - With enhanced styling and moved below attachments */}
            {selectedDocument.status === "REJECTED" &&
              selectedDocument.rejectReason && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg text-red-500 p-4">
                  <span className="font-semibold">Reason of Rejection:</span>{" "}
                  {selectedDocument.rejectReason}
                </div>
              )}

            {/* Action buttons */}
            <div className="border-t pt-4 flex flex-wrap items-center justify-between gap-3">
              {/* Status Management */}
              <div className="flex flex-wrap gap-2">
                {selectedDocument.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => {
                        onApprove(selectedDocument.id);
                        closeViewModal();
                      }}
                      className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-md text-sm font-medium flex items-center gap-1"
                    >
                      <FaCheck size={14} /> Approve
                    </button>
                    <button
                      onClick={() => {
                        onReject(selectedDocument.id);
                        closeViewModal();
                      }}
                      className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium flex items-center gap-1"
                    >
                      <FaTimes size={14} /> Reject
                    </button>
                  </>
                )}
              </div>

              {/* Close/Delete buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this document?"
                      )
                    ) {
                      onDelete(selectedDocument.id);
                      closeViewModal();
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md text-sm"
                >
                  Delete Document
                </button>
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
    </>
  );
};

export default DocumentTable;
