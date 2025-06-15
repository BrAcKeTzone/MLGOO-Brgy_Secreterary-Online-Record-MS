import React from "react";
import { FaCheck, FaTimes, FaEdit, FaTrash, FaPowerOff } from "react-icons/fa";
import TableActions from "../Common/TableActions";

const UserTable = ({ users, onStatusUpdate, onDelete }) => {
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
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="p-4">
                {user.firstName} {user.lastName}
              </td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">
                {user.role === "role001" ? "Barangay Secretary" : "MLGOO Staff"}
              </td>
              <td className={`p-4 ${getStatusColor(user.creationStatus)}`}>
                {user.creationStatus}
                {user.creationStatus === "Approved" && (
                  <span
                    className={`ml-2 ${
                      user.activeStatus === "Active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ({user.activeStatus})
                  </span>
                )}
              </td>
              <td className="p-4">
                <TableActions
                  actions={[
                    ...(user.creationStatus === "Pending"
                      ? [
                          {
                            icon: <FaCheck />,
                            onClick: () =>
                              onStatusUpdate(user._id, "Approved", "Active"),
                            className: "text-green-600 hover:text-green-800",
                            title: "Approve",
                          },
                          {
                            icon: <FaTimes />,
                            onClick: () => onStatusUpdate(user._id, "Rejected"),
                            className: "text-red-600 hover:text-red-800",
                            title: "Reject",
                          },
                        ]
                      : []),
                    ...(user.creationStatus === "Approved"
                      ? [
                          {
                            icon: <FaPowerOff />,
                            onClick: () =>
                              onStatusUpdate(
                                user._id,
                                "Approved",
                                user.activeStatus === "Active"
                                  ? "Deactivated"
                                  : "Active"
                              ),
                            className:
                              user.activeStatus === "Active"
                                ? "text-red-600 hover:text-red-800"
                                : "text-green-600 hover:text-green-800",
                            title:
                              user.activeStatus === "Active"
                                ? "Deactivate"
                                : "Activate",
                          },
                        ]
                      : []),
                    {
                      icon: <FaEdit />,
                      onClick: () => {}, // Add edit functionality
                      className: "text-blue-600 hover:text-blue-800",
                      title: "Edit",
                    },
                    {
                      icon: <FaTrash />,
                      onClick: () => onDelete(user._id),
                      className: "text-red-600 hover:text-red-800",
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

export default UserTable;
