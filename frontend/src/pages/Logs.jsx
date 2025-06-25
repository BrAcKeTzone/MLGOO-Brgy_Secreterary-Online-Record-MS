import React, { useEffect, useState, useCallback } from "react";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import LogFilters from "../components/LogsComp/LogFilters";
import LogTable from "../components/LogsComp/LogTable";
import useLogsStore from "../store/logsStore";
import useAuthStore from "../store/authStore";
import { FaSync, FaClock } from "react-icons/fa";

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

  // Refresh state
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Memoized refresh function
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchLogs();
      setLastUpdated(new Date());
    } catch (error) {
      // Optionally handle error
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchLogs]);

  // Initial fetch and cleanup
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshData();
    }, 60000 * 5);
    return () => clearInterval(intervalId);
  }, [refreshData]);

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

  const formatDateTime = (date) =>
    new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">System Logs</h1>
        <p className="text-gray-600">
          View and monitor system activities
          {user?.role === "BARANGAY_SECRETARY" && " for your account"}
        </p>
      </div>

      {/* Last Updated & Refresh Info */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center text-sm text-gray-500 mb-2 md:mb-0">
          <FaClock className="mr-1" />
          <span>Last updated: {formatDateTime(lastUpdated)}</span>
        </div>
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          className={`flex items-center text-sm ${
            isRefreshing
              ? "text-gray-400"
              : "text-blue-600 hover:text-blue-800"
          } transition-colors`}
        >
          <FaSync className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh data"}
        </button>
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
