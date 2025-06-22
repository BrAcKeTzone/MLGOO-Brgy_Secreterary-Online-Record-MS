import React, { useEffect } from "react";
import useUserListStore from "../store/userListStore";
import useSettingsStore from "../store/settingsStore";
import useAuthStore from "../store/authStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import UserFilters from "../components/UserManagementComp/UserFilters";
import UserTable from "../components/UserManagementComp/UserTable";
import Pagination from "../components/Common/Pagination";

const ManageUsers = () => {
  const {
    filteredUsers,
    loading,
    error,
    filters,
    pagination,
    fetchUsers,
    updateFilters,
    setPage,
    updateUserStatus,
    deleteUser,
    closeViewModal,
    viewModalOpen,
  } = useUserListStore();

  // Fetch current user data
  const { user: currentUser } = useAuthStore();

  // Fetch barangays data for dropdown filters and display
  const { fetchBarangays } = useSettingsStore();

  useEffect(() => {
    fetchUsers(); // Initial fetch with default filters
    fetchBarangays();

    // Clean up function to close modal when unmounting
    return () => {
      if (viewModalOpen) {
        closeViewModal();
      }
    };
  }, [fetchUsers, fetchBarangays, closeViewModal, viewModalOpen]);

  const handleFilterChange = (newFilters) => {
    // For dropdown filters (role, status, barangay), fetch immediately
    if ("search" in newFilters) {
      // For search, just update the store value but don't fetch
      updateFilters(newFilters);
    } else {
      // For other filters, update and fetch
      updateFilters(newFilters);
      fetchUsers();
    }
  };

  const handleDelete = async (userId) => {
    // Prevent deleting own account
    if (currentUser && userId === currentUser.id.toString()) {
      alert("You cannot delete your own account");
      return;
    }

    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleStatusUpdate = async (userId, status, activeStatus) => {
    // Prevent deactivating own account
    if (currentUser && userId === currentUser.id.toString()) {
      alert("You cannot modify your own account status");
      return;
    }

    try {
      await updateUserStatus(userId, status, activeStatus);
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  if (loading && filteredUsers.length === 0) {
    return <LoadingScreen message="Loading users..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Manage Users</h1>
        <p className="text-gray-600">
          View and manage all user accounts in the system
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorScreen error={error} />
        </div>
      )}

      <UserFilters filters={filters} onFilterChange={handleFilterChange} />

      {loading && filteredUsers.length > 0 && (
        <div className="flex justify-center my-4">
          <div className="animate-pulse text-gray-500">
            Loading updated results...
          </div>
        </div>
      )}

      <UserTable
        users={filteredUsers}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDelete}
      />

      {pagination.pages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
