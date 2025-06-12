import React from "react";

const FormInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  placeholder,
  className = "",
  error,
}) => {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } focus:border-blue-500 focus:ring-2 ${
          error ? "focus:ring-red-200" : "focus:ring-blue-200"
        } transition-colors ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput;
