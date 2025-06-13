import React, { useEffect } from "react";
import useUserListStore from "../store/userListStore";
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
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
