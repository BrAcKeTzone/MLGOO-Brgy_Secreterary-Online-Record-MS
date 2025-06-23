import { create } from "zustand";
import { dashboardAPI } from "../services/api";
import useAuthStore from "./authStore";

const useDashboardStore = create((set, get) => ({
  metrics: null,
  brgyMetrics: null, // Added specific metrics for Barangay Secretary
  activityData: [],
  analyticsData: null,
  recentReports: [],
  barangayStats: [],
  mlgooAnalytics: null,
  loading: false,
  error: null,

  fetchMetrics: async () => {
    set({ loading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      let response;

      // Fetch metrics based on user role
      if (user && user.role === 'MLGOO_STAFF') {
        response = await dashboardAPI.fetchMlgooMetrics();
        
        // Format data for the dashboard
        const formattedMetrics = {
          totalUsers: response.data.totalUsers || 0,
          pendingApprovals: response.data.pendingReports || 0,
          recentReports: response.data.reportsThisWeek || 0,
        };

        set({
          metrics: formattedMetrics,
          recentReports: response.data.recentReports || [],
          barangayStats: response.data.barangayStats || [],
        });
      } 
      else if (user && user.role === 'BARANGAY_SECRETARY') {
        response = await dashboardAPI.fetchBarangayMetrics();
        
        // Format barangay-specific metrics
        set({
          brgyMetrics: {
            barangayName: response.data.barangayName,
            totalReports: response.data.totalReports || 0,
            pendingReports: response.data.pendingReports || 0,
            approvedReports: response.data.approvedReports || 0,
            rejectedReports: response.data.rejectedReports || 0,
            reportsThisWeek: response.data.reportsThisWeek || 0,
          },
          recentReports: response.data.recentReports || [],
        });
      } 
      else {
        throw new Error("Unknown user role");
      }
      
      set({ loading: false });
      return response.data;
    } catch (err) {
      console.error("Error fetching dashboard metrics:", err);
      set({
        error: err.response?.data?.message || "Failed to fetch dashboard metrics",
        loading: false,
      });
    }
  },

  fetchActivityData: async () => {
    set({ loading: true, error: null });
    try {
      // Get analytics data
      const response = await dashboardAPI.fetchAnalytics();
      
      // Format monthly data for the activity chart
      const formattedActivity = response.data.monthlyCounts.map(item => {
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        
        return {
          name: monthNames[item.month - 1],
          reports: item.count
        };
      });
      
      set({
        activityData: formattedActivity,
        analyticsData: {
          reportTypeDistribution: response.data.reportTypeDistribution || [],
          statusDistribution: response.data.statusDistribution || []
        },
        loading: false,
      });
      
      return response.data;
    } catch (err) {
      console.error("Error fetching activity data:", err);
      set({
        error: err.response?.data?.message || "Failed to fetch activity data",
        loading: false,
      });
    }
  },

  fetchMlgooAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await dashboardAPI.fetchMlgooAnalytics();
      
      // Store MLGOO-specific analytics
      set({
        mlgooAnalytics: response.data,
        loading: false
      });
      
      return response.data;
    } catch (err) {
      console.error("Error fetching MLGOO analytics:", err);
      set({
        error: err.response?.data?.message || "Failed to fetch MLGOO analytics",
        loading: false,
      });
    }
  },

  clearDashboardData: () => {
    set({
      metrics: null,
      brgyMetrics: null,
      activityData: [],
      analyticsData: null,
      recentReports: [],
      barangayStats: [],
      mlgooAnalytics: null,
      error: null,
    });
  },
}));

export default useDashboardStore;