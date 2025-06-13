import React, { useEffect } from "react";
import useNotificationStore from "../store/notificationStore";
import UserSelection from "../components/Notifications/UserSelection";
import NotificationComposer from "../components/Notifications/NotificationComposer";
import NotificationLog from "../components/Notifications/NotificationLog";

const Notifications = () => {
  const {
    notifications,
    users,
    selectedUsers,
    loading,
    error,
    filters,
    fetchNotifications,
    fetchUsers,
    updateSelectedUsers,
    sendNotification,
    searchUsers,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const handleSendNotification = async (message, title, type, priority) => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one recipient");
      return;
    }

    try {
      await sendNotification(message, title, type, priority);
      alert("Notification sent successfully!");
    } catch (error) {
      alert("Failed to send notification: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
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

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Notification Management
        </h1>
        <p className="text-gray-600">
          Send notifications to users and view notification history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <UserSelection
          users={filteredUsers}
          selectedUsers={selectedUsers}
          onUserSelect={updateSelectedUsers}
          onSearchChange={searchUsers}
          searchTerm={filters.search}
        />

        <NotificationComposer
          onSend={handleSendNotification}
          disabled={selectedUsers.length === 0}
        />
      </div>

      <NotificationLog notifications={notifications} />
    </div>
  );
};

export default Notifications;
