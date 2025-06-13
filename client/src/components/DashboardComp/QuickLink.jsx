import React from 'react';
import { Link } from 'react-router-dom';

const QuickLink = ({ to, title, icon, description }) => (
  <Link
    to={to}
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
  >
    <div className="flex items-center gap-4">
      <div className="text-blue-600 text-2xl">{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </Link>
);

export default QuickLink;