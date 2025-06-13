import React, { useEffect } from "react";
import useAuthStore from "../store/authStore";
import useUserHomeStore from "../store/userHomeStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";

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
    return <LoadingScreen message="Loading dashboard data..." />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
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
