import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaFileAlt,
  FaBell,
  FaChartLine,
  FaCheck,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import useAuthStore from "../store/authStore";
import useDashboardStore from "../store/dashboardStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import { format } from "date-fns";

import DashboardCard from "../components/DashboardComp/DashboardCard";
import QuickLink from "../components/DashboardComp/QuickLink";
import ActivityChart from "../components/DashboardComp/ActivityChart";
import WelcomeSection from "../components/DashboardComp/WelcomeSection";

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const {
    metrics,
    activityData,
    analyticsData,
    recentReports,
    barangayStats,
    loading,
    error,
    fetchMetrics,
    fetchActivityData,
    fetchMlgooAnalytics,
  } = useDashboardStore();

  const [mlgooData, setMlgooData] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      await fetchMetrics();
      await fetchActivityData();

      // Fetch MLGOO-specific analytics if user is MLGOO staff
      if (user && user.role === "MLGOO_STAFF") {
        const mlgooAnalytics = await fetchMlgooAnalytics();
        setMlgooData(mlgooAnalytics);
      }
    };

    loadDashboardData();

    // Clean up store data on unmount
    return () => {
      useDashboardStore.getState().clearDashboardData();
    };
  }, [fetchMetrics, fetchActivityData, fetchMlgooAnalytics, user]);

  if (loading && !metrics) {
    return <LoadingScreen message="Loading dashboard data..." />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <WelcomeSection userName={user?.firstName} />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Total Users"
          value={metrics?.totalUsers || 0}
          icon={<FaUsers className="text-white text-2xl" />}
          color="bg-blue-500"
        />
        <DashboardCard
          title="Pending Approvals"
          value={metrics?.pendingApprovals || 0}
          icon={<FaFileAlt className="text-white text-2xl" />}
          color="bg-yellow-500"
        />
        <DashboardCard
          title="Reports This Week"
          value={metrics?.recentReports || 0}
          icon={<FaChartLine className="text-white text-2xl" />}
          color="bg-green-500"
        />
      </div>

      {/* MLGOO Staff Additional Metrics */}
      {user && user.role === "MLGOO_STAFF" && mlgooData && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            System Coverage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500">
                Barangay Secretaries
              </h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {mlgooData.userMetrics?.barangaySecretaries || 0}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500">
                Total Barangays
              </h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {mlgooData.barangayMetrics?.total || 0}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500">
                Barangays Covered
              </h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {mlgooData.barangayMetrics?.withSecretaries || 0}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500">
                Coverage Rate
              </h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {mlgooData.barangayMetrics?.coverageRate?.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Links Grid */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {user?.role === "MLGOO_STAFF" && (
          <>
            <QuickLink
              to="/manage-users"
              title="Manage Users"
              icon={<FaUsers />}
              description="Add, edit, or remove system users"
            />
            <QuickLink
              to="/manage-documents"
              title="Manage Documents"
              icon={<FaFileAlt />}
              description="Handle document submissions and approvals"
            />
            <QuickLink
              to="/notifications"
              title="Send Notifications"
              icon={<FaBell />}
              description="Send announcements and updates"
            />
          </>
        )}

        {user?.role === "BARANGAY_SECRETARY" && (
          <>
            <QuickLink
              to="/submit-report"
              title="Submit Report"
              icon={<FaFileAlt />}
              description="Submit a new report"
            />
            <QuickLink
              to="/my-reports"
              title="My Reports"
              icon={<FaChartLine />}
              description="View your submitted reports"
            />
          </>
        )}
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
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {user?.role === "MLGOO_STAFF" ? "Barangay" : "Submitted By"}
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
                      {user?.role === "MLGOO_STAFF"
                        ? report.barangay
                        : report.submittedBy}
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
        </div>
      )}

      {/* Analytics Charts */}
      <ActivityChart data={activityData} analyticsData={analyticsData} />

      {/* Barangay Stats */}
      {user?.role === "MLGOO_STAFF" &&
        barangayStats &&
        barangayStats.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Barangay Report Statistics
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Barangay
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total Reports
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Approved
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Pending
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Compliance Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {barangayStats.map((brgy) => (
                    <tr key={brgy.barangayId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {brgy.barangayName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {brgy.totalSubmitted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {brgy.approved}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {brgy.pending}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className="absolute top-0 left-0 h-2 bg-green-500 rounded-full"
                            style={{ width: `${brgy.complianceRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 mt-1 block">
                          {brgy.complianceRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
};

export default AdminDashboard;
