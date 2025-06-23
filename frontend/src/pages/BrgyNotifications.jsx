import React, { useEffect, useState } from "react";
import useBrgyNotificationStore from "../store/brgyNotificationStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import BrgyNotificationFilters from "../components/BrgyNotificationComp/BrgyNotificationFilters";
import BrgyNotificationList from "../components/BrgyNotificationComp/BrgyNotificationList";
import { FaBell } from "react-icons/fa";

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

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Calculate unread notifications whenever notifications change
  useEffect(() => {
    const count = notifications.filter(
      (notification) => !notification.isRead
    ).length;
    setUnreadCount(count);
  }, [notifications]);

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            My Notifications
          </h1>
          {unreadCount > 0 && (
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
              <FaBell />
              <span>{unreadCount} unread</span>
            </div>
          )}
        </div>
        <p className="text-gray-600">View and manage your notifications</p>
        {unreadCount > 0 && (
          <p className="text-sm text-blue-600 mt-1">
            Click on unread notifications to view their full content
          </p>
        )}
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
