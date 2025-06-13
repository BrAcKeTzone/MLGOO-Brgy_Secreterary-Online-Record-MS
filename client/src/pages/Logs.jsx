import React, { useEffect } from "react";
import { format } from "date-fns";
import FormInput from "../components/Common/FormInput";
import FormSelect from "../components/Common/FormSelect";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import useLogsStore from "../store/logsStore";
import { logActionTypes } from "../data/options/optionsLogActionTypes";

const Logs = () => {
  const {
    filteredLogs,
    loading,
    error,
    filters,
    fetchLogs,
    updateFilters,
  } = useLogsStore();

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

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormInput
          placeholder="Search logs..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="h-[46px]"
        />
        <FormSelect
          value={filters.action}
          onChange={(e) => updateFilters({ action: e.target.value })}
          options={actionOptions}
          placeholder="Select Action"
          className="h-[46px]"
        />
        <FormInput
          type="date"
          value={filters.startDate}
          onChange={(e) => updateFilters({ startDate: e.target.value })}
          className="h-[46px]"
          placeholder="Start Date"
        />
        <FormInput
          type="date"
          value={filters.endDate}
          onChange={(e) => updateFilters({ endDate: e.target.value })}
          className="h-[46px]"
          placeholder="End Date"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Log ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.userName}</div>
                    <div className="text-sm text-gray-500">{log.userEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(log.timestamp), "PPpp")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Logs;
