import React from "react";

const NotificationLog = ({ notifications, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "normal":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "reminder":
        return "⏰";
      case "alert":
        return "⚠️";
      case "success":
        return "✅";
      case "system":
        return "🖥️";
      case "event":
        return "📅";
      case "info":
      default:
        return "ℹ️";
    }
  };

  // Sort notifications by date before rendering
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.dateSent) - new Date(a.dateSent)
  );

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          Notification Log
        </h2>
      </div>

      {sortedNotifications.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedNotifications.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="mr-2">
                        {getTypeIcon(notification.type)}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {notification.message}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Sent: {formatDate(notification.dateSent)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {notification.sentTo?.length} recipient(s)
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {notification.sentTo?.slice(0, 3).map((recipient) => (
                        <div key={recipient.id} className="truncate max-w-xs">
                          {recipient.firstName} {recipient.lastName}
                        </div>
                      ))}
                      {notification.sentTo?.length > 3 && (
                        <div>+{notification.sentTo.length - 3} more</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex text-sm font-medium px-2 py-1 rounded-full ${
                        getPriorityColor(notification.priority) ===
                          "text-red-600"
                          ? "bg-red-100"
                          : getPriorityColor(notification.priority) ===
                            "text-yellow-600"
                          ? "bg-yellow-100"
                          : "bg-green-100"
                      } ${getPriorityColor(notification.priority)}`}
                    >
                      {notification.priority.charAt(0).toUpperCase() +
                        notification.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDelete(notification.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          No notifications have been sent yet.
        </div>
      )}
    </div>
  );
};

export default NotificationLog;
