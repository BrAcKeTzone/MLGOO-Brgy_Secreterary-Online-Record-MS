import React from "react";
import FormInput from "../Common/FormInput";
import FormSelect from "../Common/FormSelect";
import { optionsReportTypes } from "../../data/options/optionsReportTypes";
import { optionsReportStatus } from "../../data/options/optionsReportStatus";
import { sampleBarangays } from "../../data/samples/sampleBarangays";

const DocumentFilters = ({ filters, onFilterChange }) => {
  const reportTypeOptions = [
    { _id: "all", name: "All Types" },
    ...optionsReportTypes,
  ];

  const barangayOptions = [
    { _id: "all", name: "All Barangays" },
    ...sampleBarangays,
  ];

  const statusOptions = [
    { _id: "all", name: "All Statuses" },
    ...optionsReportStatus,
  ];

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormInput
          placeholder="Search reports..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="h-[46px]"
        />

        <FormSelect
          value={filters.reportType}
          onChange={(e) => onFilterChange({ reportType: e.target.value })}
          options={reportTypeOptions}
          placeholder="Select Report Type"
          className="h-[46px]"
        />

        <FormSelect
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          options={statusOptions}
          placeholder="Select Status"
          className="h-[46px]"
        />

        <FormSelect
          value={filters.barangay}
          onChange={(e) => onFilterChange({ barangay: e.target.value })}
          options={barangayOptions}
          placeholder="Select Barangay"
          className="h-[46px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              type="date"
              value={filters.startDate}
              onChange={(e) => onFilterChange({ startDate: e.target.value })}
              placeholder="Start Date"
              className="h-[46px]"
            />
            <FormInput
              type="date"
              value={filters.endDate}
              onChange={(e) => onFilterChange({ endDate: e.target.value })}
              placeholder="End Date"
              className="h-[46px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentFilters;
