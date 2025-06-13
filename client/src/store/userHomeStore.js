import { create } from "zustand";
import { homeAPI } from "../services/api";
import { sampleActivities, sampleNotifications } from "../data/sampleHomeData";

const SIMULATED_DELAY = 1500;

const useUserHomeStore = create((set) => ({
  activities: [],
  notifications: [],
  loading: false,
  error: null,

  fetchActivities: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));
      
      // Uncomment when API is ready
      // const { data } = await HomeAPI.fetchActivities();
      set({
        activities: sampleActivities,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch activities",
        loading: false,
      });
      console.error("Error fetching activities:", err);
    }
  },

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));
      
      // Uncomment when API is ready
      // const { data } = await HomeAPI.fetchNotifications();
      set({
        notifications: sampleNotifications,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch notifications",
        loading: false,
      });
      console.error("Error fetching notifications:", err);
    }
  },

  clearUserHomeData: () => {
    set({
      activities: [],
      notifications: [],
      error: null,
    });
  },
}));

export default useUserHomeStore;