import React, { useEffect } from "react";
import useAuthStore from "../store/authStore";
import useUserHomeStore from "../store/userHomeStore";

import WelcomeSection from "../components/DashboardComp/WelcomeSection";
import RecentActivity from "../components/HomeComp/RecentActivity";
import NotificationsPanel from "../components/HomeComp/NotificationsPanel";
import QuickActions from "../components/HomeComp/QuickActions";

const Home = () => {
  const { user } = useAuthStore();
  const {
    activities,
    notifications,
    loading,
    error,
    fetchActivities,
    fetchNotifications,
  } = useUserHomeStore();

  useEffect(() => {
    fetchActivities();
    fetchNotifications();
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
        <RecentActivity activities={activities} />
        <NotificationsPanel notifications={notifications} />
      </div>
    </div>
  );
};

export default Home;
