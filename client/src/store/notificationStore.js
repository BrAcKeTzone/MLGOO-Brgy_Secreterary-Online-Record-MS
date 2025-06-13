import { create } from "zustand";
import { sampleNotifications } from "../data/samples/sampleNotifications";
import { sampleUserList } from "../data/samples/sampleUserList";

const SIMULATED_DELAY = 1500;

const useNotificationStore = create((set, get) => ({
  notifications: [],
  users: [],
  selectedUsers: [],
  loading: false,
  error: null,
  filters: {
    search: "",
  },

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
      
      // Sort notifications by date before setting state
      const sortedNotifications = [...sampleNotifications].sort(
        (a, b) => new Date(b.dateSent) - new Date(a.dateSent)
      );
      
      set({ 
        notifications: sortedNotifications,
        loading: false 
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch notifications",
        loading: false
      });
    }
  },

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
      set({ 
        users: sampleUserList,
        loading: false 
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch users",
        loading: false
      });
    }
  },

  updateSelectedUsers: (userIds) => {
    set({ selectedUsers: userIds });
  },

  sendNotification: async (message, title, type = "info", priority = "normal") => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
      
      const newNotification = {
        _id: `notif${Date.now()}`,
        title,
        message,
        type,
        priority,
        dateSent: new Date().toISOString(),
        sentTo: get().selectedUsers.map(userId => {
          const user = get().users.find(u => u._id === userId);
          return {
            userId,
            userEmail: user.email,
            read: false
          };
        })
      };

      // Add new notification and ensure list stays sorted
      set(state => ({ 
        notifications: [newNotification, ...state.notifications],
        loading: false 
      }));

      return newNotification;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to send notification",
        loading: false
      });
      throw err;
    }
  },

  searchUsers: (searchTerm) => {
    set({ filters: { search: searchTerm } });
  }
}));

export default useNotificationStore;