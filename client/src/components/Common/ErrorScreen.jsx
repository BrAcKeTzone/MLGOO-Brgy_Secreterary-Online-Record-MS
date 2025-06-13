import React from "react";

const ErrorScreen = ({ error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-red-600">Error: {error}</div>
    </div>
  );
};

export default ErrorScreen;