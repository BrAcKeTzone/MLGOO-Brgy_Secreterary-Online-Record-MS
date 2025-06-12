import React from "react";

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4">
      <p className="text-red-700 text-sm">{error}</p>
    </div>
  );
};

export default ErrorMessage;
