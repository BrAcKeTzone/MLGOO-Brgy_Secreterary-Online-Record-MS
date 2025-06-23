import React from "react";
import FormSelect from "../Common/FormSelect";
import { getYearOptions } from "../../utils/dateUtils";

const BrgyNotificationFilters = ({ filters, onFilterChange }) => {
  const handleChange = (change) => {
    onFilterChange(change);
  };

  // Options for notification type
  const typeOptions = [
    { _id: "all", name: "All Types" },
    { _id: "info", name: "Information" },
    { _id: "reminder", name: "Reminder" },
    { _id: "alert", name: "Alert" },
    { _id: "success", name: "Success" },
    { _id: "system", name: "System" },
    { _id: "event", name: "Event" },
  ];

  // Options for notification priority
  const priorityOptions = [
    { _id: "all", name: "All Priorities" },
    { _id: "high", name: "High Priority" },
    { _id: "medium", name: "Medium Priority" },
    { _id: "normal", name: "Normal Priority" },
  ];

  // Options for read status
  const readStatusOptions = [
    { _id: "all", name: "All Notifications" },
    { _id: "read", name: "Read" },
    { _id: "unread", name: "Unread" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter Notifications</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormSelect
          label="Year"
          value={filters.year}
          onChange={(e) => handleChange({ year: e.target.value })}
          options={getYearOptions()}
          placeholder="Select Year"
        />

        <FormSelect
          label="Type"
          value={filters.type || "all"}
          onChange={(e) => handleChange({ type: e.target.value })}
          options={typeOptions}
          placeholder="Select Type"
        />

        <FormSelect
          label="Priority"
          value={filters.priority || "all"}
          onChange={(e) => handleChange({ priority: e.target.value })}
          options={priorityOptions}
          placeholder="Select Priority"
        />

        <FormSelect
          label="Status"
          value={filters.readStatus || "all"}
          onChange={(e) => handleChange({ readStatus: e.target.value })}
          options={readStatusOptions}
          placeholder="Select Status"
        />
      </div>
    </div>
  );
};

export default BrgyNotificationFilters;
