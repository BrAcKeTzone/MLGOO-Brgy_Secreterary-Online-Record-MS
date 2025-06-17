import { create } from "zustand";
import { dashboardAPI } from "../services/api";
import { sampleDashboardMetrics, sampleActivityData } from "../data/samples/sampleDashboardData";

// Simulate API delay (in milliseconds)
const SIMULATED_DELAY = 1500;

const useDashboardStore = create((set) => ({
  metrics: null,
  activityData: [],
  loading: false,
  error: null,

  fetchMetrics: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));

      // Uncomment when API is ready
      // const { data } = await dashboardAPI.fetchMetrics();
      set({
        metrics: sampleDashboardMetrics,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch dashboard metrics",
        loading: false,
      });
      console.error("Error fetching dashboard metrics:", err);
    }
  },

  fetchActivityData: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));

      // Uncomment when API is ready
      // const { data } = await dashboardAPI.fetchActivityData();
      set({
        activityData: sampleActivityData,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch activity data",
        loading: false,
      });
      console.error("Error fetching activity data:", err);
    }
  },

  clearDashboardData: () => {
    set({
      metrics: null,
      activityData: [],
      error: null,
    });
  },
}));

export default useDashboardStore;