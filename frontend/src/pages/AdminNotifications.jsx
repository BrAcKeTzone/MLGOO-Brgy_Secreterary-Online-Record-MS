import React, { useEffect } from "react";
import useNotificationStore from "../store/adminNotificationStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import UserSelection from "../components/AdminNotificationsComp/UserSelection";
import NotificationComposer from "../components/AdminNotificationsComp/NotificationComposer";
import NotificationLog from "../components/AdminNotificationsComp/NotificationLog";

const AdminNotifications = () => {
  const {
    notifications,
    barangaySecretaries,
    selectedSecretaryIds,
    loading,
    error,
    filters,
    fetchNotifications,
    fetchBarangaySecretaries,
    updateSelectedSecretaries,
    sendNotification,
    deleteNotification,
    searchSecretaries,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
    fetchBarangaySecretaries();
  }, []);

  const handleSendNotification = async (notificationData) => {
    if (selectedSecretaryIds.length === 0) {
      alert("Please select at least one recipient");
      return;
    }

    try {
      await sendNotification(notificationData);
      alert("Notification sent successfully!");
    } catch (error) {
      alert("Failed to send notification: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (confirm("Are you sure you want to delete this notification?")) {
      try {
        await deleteNotification(notificationId);
      } catch (error) {
        alert("Failed to delete notification: " + (error.response?.data?.message || error.message));
      }
    }
  };

  if (loading && (!notifications.length && !barangaySecretaries.length)) {
    return <LoadingScreen message="Loading notifications..." />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  // Filter barangay secretaries based on search term
  const filteredSecretaries = barangaySecretaries.filter(
    (secretary) =>
      secretary.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
      secretary.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
      secretary.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      (secretary.assignedBrgy?.name || "").toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Notification Management
        </h1>
        <p className="text-gray-600">
          Send notifications to barangay secretaries and view notification history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <UserSelection
          secretaries={filteredSecretaries}
          selectedSecretaryIds={selectedSecretaryIds}
          onSecretarySelect={updateSelectedSecretaries}
          onSearchChange={searchSecretaries}
          searchTerm={filters.search}
        />

        <NotificationComposer
          onSend={handleSendNotification}
          disabled={selectedSecretaryIds.length === 0}
        />
      </div>

      <NotificationLog 
        notifications={notifications} 
        onDelete={handleDeleteNotification}
      />
    </div>
  );
};

export default AdminNotifications;
