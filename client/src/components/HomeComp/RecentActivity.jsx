import React from "react";
import { 
  FaFileAlt, 
  FaUserPlus, 
  FaSignInAlt, 
  FaSignOutAlt, 
  FaBell, 
  FaKey,
  FaEdit,
  FaTrash
} from "react-icons/fa";

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (title) => {
    if (title.includes('LOGIN')) return <FaSignInAlt className="text-green-500 text-xl" />;
    if (title.includes('LOGOUT')) return <FaSignOutAlt className="text-red-500 text-xl" />;
    if (title.includes('CREATED')) return <FaUserPlus className="text-blue-500 text-xl" />;
    if (title.includes('UPDATED')) return <FaEdit className="text-yellow-500 text-xl" />;
    if (title.includes('DELETED')) return <FaTrash className="text-red-500 text-xl" />;
    if (title.includes('PASSWORD')) return <FaKey className="text-purple-500 text-xl" />;
    if (title.includes('NOTIFICATION')) return <FaBell className="text-blue-500 text-xl" />;
    return <FaFileAlt className="text-gray-500 text-xl" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
        {activities?.length > 0 && (
          <span className="text-sm text-blue-600 hover:underline cursor-pointer">
            View all
          </span>
        )}
      </div>
      <div className="space-y-4">
        {activities?.length > 0 ? (
          activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex-shrink-0">
                {getActivityIcon(activity.title)}
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-gray-800">{activity.title}</h3>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <span className="text-xs text-gray-500">{activity.date}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center py-4">No recent activities</p>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;