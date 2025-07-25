import React from "react";
import {
  FaCheck,
  FaTimes,
  FaTrash,
  FaPowerOff,
  FaEnvelope,
  FaUserTag,
  FaMapMarkerAlt,
  FaEye,
  FaBirthdayCake,
  FaCalendarAlt,
  FaUserCircle,
} from "react-icons/fa";
import TableActions from "../Common/TableActions";
import useSettingsStore from "../../store/settingsStore";
import useUserListStore from "../../store/userListStore";
import useAuthStore from "../../store/authStore";
import Modal from "../Common/Modal";

const UserTable = ({ users, onStatusUpdate, onDelete }) => {
  const { barangays } = useSettingsStore();
  const { 
    selectedUser, 
    viewModalOpen, 
    openViewModal, 
    closeViewModal 
  } = useUserListStore();
  const { user: currentUser } = useAuthStore();

  // Check if a user is the current logged-in user
  const isCurrentUser = (user) => {
    return currentUser && user._id === currentUser.id.toString();
  };

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
  
  // Format date function for DOB and other dates
  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get border color based on user status
  const getBorderColor = (user) => {
    if (user.creationStatus === "APPROVED") {
      return user.activeStatus === "ACTIVE" ? "#10B981" : "#EF4444";
    } else if (user.creationStatus === "PENDING") {
      return "#F59E0B";
    } else {
      return "#EF4444";
    }
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
      {/* Mobile view - card layout (visible only on small screens) */}
      <div className="md:hidden">
        <div className="space-y-4">
          {users.map((user) => {
            const userIsCurrentUser = isCurrentUser(user);
            
            return (
              <div
                key={user._id}
                className={`bg-white rounded-lg shadow p-4 flex flex-col border-l-4 hover:shadow-lg transition-shadow ${
                  userIsCurrentUser ? "bg-green-50" : ""
                }`}
                style={{
                  borderLeftColor: getBorderColor(user)
                }}
              >
                {/* Header with name and status */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg flex items-center">
                    {userIsCurrentUser && (
                      <FaUserCircle className="mr-2 text-green-600" title="This is you" />
                    )}
                    {user.firstName} {user.lastName}
                    {userIsCurrentUser && (
                      <span className="ml-2 text-xs text-green-600 font-normal">(You)</span>
                    )}
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
                  
                  {/* Add DOB to the card if it exists */}
                  {user.dateOfBirth && (
                    <div className="flex items-center text-sm">
                      <FaBirthdayCake className="mr-2 text-gray-400" />
                      <span>{formatDate(user.dateOfBirth)}</span>
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
                              className: userIsCurrentUser
                                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                : user.activeStatus === "ACTIVE"
                                ? "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100"
                                : "text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100",
                              title: userIsCurrentUser
                                ? "Cannot modify your own account"
                                : user.activeStatus === "ACTIVE"
                                ? "Deactivate"
                                : "Activate",
                              disabled: userIsCurrentUser,
                            },
                          ]
                        : []),
                      {
                        icon: <FaEye />,
                        onClick: () => openViewModal(user),
                        className:
                          "text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100",
                        title: "View Details",
                      },
                      {
                        icon: <FaTrash />,
                        onClick: () => onDelete(user._id),
                        className: userIsCurrentUser
                          ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                          : "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100",
                        title: userIsCurrentUser
                          ? "Cannot delete your own account"
                          : "Delete",
                        disabled: userIsCurrentUser,
                      },
                    ]}
                    buttonClassName="rounded-full p-2"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop view - table layout (visible only on medium screens and up) */}
      <div className="hidden md:block bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => {
                const userIsCurrentUser = isCurrentUser(user);
                
                return (
                  <tr key={user._id} className={`hover:bg-gray-50 ${userIsCurrentUser ? "bg-green-50" : ""}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {userIsCurrentUser && (
                          <FaUserCircle className="mr-2 text-green-600" title="This is you" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                            {userIsCurrentUser && (
                              <span className="ml-2 text-xs text-green-600 font-normal">(You)</span>
                            )}
                          </div>
                          {user.role === "BARANGAY_SECRETARY" && (
                            <div className="text-xs text-gray-500">
                              <FaMapMarkerAlt className="inline mr-1" />
                              {user.barangayName || getBarangayName(user.barangayId)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatRole(user.role)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span
                          className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 ${getStatusBgColor(
                            user.creationStatus
                          )} ${getStatusColor(user.creationStatus)}`}
                        >
                          {user.creationStatus}
                        </span>

                        {user.creationStatus === "APPROVED" && (
                          <span
                            className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 ${
                              user.activeStatus === "ACTIVE"
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {user.activeStatus}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <TableActions
                        actions={[
                          ...(user.creationStatus === "PENDING"
                            ? [
                                {
                                  icon: <FaCheck />,
                                  onClick: () =>
                                    onStatusUpdate(user._id, "APPROVED", "ACTIVE"),
                                  className:
                                    "text-green-600 hover:text-green-900",
                                  title: "Approve",
                                },
                                {
                                  icon: <FaTimes />,
                                  onClick: () => onStatusUpdate(user._id, "REJECTED"),
                                  className:
                                    "text-red-600 hover:text-red-900",
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
                                  className: userIsCurrentUser
                                    ? "text-gray-400 cursor-not-allowed"
                                    : user.activeStatus === "ACTIVE"
                                    ? "text-red-600 hover:text-red-900"
                                    : "text-green-600 hover:text-green-900",
                                  title: userIsCurrentUser
                                    ? "Cannot modify your own account"
                                    : user.activeStatus === "ACTIVE"
                                    ? "Deactivate"
                                    : "Activate",
                                  disabled: userIsCurrentUser,
                                },
                              ]
                            : []),
                          {
                            icon: <FaEye />,
                            onClick: () => openViewModal(user),
                            className:
                              "text-blue-600 hover:text-blue-900",
                            title: "View Details",
                          },
                          {
                            icon: <FaTrash />,
                            onClick: () => onDelete(user._id),
                            className: userIsCurrentUser
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:text-red-900",
                            title: userIsCurrentUser
                              ? "Cannot delete your own account"
                              : "Delete",
                            disabled: userIsCurrentUser,
                          },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {viewModalOpen && selectedUser && (
        <Modal
          isOpen={viewModalOpen}
          onClose={closeViewModal}
          title={`User Details - ${selectedUser.firstName} ${selectedUser.lastName} ${
            isCurrentUser(selectedUser) ? "(You)" : ""
          }`}
        >
          <div className="p-4">
            {/* User Profile Section */}
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Full Name</div>
                  <div className="text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Email</div>
                  <div className="text-gray-900 break-all">{selectedUser.email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Role</div>
                  <div className="text-gray-900">{formatRole(selectedUser.role)}</div>
                </div>
                {/* Date of Birth field */}
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1 text-gray-400" />
                      Date of Birth
                    </div>
                  </div>
                  <div className="text-gray-900">
                    {formatDate(selectedUser.dateOfBirth)}
                  </div>
                </div>
                {selectedUser.role === "BARANGAY_SECRETARY" && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Assigned Barangay</div>
                    <div className="text-gray-900">{selectedUser.barangayName || getBarangayName(selectedUser.barangayId) || "Not assigned"}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Account Status</div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBgColor(selectedUser.creationStatus)} ${getStatusColor(selectedUser.creationStatus)}`}>
                      {selectedUser.creationStatus}
                    </span>
                    {selectedUser.creationStatus === "APPROVED" && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedUser.activeStatus === "ACTIVE"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}>
                        {selectedUser.activeStatus}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Registered On</div>
                  <div className="text-gray-900">
                    {formatDate(selectedUser.createdAt)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* ID Verification Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">ID Verification</h3>
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-500 mb-1">ID Type</div>
                {selectedUser.validIDTypeName ? (
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md inline-block">
                    {selectedUser.validIDTypeName}
                  </div>
                ) : (
                  <div className="text-gray-400 italic">No ID type provided</div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Front ID</div>
                  {selectedUser.validIDFrontUrl ? (
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={selectedUser.validIDFrontUrl}
                        alt="ID Front"
                        className="w-full h-auto object-contain"
                        style={{ maxHeight: "250px" }}
                      />
                    </div>
                  ) : (
                    <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      No front ID image available
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Back ID</div>
                  {selectedUser.validIDBackUrl ? (
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={selectedUser.validIDBackUrl}
                        alt="ID Back"
                        className="w-full h-auto object-contain"
                        style={{ maxHeight: "250px" }}
                      />
                    </div>
                  ) : (
                    <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      No back ID image available
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Management Actions Section */}
            <div className="border-t pt-4 flex flex-wrap items-center justify-between gap-3">
              {/* Status Management */}
              <div className="flex flex-wrap gap-2">
                {selectedUser.creationStatus === "PENDING" && (
                  <>
                    <button
                      onClick={() => {
                        onStatusUpdate(selectedUser._id, "APPROVED", "ACTIVE");
                        closeViewModal();
                      }}
                      className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-md text-sm font-medium flex items-center gap-1"
                    >
                      <FaCheck size={14} /> Approve
                    </button>
                    <button
                      onClick={() => {
                        onStatusUpdate(selectedUser._id, "REJECTED");
                        closeViewModal();
                      }}
                      className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium flex items-center gap-1"
                    >
                      <FaTimes size={14} /> Reject
                    </button>
                  </>
                )}
                {selectedUser.creationStatus === "APPROVED" && (
                  <button
                    onClick={() => {
                      onStatusUpdate(
                        selectedUser._id, 
                        null,
                        selectedUser.activeStatus === "ACTIVE" ? "DEACTIVATED" : "ACTIVE"
                      );
                      closeViewModal();
                    }}
                    disabled={isCurrentUser(selectedUser)}
                    className={`px-3 py-1.5 ${
                      isCurrentUser(selectedUser)
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : selectedUser.activeStatus === "ACTIVE"
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    } rounded-md text-sm font-medium flex items-center gap-1`}
                  >
                    <FaPowerOff size={14} />
                    {selectedUser.activeStatus === "ACTIVE" ? "Deactivate" : "Activate"}
                    {isCurrentUser(selectedUser) && " (Cannot modify your own account)"}
                  </button>
                )}
              </div>
              
              {/* Close button */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this user?")) {
                      onDelete(selectedUser._id);
                      closeViewModal();
                    }
                  }}
                  disabled={isCurrentUser(selectedUser)}
                  className={`px-4 py-2 ${
                    isCurrentUser(selectedUser)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  } rounded-md text-sm`}
                >
                  {isCurrentUser(selectedUser) ? "Cannot Delete Your Account" : "Delete User"}
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

export default UserTable;
