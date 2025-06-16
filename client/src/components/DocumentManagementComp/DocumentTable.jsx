import React from "react";
import { format } from "date-fns";
import { FaCheck, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import TableActions from "../Common/TableActions";

const DocumentTable = ({ documents, onApprove, onReject, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPp");
  };

  const handleDelete = (docId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      onDelete(docId);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Report ID
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
            <tr key={doc._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {doc._id}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {doc.reportName}
                </div>
                <div className="text-sm text-gray-500">{doc.reportType}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{doc.barangayName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    doc.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : doc.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {doc.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(doc.submittedDate)}
                {doc.updatedAt && (
                  <div className="text-xs text-gray-400">
                    Updated: {formatDate(doc.updatedAt)}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <TableActions
                  actions={[
                    ...(doc.status === "Pending"
                      ? [
                          {
                            icon: <FaCheck />,
                            onClick: () => onApprove(doc._id),
                            className: "text-green-600 hover:text-green-900",
                            title: "Approve",
                          },
                          {
                            icon: <FaTimes />,
                            onClick: () => onReject(doc._id),
                            className: "text-red-600 hover:text-red-900",
                            title: "Reject",
                          },
                        ]
                      : []),
                    {
                      icon: <FaEdit />,
                      onClick: () => {},
                      className: "text-blue-600 hover:text-blue-900",
                      title: "Edit",
                    },
                    {
                      icon: <FaTrash />,
                      onClick: () => handleDelete(doc._id),
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
  );
};

export default DocumentTable;
