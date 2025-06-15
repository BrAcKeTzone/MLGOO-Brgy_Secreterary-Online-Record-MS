import React, { useState, useRef, useEffect } from "react";
import { FaFile, FaImage, FaTrash } from "react-icons/fa";

const FileUploader = ({ onFileSelect, selectedFiles: propSelectedFiles }) => {
  const [selectedFiles, setSelectedFiles] = useState(propSelectedFiles || []);
  const inputRef = useRef(null);

  // Update local state when prop changes
  useEffect(() => {
    setSelectedFiles(propSelectedFiles || []);
  }, [propSelectedFiles]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...newFiles]);
    onFileSelect([...selectedFiles, ...newFiles]);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleClearFile = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(updatedFiles);
    onFileSelect(updatedFiles);
  };

  const getFilePreview = (file) => {
    const previewStyle = {
      width: "120px",
      height: "120px",
      objectFit: "cover",
    };

    if (file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="rounded-md"
          style={previewStyle}
        />
      );
    } else {
      return <FaFile className="text-4xl text-gray-500" style={previewStyle} />;
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Select Files
      </button>
      <input
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        ref={inputRef}
      />

      <div className="mt-4 flex flex-wrap gap-4">
        {selectedFiles.map((file, index) => (
          <div
            key={index}
            className="flex flex-col items-center shadow-md rounded-md p-2 relative"
          >
            {getFilePreview(file)}
            <p className="text-sm text-gray-500 mt-2 break-words w-24 text-center">
              {file.name}
            </p>
            <button
              onClick={() => handleClearFile(index)}
              className="absolute top-1 right-1 bg-red-400 hover:bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              <FaTrash className="text-xs" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
