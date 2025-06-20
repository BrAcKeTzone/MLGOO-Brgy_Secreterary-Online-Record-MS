import React, { useEffect } from "react";
import useRoleStore from "../../store/roleStore";
import useSettingsStore from "../../store/settingsStore";
import FormInput from "../Common/FormInput";
import FormSelect from "../Common/FormSelect";
import { optionsAccountStatus } from "../../data/options/optionsAccountStatus";

const UserFilters = ({ filters, onFilterChange }) => {
  const { roles, fetchRoles } = useRoleStore();
  const { barangays, fetchBarangays } = useSettingsStore();

  useEffect(() => {
    fetchRoles();
    fetchBarangays();
  }, [fetchRoles, fetchBarangays]);

  const roleOptions = [{ _id: "all", name: "All Roles" }, ...(roles || [])];
  const brgyOptions = [{ _id: "all", name: "All Barangays" }, ...(barangays || [])];

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <FormInput
        placeholder="Search users..."
        value={filters.search}
        onChange={(e) => onFilterChange({ search: e.target.value })}
        className="h-[46px]"
      />

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
