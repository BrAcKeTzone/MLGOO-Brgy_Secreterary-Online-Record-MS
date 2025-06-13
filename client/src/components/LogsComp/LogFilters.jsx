import React from "react";
import FormInput from "../Common/FormInput";
import FormSelect from "../Common/FormSelect";

const LogFilters = ({ filters, onFilterChange, actionOptions }) => {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <FormInput
        placeholder="Search logs..."
        value={filters.search}
        onChange={(e) => onFilterChange({ search: e.target.value })}
        className="h-[46px]"
      />
      <FormSelect
        value={filters.action}
        onChange={(e) => onFilterChange({ action: e.target.value })}
        options={actionOptions}
        placeholder="Select Action"
        className="h-[46px]"
      />
      <FormInput
        type="date"
        value={filters.startDate}
        onChange={(e) => onFilterChange({ startDate: e.target.value })}
        className="h-[46px]"
        placeholder="Start Date"
      />
      <FormInput
        type="date"
        value={filters.endDate}
        onChange={(e) => onFilterChange({ endDate: e.target.value })}
        className="h-[46px]"
        placeholder="End Date"
      />
    </div>
  );
};

export default LogFilters;
