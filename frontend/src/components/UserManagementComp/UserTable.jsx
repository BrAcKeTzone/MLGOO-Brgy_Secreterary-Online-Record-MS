import React from "react";
import { FaCheck, FaTimes, FaEdit, FaTrash, FaPowerOff } from "react-icons/fa";
import TableActions from "../Common/TableActions";
import useSettingsStore from "../../store/settingsStore";

const UserTable = ({ users, onStatusUpdate, onDelete }) => {
  const { barangays } = useSettingsStore();

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "text-green-600";
      case "PENDING":
        return "text-yellow-600";
      case "REJECTED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getBarangayName = (brgyId) => {
    if (!brgyId) return "N/A";
    const barangay = barangays.find((b) => b.id === parseInt(brgyId));
    return barangay ? barangay.name : brgyId;
  };

  const formatRole = (role) => {
    switch (role) {
      case "BARANGAY_SECRETARY":
        return "Barangay Secretary";
      case "MLGOO_STAFF":
        return "MLGOO Staff";
      default:
        return role;
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
            <th className="p-4 text-left">Barangay</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-4">
                  {user.firstName} {user.lastName}
                </td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{formatRole(user.role)}</td>
                <td className="p-4">
                  {user.role === "BARANGAY_SECRETARY"
                    ? user.barangayName || getBarangayName(user.barangayId)
                    : "N/A"}
                </td>
                <td className={`p-4 ${getStatusColor(user.creationStatus)}`}>
                  {user.creationStatus}
                  {user.creationStatus === "APPROVED" && (
                    <span
                      className={`ml-2 ${
                        user.activeStatus === "ACTIVE"
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
                      ...(user.creationStatus === "PENDING"
                        ? [
                            {
                              icon: <FaCheck />,
                              onClick: () =>
                                onStatusUpdate(user._id, "APPROVED", "ACTIVE"),
                              className: "text-green-600 hover:text-green-800",
                              title: "Approve",
                            },
                            {
                              icon: <FaTimes />,
                              onClick: () => onStatusUpdate(user._id, "REJECTED"),
                              className: "text-red-600 hover:text-red-800",
                              title: "Reject",
                            },
                          ]
                        : []),
                      ...(user.creationStatus === "APPROVED"
                        ? [
                            {
                              icon: <FaPowerOff />,
                              onClick: () =>
                                onStatusUpdate(
                                  user._id,
                                  null,
                                  user.activeStatus === "ACTIVE"
                                    ? "DEACTIVATED"
                                    : "ACTIVE"
                                ),
                              className:
                                user.activeStatus === "ACTIVE"
                                  ? "text-red-600 hover:text-red-800"
                                  : "text-green-600 hover:text-green-800",
                              title:
                                user.activeStatus === "ACTIVE"
                                  ? "Deactivate"
                                  : "Activate",
                            },
                          ]
                        : []),
                      {
                        icon: <FaEdit />,
                        onClick: () => {},
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
