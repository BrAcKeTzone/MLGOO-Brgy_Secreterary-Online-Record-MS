import React from "react";
import ImageDisplay from "./ImageDisplay";

const NationalIdSection = ({ frontImage, backImage, idType }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          ID Verification Documents
        </h2>
        {idType && (
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {idType}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageDisplay image={frontImage} side="Front" />
        <ImageDisplay image={backImage} side="Back" />
      </div>
    </div>
  );
};

export default NationalIdSection;
