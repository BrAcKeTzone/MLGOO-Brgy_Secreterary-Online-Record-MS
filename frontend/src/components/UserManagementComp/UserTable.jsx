import React, { useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaTrash,
  FaPowerOff,
  FaEnvelope,
  FaUserTag,
  FaMapMarkerAlt,
  FaEye,
} from "react-icons/fa";
import TableActions from "../Common/TableActions";
import useSettingsStore from "../../store/settingsStore";
import Modal from "../Common/Modal";

const UserTable = ({ users, onStatusUpdate, onDelete }) => {
  const { barangays } = useSettingsStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const getStatusBgColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-50";
      case "PENDING":
        return "bg-yellow-50";
      case "REJECTED":
        return "bg-red-50";
      default:
        return "bg-gray-50";
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

  const handleOpenViewModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No users found
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-lg shadow p-4 flex flex-col border-l-4 hover:shadow-lg transition-shadow"
            style={{
              borderLeftColor:
                user.creationStatus === "APPROVED"
                  ? user.activeStatus === "ACTIVE"
                    ? "#10B981"
                    : "#EF4444"
                  : user.creationStatus === "PENDING"
                  ? "#F59E0B"
                  : "#EF4444",
            }}
          >
            {/* Header with name and status */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">
                {user.firstName} {user.lastName}
              </h3>
              <div className="flex flex-col items-end">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusBgColor(
                    user.creationStatus
                  )} ${getStatusColor(user.creationStatus)}`}
                >
                  {user.creationStatus}
                </span>

                {user.creationStatus === "APPROVED" && (
                  <span
                    className={`text-xs mt-1 px-2 py-1 rounded-full ${
                      user.activeStatus === "ACTIVE"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {user.activeStatus}
                  </span>
                )}
              </div>
            </div>

            {/* User details */}
            <div className="space-y-2 mb-4 flex-grow">
              <div className="flex items-center text-sm">
                <FaEnvelope className="mr-2 text-gray-400" />
                <span className="truncate">{user.email}</span>
              </div>

              <div className="flex items-center text-sm">
                <FaUserTag className="mr-2 text-gray-400" />
                <span>{formatRole(user.role)}</span>
              </div>

              {user.role === "BARANGAY_SECRETARY" && (
                <div className="flex items-center text-sm">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  <span>
                    {user.barangayName || getBarangayName(user.barangayId)}
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="border-t pt-3 flex justify-center">
              <TableActions
                actions={[
                  ...(user.creationStatus === "PENDING"
                    ? [
                        {
                          icon: <FaCheck />,
                          onClick: () =>
                            onStatusUpdate(user._id, "APPROVED", "ACTIVE"),
                          className:
                            "text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100",
                          title: "Approve",
                        },
                        {
                          icon: <FaTimes />,
                          onClick: () => onStatusUpdate(user._id, "REJECTED"),
                          className:
                            "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100",
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
                              ? "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100"
                              : "text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100",
                          title:
                            user.activeStatus === "ACTIVE"
                              ? "Deactivate"
                              : "Activate",
                        },
                      ]
                    : []),
                  {
                    icon: <FaEye />,
                    onClick: () => handleOpenViewModal(user),
                    className:
                      "text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100",
                    title: "View ID",
                  },
                  {
                    icon: <FaTrash />,
                    onClick: () => onDelete(user._id),
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

      {/* View ID Modal */}
      {showModal && selectedUser && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={`ID Verification - ${selectedUser.firstName} ${selectedUser.lastName}`}
        >
          <div className="p-4">
            <div className="mb-4">
              <div className="font-medium text-gray-700 mb-1">ID Type:</div>
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md inline-block">
                {selectedUser.validIDTypeName || "Valid ID"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="font-medium text-gray-700 mb-1">Front ID:</div>
                {selectedUser.validIDFrontUrl ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={selectedUser.validIDFrontUrl}
                      alt="ID Front"
                      className="w-full h-auto object-contain"
                      style={{ maxHeight: "300px" }}
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    No front ID image available
                  </div>
                )}
              </div>

              <div>
                <div className="font-medium text-gray-700 mb-1">Back ID:</div>
                {selectedUser.validIDBackUrl ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={selectedUser.validIDBackUrl}
                      alt="ID Back"
                      className="w-full h-auto object-contain"
                      style={{ maxHeight: "300px" }}
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    No back ID image available
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UserTable;
