import React from 'react';

const DashboardCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className={`${color} p-4 rounded-full`}>{icon}</div>
    </div>
  </div>
);

export default DashboardCard;