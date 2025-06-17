import React from 'react';

const WelcomeSection = ({ userName }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-800">
      Welcome back, {userName || "Admin"}
    </h1>
    <p className="text-gray-600 mt-1">
      Here's what's happening in your system today
    </p>
  </div>
);

export default WelcomeSection;