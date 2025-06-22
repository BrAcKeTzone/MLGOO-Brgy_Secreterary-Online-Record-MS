import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import useRoleStore from "../../store/roleStore";
import useSettingsStore from "../../store/settingsStore";
import FormInput from "../Common/FormInput";
import FormSelect from "../Common/FormSelect";
import { optionsAccountStatus } from "../../data/options/optionsAccountStatus";

const UserFilters = ({ filters, onFilterChange }) => {
  const { roles, fetchRoles } = useRoleStore();
  const { barangays, fetchBarangays } = useSettingsStore();
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    fetchRoles();
    fetchBarangays();
  }, [fetchRoles, fetchBarangays]);

  const roleOptions = [{ _id: "all", name: "All Roles" }, ...(roles || [])];
  const brgyOptions = [{ _id: "all", name: "All Barangays" }, ...(barangays || [])];

  const handleSearch = () => {
    onFilterChange({ search: searchInput });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="flex flex-row">
        <FormInput
          placeholder="Search users..."
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
        value={filters.role}
        onChange={(e) => onFilterChange({ role: e.target.value })}
        options={roleOptions}
        placeholder="Select Role"
        className="h-[46px]"
      />

      <FormSelect
        value={filters.status}
        onChange={(e) => onFilterChange({ status: e.target.value })}
        options={optionsAccountStatus}
        placeholder="Select Status"
        className="h-[46px]"
      />

      <FormSelect
        value={filters.barangay}
        onChange={(e) => onFilterChange({ barangay: e.target.value })}
        options={brgyOptions}
        placeholder="Select Barangay"
        className="h-[46px]"
      />
    </div>
  );
};

export default UserFilters;
