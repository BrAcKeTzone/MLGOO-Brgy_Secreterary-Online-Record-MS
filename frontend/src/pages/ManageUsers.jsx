import React, { useEffect, useState, useCallback } from "react";
import useUserListStore from "../store/userListStore";
import useSettingsStore from "../store/settingsStore";
import useAuthStore from "../store/authStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import UserFilters from "../components/UserManagementComp/UserFilters";
import UserTable from "../components/UserManagementComp/UserTable";
import Pagination from "../components/Common/Pagination";
import { format } from "date-fns";
import { FaClock, FaSync } from "react-icons/fa";

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

  // Add state for last updated time and refresh status
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Create a memoized refresh function
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchUsers();
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error refreshing user data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchUsers]);

  useEffect(() => {
    // Initial data loading
    refreshData();
    fetchBarangays();

    // Clean up function to close modal when unmounting
    return () => {
      if (viewModalOpen) {
        closeViewModal();
      }
    };
  }, [refreshData, fetchBarangays, closeViewModal, viewModalOpen]);

  // Set up auto-refresh interval (every 60 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshData();
    }, 60000 * 5); // 60000 ms = 1 minute

    return () => clearInterval(intervalId);
  }, [refreshData]);

  const formatDateTime = (date) => {
    return format(date, "MMM dd, yyyy 'at' h:mm:ss a");
  };

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
        setLastUpdated(new Date()); // Update timestamp after successful deletion
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
      setLastUpdated(new Date()); // Update timestamp after successful status update
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  if (loading && filteredUsers.length === 0 && !isRefreshing) {
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

      {/* Last Updated & Refresh Info */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center text-sm text-gray-500 mb-2 md:mb-0">
          <FaClock className="mr-1" />
          <span>Last updated: {formatDateTime(lastUpdated)}</span>
        </div>
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          className={`flex items-center text-sm ${
            isRefreshing ? "text-gray-400" : "text-blue-600 hover:text-blue-800"
          } transition-colors`}
        >
          <FaSync className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh data"}
        </button>
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
