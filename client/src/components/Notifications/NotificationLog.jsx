import React from "react";

const NotificationLog = ({ notifications }) => {
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedNotifications.map((notification) => (
              <tr key={notification._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {notification.message}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Sent: {formatDate(notification.dateSent)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {notification.sentTo.length} recipient(s)
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {notification.sentTo.slice(0, 2).map((recipient) => (
                      <div key={recipient.userId}>{recipient.userEmail}</div>
                    ))}
                    {notification.sentTo.length > 2 && (
                      <div>+{notification.sentTo.length - 2} more</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex text-sm ${getPriorityColor(
                      notification.priority
                    )}`}
                  >
                    {notification.priority.charAt(0).toUpperCase() +
                      notification.priority.slice(1)}{" "}
                    Priority
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {notification.sentTo.filter((r) => r.read).length} read
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationLog;
