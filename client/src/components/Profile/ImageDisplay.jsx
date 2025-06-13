import React from "react";

const ImageDisplay = ({ image, side }) => (
  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-2">
      National ID ({side})
    </label>
    {image ? (
      <div className="border rounded-lg overflow-hidden">
        <img
          src={image}
          alt={`National ID ${side}`}
          className="w-full h-48 object-cover"
        />
      </div>
    ) : (
      <div className="h-48 bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No image available</p>
      </div>
    )}
  </div>
);

export default ImageDisplay;