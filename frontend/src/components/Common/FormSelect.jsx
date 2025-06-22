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
  valueField = "id", // Default to id, but can be overridden
  labelField = "name", // Default to name, but can be overridden
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
        <option key="placeholder" value="">
          {placeholder}
        </option>
        {options.map((option) => {
          // Get the value from the specified valueField, fall back to id or _id
          const optionValue =
            option[valueField] !== undefined
              ? option[valueField]
              : option.id || option._id || option.value;

          // Get the label from the specified labelField, fall back to name
          const optionLabel =
            option[labelField] !== undefined
              ? option[labelField]
              : option.label || option.name;

          return (
            <option
              key={optionValue || `option-${optionLabel}`}
              value={optionValue}
            >
              {optionLabel}
            </option>
          );
        })}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormSelect;
