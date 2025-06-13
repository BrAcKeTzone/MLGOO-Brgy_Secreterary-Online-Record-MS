import React, { useEffect } from "react";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import LogFilters from "../components/Logs/LogFilters";
import LogTable from "../components/Logs/LogTable";
import useLogsStore from "../store/logsStore";
import { logActionTypes } from "../data/options/optionsLogActionTypes";

const Logs = () => {
  const { filteredLogs, loading, error, filters, fetchLogs, updateFilters } =
    useLogsStore();

  useEffect(() => {
    fetchLogs();
  }, []);

  const actionOptions = [
    { _id: "all", name: "All Actions" },
    ...logActionTypes.map((action) => ({ _id: action, name: action })),
  ];

  if (loading) {
    return <LoadingScreen message="Loading logs..." />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">System Logs</h1>
        <p className="text-gray-600">View and monitor system activities</p>
      </div>

      <LogFilters
        filters={filters}
        onFilterChange={updateFilters}
        actionOptions={actionOptions}
      />

      <LogTable logs={filteredLogs} />
    </div>
  );
};

export default Logs;
