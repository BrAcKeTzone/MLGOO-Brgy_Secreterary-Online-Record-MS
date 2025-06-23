import { create } from "zustand";
import { notificationAPI } from "../services/api";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  barangaySecretaries: [],
  selectedSecretaryIds: [],
  loading: false,
  error: null,
  filters: {
    search: "",
  },

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      // For MLGOO staff, we need to see all notifications they've created
      // regardless of who has read them
      const response = await notificationAPI.getUserNotifications();
      
      set({ 
        notifications: response.data,
        loading: false 
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch notifications",
        loading: false
      });
    }
  },

  fetchBarangaySecretaries: async () => {
    set({ loading: true, error: null });
    try {
      const response = await notificationAPI.getBarangaySecretaries();
      
      set({ 
        barangaySecretaries: response.data,
        loading: false 
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch barangay secretaries",
        loading: false
      });
    }
  },

  updateSelectedSecretaries: (secretaryIds) => {
    set({ selectedSecretaryIds: secretaryIds });
  },

  sendNotification: async (notificationData) => {
    set({ loading: true, error: null });
    try {
      // Format data for API
      const apiData = {
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type || "info",
        priority: notificationData.priority || "normal",
        barangaySecretaryIds: get().selectedSecretaryIds
      };

      // Call the actual API endpoint
      const response = await notificationAPI.createNotification(apiData);
      
      // Add the new notification to our local state
      set(state => ({ 
        notifications: [response.data, ...state.notifications],
        loading: false 
      }));

      return response.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to send notification",
        loading: false
      });
      throw err;
    }
  },

  deleteNotification: async (notificationId) => {
    set({ loading: true, error: null });
    try {
      // Call the actual API endpoint
      await notificationAPI.deleteNotification(notificationId);
      
      // Remove the notification from our local state
      set(state => ({ 
        notifications: state.notifications.filter(n => n.id !== parseInt(notificationId)),
        loading: false 
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to delete notification",
        loading: false
      });
      throw err;
    }
  },

  searchSecretaries: (searchTerm) => {
    set({ filters: { search: searchTerm } });
  }
}));

export default useNotificationStore;