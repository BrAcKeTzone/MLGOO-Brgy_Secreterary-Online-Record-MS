import React, { useEffect, useState, useCallback } from "react";
import useBrgyNotificationStore from "../store/brgyNotificationStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import BrgyNotificationFilters from "../components/BrgyNotificationComp/BrgyNotificationFilters";
import BrgyNotificationList from "../components/BrgyNotificationComp/BrgyNotificationList";
import { FaBell, FaClock, FaSync } from "react-icons/fa";
import { format } from "date-fns";

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
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Create a memoized refresh function to avoid recreating it on each render
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchNotifications();
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error refreshing notification data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchNotifications]);

  // Initial data load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Set up auto-refresh interval (every 5 minutes)
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshData();
    }, 5 * 60000); // 5 * 60000 ms = 5 minutes

    return () => clearInterval(intervalId);
  }, [refreshData]);

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

  const formatDateTime = (date) => {
    return format(date, "MMM dd, yyyy 'at' h:mm:ss a");
  };

  if (loading && notifications.length === 0 && !isRefreshing) {
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

      <BrgyNotificationFilters
        filters={filters}
        onFilterChange={updateFilters}
      />

      {loading && notifications.length > 0 && isRefreshing && (
        <div className="flex justify-center my-4">
          <div className="animate-pulse text-gray-500">
            Loading updated notifications...
          </div>
        </div>
      )}

      <BrgyNotificationList
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        loading={loading && !isRefreshing}
      />
    </div>
  );
};

export default BrgyNotifications;
