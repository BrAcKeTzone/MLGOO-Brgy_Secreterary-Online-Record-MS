import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import FormInput from "../Common/FormInput";
import FormSelect from "../Common/FormSelect";
import { getYearOptions } from "../../utils/dateUtils";
import useSettingsStore from "../../store/settingsStore";

const MyReportsFilters = ({ filters, onFilterChange }) => {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const { reportTypes, fetchReportTypes } = useSettingsStore();

  useEffect(() => {
    // Fetch report types for filtering
    fetchReportTypes();
  }, [fetchReportTypes]);

  // Update local search state when filter changes externally
  useEffect(() => {
    setSearchInput(filters.search || "");
  }, [filters.search]);

  const handleSearch = () => {
    onFilterChange({ search: searchInput });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (change) => {
    onFilterChange(change);
  };

  // Transform report types for select component
  const reportTypeOptions = [
    { _id: "all", name: "All Types" },
    ...(reportTypes?.map((type) => ({
      _id: type.shortName,
      name: type.name,
    })) || []),
  ];

  // Status options matching backend values
  const statusOptions = [
    { _id: "all", name: "All Status" },
    { _id: "PENDING", name: "Pending" },
    { _id: "APPROVED", name: "Approved" },
    { _id: "REJECTED", name: "Rejected" },
  ];

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-row">
          <FormInput
            placeholder="Search reports..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-[46px] rounded-r-none"
          />
          <div className="justify-end flex flex-col">
            <button
              type="button"
              onClick={handleSearch}
              className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{ height: "46px" }}
            >
              <FaSearch />
            </button>
          </div>
        </div>

        <FormSelect
          value={filters.year}
          onChange={(e) => handleChange({ year: e.target.value })}
          options={getYearOptions()}
          placeholder="Select Year"
          className="h-[46px]"
        />

        <FormSelect
          value={filters.reportType}
          onChange={(e) => handleChange({ reportType: e.target.value })}
          options={reportTypeOptions}
          placeholder="Select Report Type"
          className="h-[46px]"
        />

        <FormSelect
          value={filters.status}
          onChange={(e) => handleChange({ status: e.target.value })}
          options={statusOptions}
          placeholder="Select Status"
          className="h-[46px]"
        />
      </div>
    </div>
  );
};

export default MyReportsFilters;
