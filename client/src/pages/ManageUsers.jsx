import React, { useEffect } from "react";
import useUserListStore from "../store/userListStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import UserFilters from "../components/UserManagement/UserFilters";
import UserTable from "../components/UserManagement/UserTable";

const ManageUsers = () => {
  const {
    filteredUsers,
    loading,
    error,
    filters,
    fetchUsers,
    updateFilters,
    updateUserStatus,
    deleteUser,
  } = useUserListStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading users..." />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Manage Users</h1>
        <p className="text-gray-600">
          View and manage all user accounts in the system
        </p>
      </div>

      <UserFilters filters={filters} onFilterChange={updateFilters} />

      <UserTable
        users={filteredUsers}
        onStatusUpdate={updateUserStatus}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ManageUsers;
