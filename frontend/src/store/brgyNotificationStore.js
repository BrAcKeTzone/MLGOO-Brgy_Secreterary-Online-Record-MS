import { create } from 'zustand';
import { CURRENT_YEAR } from '../utils/dateUtils';
import { notificationAPI } from '../services/api';

const useBrgyNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,
  error: null,
  filters: {
    year: CURRENT_YEAR,
  },

  fetchNotifications: async (filters = null) => {
    set({ loading: true, error: null });
    try {
      // Call the real API endpoint
      const response = await notificationAPI.getUserNotifications();
      
      let filteredNotifications = response.data;
      
      // If no filters provided, use current store filters
      const currentFilters = filters || get().filters;

      // Filter by year if needed
      if (currentFilters.year) {
        filteredNotifications = filteredNotifications.filter(notification =>
          new Date(notification.dateSent).getFullYear().toString() === currentFilters.year
        );
      }

      set({ notifications: filteredNotifications, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch notifications",
        loading: false
      });
    }
  },

  markAsRead: async (notificationId) => {
    set({ loading: true, error: null });
    try {
      // Call the actual API endpoint
      await notificationAPI.markNotificationRead(notificationId);

      // Update local state to reflect the notification as read
      set(state => ({
        notifications: state.notifications.map(notification => {
          if (notification.id === parseInt(notificationId)) {
            return { ...notification, isRead: true };
          }
          return notification;
        }),
        loading: false
      }));
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Failed to mark as read", 
        loading: false 
      });
    }
  },

  updateFilters: (newFilters) => {
    set(state => {
      const updatedFilters = { ...state.filters, ...newFilters };
      state.fetchNotifications(updatedFilters); // Fetch notifications with updated filters
      return { filters: updatedFilters };
    });
  }
}));

export default useBrgyNotificationStore;