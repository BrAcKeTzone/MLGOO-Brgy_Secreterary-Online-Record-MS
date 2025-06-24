import React, { useEffect } from "react";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import LogFilters from "../components/LogsComp/LogFilters";
import LogTable from "../components/LogsComp/LogTable";
import useLogsStore from "../store/logsStore";
import useAuthStore from "../store/authStore";

const Logs = () => {
  const {
    filteredLogs,
    loading,
    error,
    filters,
    pagination,
    actionTypes,
    fetchLogs,
    updateFilters,
    clearFilters,
    nextPage,
    prevPage,
    removeLogsByDateRange,
  } = useLogsStore();

  const { user } = useAuthStore();

  useEffect(() => {
    fetchLogs();
  }, []);

  // Create action options from API-provided action types
  const actionOptions = [
    { _id: "all", name: "All Actions" },
    ...(actionTypes || []).map((action) => ({ _id: action, name: action })),
  ];

  if (loading && filteredLogs.length === 0) {
    return <LoadingScreen message="Loading logs..." />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">System Logs</h1>
        <p className="text-gray-600">
          View and monitor system activities
          {user?.role === "BARANGAY_SECRETARY" && " for your account"}
        </p>
      </div>

      <LogFilters
        filters={filters}
        onFilterChange={updateFilters}
        onClearFilters={clearFilters}
        onRemoveLogs={removeLogsByDateRange}
        actionOptions={actionOptions}
      />

      {loading && filteredLogs.length > 0 && (
        <div className="py-4 text-center text-gray-500">Updating logs...</div>
      )}

      <LogTable
        logs={filteredLogs}
        pagination={pagination}
        onNextPage={nextPage}
        onPreviousPage={prevPage}
      />
    </div>
  );
};

export default Logs;
