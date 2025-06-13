import React from "react";
import { FaImage } from "react-icons/fa";

const ImageDisplay = ({
  label,
  name,
  currentImage,
  onChange,
  disabled = false,
  required = false,
}) => {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        {label}
      </label>
      <div className="border rounded-lg overflow-hidden">
        {currentImage ? (
          <div className="relative group">
            <img
              src={currentImage}
              alt={label}
              className="w-full h-48 object-cover"
            />
            {!disabled && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <label className="cursor-pointer text-white text-sm bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">
                  Change Image
                  <input
                    type="file"
                    name={name}
                    onChange={onChange}
                    accept="image/*"
                    className="hidden"
                    disabled={disabled}
                    required={required}
                  />
                </label>
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 bg-gray-100 flex flex-col items-center justify-center">
            <FaImage className="text-4xl text-gray-400 mb-2" />
            {!disabled && (
              <label className="cursor-pointer text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Upload Image
                <input
                  type="file"
                  name={name}
                  onChange={onChange}
                  accept="image/*"
                  className="hidden"
                  disabled={disabled}
                  required={required}
                />
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;