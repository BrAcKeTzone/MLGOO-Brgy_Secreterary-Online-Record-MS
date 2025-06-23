import React from "react";
import { format } from "date-fns";
import { FaBell, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaClock, FaCalendarAlt, FaEnvelopeOpen, FaEnvelope, FaLock } from "react-icons/fa";

const BrgyNotificationList = ({ notifications, onMarkAsRead, loading }) => {
  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return <FaExclamationTriangle className="text-red-500 text-lg" />;
      case 'success':
        return <FaCheckCircle className="text-green-500 text-lg" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500 text-lg" />;
      case 'reminder':
        return <FaClock className="text-yellow-500 text-lg" />;
      case 'event':
        return <FaCalendarAlt className="text-purple-500 text-lg" />;
      case 'system':
        return <FaBell className="text-gray-500 text-lg" />;
      default:
        return <FaBell className="text-blue-500 text-lg" />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">High</span>;
      case 'medium':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>;
      case 'normal':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Normal</span>;
      default:
        return null;
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <FaBell className="mx-auto text-gray-300 text-4xl mb-2" />
        <p className="text-gray-500">No notifications found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="overflow-hidden">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`border-b border-gray-200 p-4 hover:bg-gray-50 cursor-pointer transition-all ${notification.isRead ? 'opacity-75' : ''}`}
            onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-grow">
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-900">
                    {notification.title}
                  </h3>
                  <div className="ml-2">
                    {notification.isRead ? 
                      <FaEnvelopeOpen className="text-gray-400 text-sm" title="Read" /> : 
                      <FaEnvelope className="text-blue-500 text-sm" title="Unread" />
                    }
                  </div>
                  <div className="ml-auto">
                    {getPriorityBadge(notification.priority)}
                  </div>
                </div>
                
                {notification.isRead ? (
                  // Show full message if notification is read
                  <p className="text-sm text-gray-600 my-1">{notification.message}</p>
                ) : (
                  // Show a locked message prompt if notification is unread
                  <div className="flex items-center space-x-2 my-1 py-2 px-3 bg-gray-50 rounded-md border border-gray-100">
                    <FaLock className="text-gray-400" />
                    <p className="text-sm text-gray-500 italic">Click to view message content</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    {formatDate(notification.dateSent)}
                  </p>
                  {!notification.isRead && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(notification.id);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrgyNotificationList;
