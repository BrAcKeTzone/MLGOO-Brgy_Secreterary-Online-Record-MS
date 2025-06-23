import React, { useEffect } from "react";
import useBrgyNotificationStore from "../store/brgyNotificationStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import BrgyNotificationFilters from "../components/BrgyNotificationComp/BrgyNotificationFilters";
import BrgyNotificationList from "../components/BrgyNotificationComp/BrgyNotificationList";

const BrgyNotifications = () => {
  const {
    notifications,
    loading,
    error,
    filters,
    fetchNotifications,
    markAsRead,
    updateFilters,
  } = useBrgyNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      alert(
        "Failed to mark as read: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  if (loading && notifications.length === 0) {
    return <LoadingScreen message="Loading notifications..." />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          My Notifications
        </h1>
        <p className="text-gray-600">View and manage your notifications</p>
      </div>

      <BrgyNotificationFilters
        filters={filters}
        onFilterChange={updateFilters}
      />

      <BrgyNotificationList
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        loading={loading}
      />
    </div>
  );
};

export default BrgyNotifications;
