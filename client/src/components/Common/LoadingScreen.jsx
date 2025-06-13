import React from "react";

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-gray-600">{message}</div>
    </div>
  );
};

export default LoadingScreen;