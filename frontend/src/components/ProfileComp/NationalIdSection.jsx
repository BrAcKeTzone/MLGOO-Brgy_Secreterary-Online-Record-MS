import React from "react";
import ImageDisplay from "./ImageDisplay";

const NationalIdSection = ({ frontImage, backImage }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        ID Verification Documents
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageDisplay image={frontImage} side="Front" />
        <ImageDisplay image={backImage} side="Back" />
      </div>
    </div>
  );
};

export default NationalIdSection;
