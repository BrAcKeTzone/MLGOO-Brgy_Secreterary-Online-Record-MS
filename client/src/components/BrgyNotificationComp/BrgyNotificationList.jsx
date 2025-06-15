import React from "react";
import { format } from "date-fns";

const BrgyNotificationList = ({ notifications, onMarkAsRead }) => {
  const formatDate = (dateString) => {
    return format(new Date(dateString), "PPpp");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Message
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Sent
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {notifications.map((notification) => {
            // Find the recipient for the current user
            const recipient = notification.sentTo.find(r => r.userId === "user001"); // Replace "user001" with actual user ID
            if (!recipient) return null; // Skip if not sent to this user

            return (
              <tr key={notification._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {notification.message}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(notification.dateSent)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {!recipient.read && (
                    <button
                      onClick={() => onMarkAsRead(notification._id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Mark as Read
                    </button>
                  )}
                  {recipient.read && (
                    <span className="text-green-500">Read</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BrgyNotificationList;