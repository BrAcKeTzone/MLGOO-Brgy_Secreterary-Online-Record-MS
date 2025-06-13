import React from "react";
import { FaFileAlt } from "react-icons/fa";

const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
    <div className="space-y-4">
      {activities?.length > 0 ? (
        activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="text-blue-500">
              <FaFileAlt className="text-xl" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{activity.title}</h3>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <span className="text-xs text-gray-500">{activity.date}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No recent activities</p>
      )}
    </div>
  </div>
);

export default RecentActivity;