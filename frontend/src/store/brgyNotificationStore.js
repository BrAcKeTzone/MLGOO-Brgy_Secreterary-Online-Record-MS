import { create } from 'zustand';
import { CURRENT_YEAR } from '../utils/dateUtils';
import { notificationAPI } from '../services/api';

const useBrgyNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,
  error: null,
  filters: {
    year: CURRENT_YEAR,
    type: "all",
    priority: "all",
    readStatus: "all"
  },

  fetchNotifications: async (filters = null) => {
    set({ loading: true, error: null });
    try {
      // Call the real API endpoint
      const response = await notificationAPI.getUserNotifications();
      
      let filteredNotifications = response.data;
      
      // If no filters provided, use current store filters
      const currentFilters = filters || get().filters;

      // Apply filters
      if (currentFilters) {
        // Filter by year if needed
        if (currentFilters.year && currentFilters.year !== "all") {
          filteredNotifications = filteredNotifications.filter(notification =>
            new Date(notification.dateSent).getFullYear().toString() === currentFilters.year
          );
        }

        // Filter by type if needed
        if (currentFilters.type && currentFilters.type !== "all") {
          filteredNotifications = filteredNotifications.filter(notification =>
            notification.type === currentFilters.type
          );
        }

        // Filter by priority if needed
        if (currentFilters.priority && currentFilters.priority !== "all") {
          filteredNotifications = filteredNotifications.filter(notification =>
            notification.priority === currentFilters.priority
          );
        }

        // Filter by read status if needed
        if (currentFilters.readStatus && currentFilters.readStatus !== "all") {
          const isRead = currentFilters.readStatus === "read";
          filteredNotifications = filteredNotifications.filter(notification =>
            notification.isRead === isRead
          );
        }
      }

      // Sort notifications - unread first, then by date
      filteredNotifications.sort((a, b) => {
        // First sort by read status (unread first)
        if (a.isRead !== b.isRead) {
          return a.isRead ? 1 : -1;
        }
        // Then sort by date (newest first)
        return new Date(b.dateSent) - new Date(a.dateSent);
      });

      set({ notifications: filteredNotifications, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch notifications",
        loading: false
      });
    }
  },

  markAsRead: async (notificationId) => {
    set(state => ({ loading: true }));
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
      
      // Update unread count in any other components that might be using it
      const updatedNotifications = get().notifications;
      const unreadCount = updatedNotifications.filter(notification => !notification.isRead).length;
      
      // If we've read all notifications and filter is set to unread only, refresh with all notifications
      const currentFilters = get().filters;
      if (unreadCount === 0 && currentFilters.readStatus === "unread") {
        get().updateFilters({ readStatus: "all" });
      }
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Failed to mark as read", 
        loading: false 
      });
      throw err;
    }
  },

  updateFilters: (newFilters) => {
    set(state => {
      const updatedFilters = { ...state.filters, ...newFilters };
      state.fetchNotifications(updatedFilters); // Fetch notifications with updated filters
      return { filters: updatedFilters };
    });
  },
  
  clearFilters: () => {
    const defaultFilters = {
      year: CURRENT_YEAR,
      type: "all",
      priority: "all",
      readStatus: "all"
    };
    
    set(state => {
      state.fetchNotifications(defaultFilters);
      return { filters: defaultFilters };
    });
  }
}));

export default useBrgyNotificationStore;