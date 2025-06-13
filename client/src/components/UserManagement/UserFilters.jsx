import React, { useEffect } from "react";
import useRoleStore from "../../store/roleStore";
import FormInput from "../Common/FormInput";
import FormSelect from "../Common/FormSelect";
import { optionsStatus } from "../../data/options/optionsStatus";

const UserFilters = ({ filters, onFilterChange }) => {
  const { roles, fetchRoles } = useRoleStore();

  useEffect(() => {
    fetchRoles();
  }, []);

  const roleOptions = [{ _id: "all", name: "All Roles" }, ...(roles || [])];

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
        options={optionsStatus}
        placeholder="Select Status"
        className="h-[46px]"
      />
    </div>
  );
};

export default UserFilters;
