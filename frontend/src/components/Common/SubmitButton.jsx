import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const SubmitButton = ({ loading, disabled, loadingText, text }) => {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="inline-flex items-center">
          <LoadingSpinner />
          {loadingText}
        </span>
      ) : (
        text
      )}
    </button>
  );
};

export default SubmitButton;
