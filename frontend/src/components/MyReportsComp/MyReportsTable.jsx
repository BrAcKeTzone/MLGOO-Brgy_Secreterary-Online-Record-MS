import React from "react";
import { format } from "date-fns";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaFile,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaCalendarAlt,
  FaFolder,
} from "react-icons/fa";
import TableActions from "../Common/TableActions";
import Pagination from "../Common/Pagination";

const MyReportsTable = ({
  reports,
  pagination,
  onPageChange,
  onDelete,
  onView,
  onEdit,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPp");
  };

  const handleDelete = (reportId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      onDelete(reportId);
    }
  };

  // Function to get the appropriate file icon based on mimetype
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

  if (!reports || reports.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No reports found
      </div>
    );
  }

  return (
    <>
      {/* Mobile view - card layout */}
      <div className="md:hidden">
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col border-l-4 hover:shadow-lg transition-shadow"
              style={{
                borderLeftColor: getBorderColor(report.status),
              }}
            >
              {/* Header with name and status */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{report.reportName}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(
                    report.status
                  )}`}
                >
                  {report.status}
                </span>
              </div>

              {/* Report details */}
              <div className="space-y-2 mb-4 flex-grow">
                <div className="flex items-center text-sm">
                  <FaFolder className="mr-2 text-gray-400" />
                  <span>{report.reportType}</span>
                </div>

                <div className="flex items-center text-sm">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  <span>{formatDate(report.submittedDate)}</span>
                </div>

                {report.attachments && report.attachments.length > 0 && (
                  <div className="flex items-center text-sm">
                    <FaFile className="mr-2 text-gray-400" />
                    <span>{report.attachments.length} file(s) attached</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="border-t pt-3 flex justify-center">
                <TableActions
                  actions={[
                    {
                      icon: <FaEye />,
                      onClick: () => onView(report.id),
                      className:
                        "text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100",
                      title: "View Details",
                    },
                    ...(report.status === "PENDING"
                      ? [
                          {
                            icon: <FaEdit />,
                            onClick: () => onEdit(report.id),
                            className:
                              "text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100",
                            title: "Edit Report",
                          },
                        ]
                      : []),
                    {
                      icon: <FaTrash />,
                      onClick: () => handleDelete(report.id),
                      className:
                        report.status !== "PENDING"
                          ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                          : "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100",
                      title:
                        report.status !== "PENDING"
                          ? "Can only delete pending reports"
                          : "Delete",
                      disabled: report.status !== "PENDING",
                    },
                  ]}
                  buttonClassName="rounded-full p-2"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop view - table layout */}
      <div className="hidden md:block bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Type
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
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {report.reportName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {report.attachments && report.attachments.length > 0 ? (
                        <span>{report.attachments.length} file(s)</span>
                      ) : (
                        <span>No files</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {report.reportType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(report.submittedDate)}
                    {report.updatedAt &&
                      report.updatedAt !== report.submittedDate && (
                        <div className="text-xs text-gray-400">
                          Updated: {formatDate(report.updatedAt)}
                        </div>
                      )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <TableActions
                      actions={[
                        {
                          icon: <FaEye />,
                          onClick: () => onView(report.id),
                          className: "text-blue-600 hover:text-blue-900",
                          title: "View",
                        },
                        ...(report.status === "PENDING"
                          ? [
                              {
                                icon: <FaEdit />,
                                onClick: () => onEdit(report.id),
                                className:
                                  "text-green-600 hover:text-green-900",
                                title: "Edit",
                              },
                            ]
                          : []),
                        {
                          icon: <FaTrash />,
                          onClick: () => handleDelete(report.id),
                          className:
                            report.status !== "PENDING"
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:text-red-900",
                          title:
                            report.status !== "PENDING"
                              ? "Can only delete pending reports"
                              : "Delete",
                          disabled: report.status !== "PENDING",
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && pagination.total > 0 && (
          <div className="py-3 px-6 border-t border-gray-200">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default MyReportsTable;
