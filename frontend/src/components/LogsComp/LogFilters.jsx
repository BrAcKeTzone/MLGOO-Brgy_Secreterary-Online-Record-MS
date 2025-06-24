import React, { useState } from "react";
import FormInput from "../Common/FormInput";
import FormSelect from "../Common/FormSelect";
import useAuthStore from "../../store/authStore";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";

const LogFilters = ({
  filters,
  onFilterChange,
  actionOptions,
  onClearFilters,
  onRemoveLogs,
}) => {
  const { user } = useAuthStore();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeStartDate, setRemoveStartDate] = useState("");
  const [removeEndDate, setRemoveEndDate] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);

  // Only MLGOO staff can remove logs
  const canRemoveLogs = user && user.role === "MLGOO_STAFF";

  const handleSearch = () => {
    onFilterChange({ search: searchInput });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRemoveLogs = async () => {
    if (!removeStartDate || !removeEndDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (new Date(removeStartDate) > new Date(removeEndDate)) {
      toast.error("Start date must be before end date");
      return;
    }

    setIsRemoving(true);
    try {
      const success = await onRemoveLogs(removeStartDate, removeEndDate);
      if (success) {
        toast.success(
          `Logs from ${removeStartDate} to ${removeEndDate} have been removed`
        );
        setShowRemoveModal(false);
        setRemoveStartDate("");
        setRemoveEndDate("");
      }
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow mb-2">
        <div className="flex flex-row">
          <FormInput
            placeholder="Search logs..."
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

      <div className="flex justify-between">
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          Clear Filters
        </button>

        {canRemoveLogs && (
          <button
            onClick={() => setShowRemoveModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Remove Logs
          </button>
        )}
      </div>

      {/* Remove Logs Modal - Updated to match LogoutModal style */}
      {showRemoveModal && (
        <>
          <div
            className="fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-50"
            style={{
              opacity: showRemoveModal ? 0.5 : 0,
            }}
            onClick={() => setShowRemoveModal(false)}
          />
          <div
            className={`
              fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
              transition-all duration-300 ease-in-out z-50 
              w-[90%] max-w-md bg-white rounded-lg shadow-xl
            `}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Remove Logs
              </h3>
              <p className="mb-4 text-red-600">
                Warning: This action cannot be undone. All logs within the
                selected date range will be permanently deleted.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <FormInput
                  type="date"
                  value={removeStartDate}
                  onChange={(e) => setRemoveStartDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">End Date</label>
                <FormInput
                  type="date"
                  value={removeEndDate}
                  onChange={(e) => setRemoveEndDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowRemoveModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                  disabled={isRemoving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveLogs}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium transition-colors duration-200"
                  disabled={isRemoving}
                >
                  {isRemoving ? "Removing..." : "Remove Logs"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LogFilters;
