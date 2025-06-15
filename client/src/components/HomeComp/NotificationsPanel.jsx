import React from "react";
import { FaBell, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaClock, FaCalendarAlt } from "react-icons/fa";

const NotificationsPanel = ({ notifications }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return <FaExclamationTriangle className="text-red-500 text-xl" />;
      case 'success':
        return <FaCheckCircle className="text-green-500 text-xl" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500 text-xl" />;
      case 'reminder':
        return <FaClock className="text-yellow-500 text-xl" />;
      case 'event':
        return <FaCalendarAlt className="text-purple-500 text-xl" />;
      case 'system':
        return <FaBell className="text-gray-500 text-xl" />;
      default:
        return <FaBell className="text-blue-500 text-xl" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
        {notifications?.length > 0 && (
          <span className="text-sm text-blue-600 hover:underline cursor-pointer">
            View all
          </span>
        )}
      </div>
      <div className="space-y-4">
        {notifications?.length > 0 ? (
          notifications.map((notification, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-gray-800">{notification.title}</h3>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <span className="text-xs text-gray-500">{notification.date}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center py-4">No new notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;