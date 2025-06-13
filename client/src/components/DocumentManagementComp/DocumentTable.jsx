import React from "react";
import { FaCheck, FaTimes, FaDownload, FaTrash } from "react-icons/fa";

const DocumentTable = ({ documents, onStatusUpdate, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600";
      case "Pending":
        return "text-yellow-600";
      case "Rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Report Details
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
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map((doc) => (
            <tr key={doc._id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {doc.reportName}
                </div>
                <div className="text-sm text-gray-500">{doc.fileName}</div>
                <div className="text-xs text-gray-400">
                  {formatFileSize(doc.fileSize)}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{doc.barangayName}</div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex text-sm ${getStatusColor(
                    doc.status
                  )}`}
                >
                  {doc.status}
                </span>
                {doc.comments && (
                  <p className="text-xs text-gray-500 mt-1">{doc.comments}</p>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {formatDate(doc.submittedDate)}
                </div>
                {doc.updatedAt && (
                  <div className="text-xs text-gray-500">
                    Updated: {formatDate(doc.updatedAt)}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <div className="flex justify-end space-x-2">
                  {doc.status === "Pending" && (
                    <>
                      <button
                        onClick={() => onStatusUpdate(doc._id, "Approved")}
                        className="text-green-600 hover:text-green-900"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => onStatusUpdate(doc._id, "Rejected")}
                        className="text-red-600 hover:text-red-900"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    title="Download"
                  >
                    <FaDownload />
                  </button>
                  <button
                    onClick={() => onDelete(doc._id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
