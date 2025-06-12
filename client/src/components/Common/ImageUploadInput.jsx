import React from "react";

const ImageUploadInput = ({ label, name, onChange, preview, required = false }) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {!preview ? (
          <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg cursor-pointer">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="mt-2 text-sm text-gray-500">
              Click to upload your ID
            </span>
          </div>
        ) : (
          <div className="relative h-40">
            <img
              src={preview}
              alt={`${label} Preview`}
              className="w-full h-full rounded-lg object-contain"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
              <span className="text-white text-sm">Click to change</span>
            </div>
          </div>
        )}
        <input
          type="file"
          name={name}
          onChange={onChange}
          accept="image/*"
          required={required}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ImageUploadInput;