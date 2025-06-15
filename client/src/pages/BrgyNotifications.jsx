import React, { useEffect } from "react";
import useBrgyNotificationStore from "../store/brgyNotificationStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import BrgyNotificationList from "../components/BrgyNotificationComp/BrgyNotificationList";

const BrgyNotifications = () => {
  const { notifications, loading, error, fetchNotifications, markAsRead } =
    useBrgyNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      alert("Failed to mark as read: " + error.message);
    }
  };

  if (loading) {
    return <LoadingScreen />;
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

      <BrgyNotificationList
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
      />
    </div>
  );
};

export default BrgyNotifications;
