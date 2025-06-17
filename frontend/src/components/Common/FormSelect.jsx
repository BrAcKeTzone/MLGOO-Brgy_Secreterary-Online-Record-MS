import React from "react";

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  required = false,
  options = [],
  placeholder,
  className = "",
  error,
}) => {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-semibold mb-2">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } focus:border-blue-500 focus:ring-2 ${
          error ? "focus:ring-red-200" : "focus:ring-blue-200"
        } transition-colors ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormSelect;