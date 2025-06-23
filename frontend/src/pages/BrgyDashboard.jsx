import React, { useEffect, useState } from "react";
import {
  FaFileAlt,
  FaChartLine,
  FaClipboardList,
  FaCheck,
  FaClock,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import useAuthStore from "../store/authStore";
import useDashboardStore from "../store/dashboardStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import { format } from "date-fns";

import WelcomeSection from "../components/DashboardComp/WelcomeSection";
import DashboardCard from "../components/DashboardComp/DashboardCard";
import QuickLink from "../components/DashboardComp/QuickLink";
import RecentActivity from "../components/HomeComp/RecentActivity";

const BrgyDashboard = () => {
  const { user } = useAuthStore();
  const {
    brgyMetrics,
    activityData,
    analyticsData,
    recentReports,
    loading,
    error,
    fetchMetrics,
    fetchActivityData,
  } = useDashboardStore();

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      // Fetch barangay metrics and activity data
      await fetchMetrics();
      await fetchActivityData();

      // Format recent reports as activities for the activity panel
      if (recentReports && recentReports.length > 0) {
        const reportActivities = recentReports.map((report) => ({
          id: report.id,
          title: `Report: ${report.reportType}`,
          description: `${report.reportName} - ${report.status}`,
          date: format(new Date(report.submittedDate), "PPp"),
          icon: getStatusIcon(report.status),
          status: report.status,
        }));

        setActivities(reportActivities);
      }
    };

    loadDashboardData();

    // Clean up store data on unmount
    return () => {
      useDashboardStore.getState().clearDashboardData();
    };
  }, [fetchMetrics, fetchActivityData]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <FaCheck className="text-green-500" />;
      case "PENDING":
        return <FaClock className="text-yellow-500" />;
      case "REJECTED":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaExclamationCircle className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  // Status badge styling
  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

    switch (status) {
      case "APPROVED":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "PENDING":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "REJECTED":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading && !brgyMetrics) {
    return <LoadingScreen message="Loading dashboard data..." />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <WelcomeSection userName={user?.firstName} />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Reports"
          value={brgyMetrics?.totalReports || 0}
          icon={<FaClipboardList className="text-white text-2xl" />}
          color="bg-blue-500"
        />
        <DashboardCard
          title="Pending Reports"
          value={brgyMetrics?.pendingReports || 0}
          icon={<FaClock className="text-white text-2xl" />}
          color="bg-yellow-500"
        />
        <DashboardCard
          title="Approved Reports"
          value={brgyMetrics?.approvedReports || 0}
          icon={<FaCheck className="text-white text-2xl" />}
          color="bg-green-500"
        />
        <DashboardCard
          title="This Week's Reports"
          value={brgyMetrics?.reportsThisWeek || 0}
          icon={<FaChartLine className="text-white text-2xl" />}
          color="bg-purple-500"
        />
      </div>

      {/* Quick Links Grid */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <QuickLink
          to="/submit-report"
          title="Submit Report"
          icon={<FaFileAlt />}
          description="Submit a new report to MLGOO"
        />
        <QuickLink
          to="/my-reports"
          title="My Reports"
          icon={<FaClipboardList />}
          description="View and manage your submitted reports"
        />
        <QuickLink
          to="/profile"
          title="Profile Settings"
          icon={<FaChartLine />}
          description="Update your profile information"
        />
      </div>

      {/* Recent Reports */}
      {recentReports && recentReports.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Reports
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Report Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Report Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Submitted By
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentReports.slice(0, 5).map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.reportName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.reportType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.submittedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(report.submittedDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(report.status)}>
                        {report.status === "APPROVED" && (
                          <FaCheck className="mr-1" />
                        )}
                        {report.status === "PENDING" && (
                          <FaClock className="mr-1" />
                        )}
                        {report.status === "REJECTED" && (
                          <FaTimesCircle className="mr-1" />
                        )}
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end">
            <a
              href="/my-reports"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all reports →
            </a>
          </div>
        </div>
      )}

      {/* Charts and Barangay Information in the same row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Monthly Activity Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Monthly Report Activity
          </h2>
          {activityData && activityData.length > 0 ? (
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activityData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} width={40} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "20px",
                      fontSize: "14px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reports"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Reports Submitted"
                    dot={{ strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 italic">
              No activity data available
            </div>
          )}
        </div>

        {/* Barangay Information Panel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Barangay Information
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Barangay Name
              </h3>
              <p className="mt-1 text-lg font-medium text-gray-900">
                {brgyMetrics?.barangayName || "Not assigned"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Total Submissions This Month
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-medium text-gray-900">
                  {brgyMetrics?.reportsThisWeek || 0}
                </span>
                {brgyMetrics?.reportsThisWeek > 0 ? (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    No activity
                  </span>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Report Status
              </h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Approved</span>
                  <span className="text-sm font-medium text-green-600">
                    {brgyMetrics?.approvedReports || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (brgyMetrics?.approvedReports /
                          (brgyMetrics?.totalReports || 1)) *
                          100 || 0
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {brgyMetrics?.pendingReports || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (brgyMetrics?.pendingReports /
                          (brgyMetrics?.totalReports || 1)) *
                          100 || 0
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rejected</span>
                  <span className="text-sm font-medium text-red-600">
                    {brgyMetrics?.rejectedReports || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (brgyMetrics?.rejectedReports /
                          (brgyMetrics?.totalReports || 1)) *
                          100 || 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Status Distribution */}
        {analyticsData &&
          analyticsData.statusDistribution &&
          analyticsData.statusDistribution.length > 0 && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Report Status Distribution
              </h2>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.statusDistribution}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value, name) => [value, "Count"]}
                    />
                    <Bar
                      dataKey="count"
                      name="Reports"
                      radius={[4, 4, 0, 0]}
                      fillOpacity={0.8}
                    >
                      {analyticsData.statusDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.status === "APPROVED"
                              ? "#10B981"
                              : entry.status === "PENDING"
                              ? "#F59E0B"
                              : entry.status === "REJECTED"
                              ? "#EF4444"
                              : "#6B7280"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
      </div>

      {/* Recent Activity */}
      {activities.length > 0 && (
        <div className="mt-8">
          <RecentActivity activities={activities} />
        </div>
      )}
    </div>
  );
};

// Import necessary Chart components
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

export default BrgyDashboard;
