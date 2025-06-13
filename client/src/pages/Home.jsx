import React, { useEffect } from "react";
import useAuthStore from "../store/authStore";
import useDashboardStore from "../store/dashboardStore";
import WelcomeSection from "../components/DashboardComp/WelcomeSection";
import RecentActivity from "../components/HomeComp/RecentActivity";
import NotificationsPanel from "../components/HomeComp/NotificationsPanel";
import QuickActions from "../components/HomeComp/QuickActions";
import { sampleActivities, sampleNotifications } from "../data/sampleHomeData";

const Home = () => {
  const { user } = useAuthStore();
  const { metrics, loading, error, fetchMetrics } = useDashboardStore();

  useEffect(() => {
    fetchMetrics();
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
      <QuickActions />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={sampleActivities} />
        <NotificationsPanel notifications={sampleNotifications} />
      </div>
    </div>
  );
};

export default Home;
