import { create } from 'zustand';
import { sampleNotifications } from '../data/samples/sampleNotifications';
import { CURRENT_YEAR } from '../utils/dateUtils';

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // If no filters provided, use current store filters
      const currentFilters = filters || get().filters;

      // Filter notifications for the current user (Barangay Secretary)
      // Assuming you have a way to identify the current user's ID
      const currentUserId = "user001"; // Replace with actual user ID

      let filteredNotifications = sampleNotifications.filter(notification =>
        notification.sentTo.some(recipient => recipient.userId === currentUserId)
      );

      // Filter by year
      filteredNotifications = filteredNotifications.filter(notification =>
        new Date(notification.dateSent).getFullYear().toString() === currentFilters.year
      );

      set({ notifications: filteredNotifications, loading: false });
    } catch (err) {
      set({
        error: err.message || "Failed to fetch notifications",
        loading: false
      });
    }
  },

  markAsRead: async (notificationId) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      set(state => ({
        notifications: state.notifications.map(notification => {
          if (notification._id === notificationId) {
            const updatedSentTo = notification.sentTo.map(recipient => ({
              ...recipient,
              read: true // Mark as read for all recipients (or specific recipient)
            }));
            return { ...notification, sentTo: updatedSentTo };
          }
          return notification;
        }),
        loading: false
      }));
    } catch (err) {
      set({ error: err.message || "Failed to mark as read", loading: false });
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