import React from "react";
import { FaBell } from "react-icons/fa";

const NotificationsPanel = ({ notifications }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
    <div className="space-y-4">
      {notifications?.length > 0 ? (
        notifications.map((notification, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className={`text-${notification.type === "alert" ? "red" : "blue"}-500`}>
              <FaBell className="text-xl" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{notification.title}</h3>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <span className="text-xs text-gray-500">{notification.date}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No new notifications</p>
      )}
    </div>
  </div>
);

export default NotificationsPanel;