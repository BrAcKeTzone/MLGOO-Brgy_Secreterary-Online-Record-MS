import React from "react";
import FormSelect from "../Common/FormSelect";
import { getYearOptions } from "../../utils/dateUtils";

const BrgyNotificationFilters = ({ filters, onFilterChange }) => {
  const handleChange = (change) => {
    onFilterChange(change);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        <FormSelect
          value={filters.year}
          onChange={(e) => handleChange({ year: e.target.value })}
          options={getYearOptions()}
          placeholder="Select Year"
          className="h-[46px]"
        />
      </div>
    </div>
  );
};

export default BrgyNotificationFilters;
