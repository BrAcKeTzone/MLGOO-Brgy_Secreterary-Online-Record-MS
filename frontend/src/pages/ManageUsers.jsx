import React, { useEffect } from "react";
import useUserListStore from "../store/userListStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import UserFilters from "../components/UserManagementComp/UserFilters";
import UserTable from "../components/UserManagementComp/UserTable";
import Pagination from "../components/Common/Pagination"; // Make sure this component exists

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
  } = useUserListStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
      } catch (err) {
        console.error("Delete failed:", err);
      }
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

      <UserFilters filters={filters} onFilterChange={updateFilters} />

      {loading && filteredUsers.length > 0 && (
        <div className="flex justify-center my-4">
          <div className="animate-pulse text-gray-500">
            Loading updated results...
          </div>
        </div>
      )}

      <UserTable
        users={filteredUsers}
        onStatusUpdate={updateUserStatus}
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
