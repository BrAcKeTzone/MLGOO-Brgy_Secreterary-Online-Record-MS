import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import FormInput from "../Common/FormInput";
import FormSelect from "../Common/FormSelect";
import { optionsReportTypes } from "../../data/options/optionsReportTypes";
import { optionsReportStatus } from "../../data/options/optionsReportStatus";
import { sampleBarangays } from "../../data/samples/sampleBarangays";
import { getYearOptions } from "../../utils/dateUtils";

const DocumentFilters = ({ filters, onFilterChange }) => {
  const [searchInput, setSearchInput] = useState(filters.search);

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

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
          options={[{ _id: "all", name: "All Types" }, ...optionsReportTypes]}
          placeholder="Select Report Type"
          className="h-[46px]"
        />

        <FormSelect
          value={filters.status}
          onChange={(e) => handleChange({ status: e.target.value })}
          options={[{ _id: "all", name: "All Status" }, ...optionsReportStatus]}
          placeholder="Select Status"
          className="h-[46px]"
        />

        <FormSelect
          value={filters.barangay}
          onChange={(e) => handleChange({ barangay: e.target.value })}
          options={[{ _id: "all", name: "All Barangays" }, ...sampleBarangays]}
          placeholder="Select Barangay"
          className="h-[46px]"
        />
      </div>
    </div>
  );
};

export default DocumentFilters;
