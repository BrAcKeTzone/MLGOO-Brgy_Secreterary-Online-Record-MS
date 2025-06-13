import React, { useEffect } from "react";
import { FaUsers, FaFileAlt, FaBell, FaChartLine } from "react-icons/fa";
import useAuthStore from "../store/authStore";
import useDashboardStore from "../store/dashboardStore";

import DashboardCard from "../components/DashboardComp/DashboardCard";
import QuickLink from "../components/DashboardComp/QuickLink";
import ActivityChart from "../components/DashboardComp/ActivityChart";
import WelcomeSection from "../components/DashboardComp/WelcomeSection";

const Dashboard = () => {
  const { user } = useAuthStore();
  const {
    metrics,
    activityData,
    loading,
    error,
    fetchMetrics,
    fetchActivityData,
  } = useDashboardStore();

  useEffect(() => {
    fetchMetrics();
    fetchActivityData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <WelcomeSection userName={user?.firstName} />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Total Users"
          value={metrics?.totalUsers}
          icon={<FaUsers className="text-white text-2xl" />}
          color="bg-blue-500"
        />
        <DashboardCard
          title="Pending Approvals"
          value={metrics?.pendingApprovals}
          icon={<FaFileAlt className="text-white text-2xl" />}
          color="bg-yellow-500"
        />
        <DashboardCard
          title="Recent Reports"
          value={metrics?.recentReports}
          icon={<FaChartLine className="text-white text-2xl" />}
          color="bg-green-500"
        />
      </div>

      {/* Quick Links Grid */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>

      <ActivityChart data={activityData} />
    </div>
  );
};

export default Dashboard;
