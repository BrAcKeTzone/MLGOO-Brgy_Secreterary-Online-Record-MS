import { create } from "zustand";
import { sampleUserList } from "../data/samples/sampleUserList";

const SIMULATED_DELAY = 1500;

const useUserListStore = create((set, get) => ({
  users: [],
  filteredUsers: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    role: "all",
    status: "all",
    barangay: "all" 
  },

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
      set({ 
        users: sampleUserList,
        filteredUsers: sampleUserList,
        loading: false 
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch users",
        loading: false
      });
    }
  },

  updateFilters: (newFilters) => {
    const { users } = get();
    const filters = { ...get().filters, ...newFilters };
    set({ filters });

    let filtered = [...users];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    // Apply role filter
    if (filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Apply barangay filter
    if (filters.barangay !== 'all') {
      filtered = filtered.filter(user => 
        user.role === 'role001' && user.assignedBrgy === filters.barangay
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      if (filters.status === 'Active' || filters.status === 'Deactivated') {
        filtered = filtered.filter(user => 
          user.creationStatus === 'Approved' && 
          user.activeStatus === filters.status
        );
      } else {
        filtered = filtered.filter(user => user.creationStatus === filters.status);
      }
    }

    set({ filteredUsers: filtered });
  },

  updateUserStatus: async (userId, newStatus, newActiveStatus = null) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
      
      const updatedUsers = get().users.map(user => {
        if (user._id === userId) {
          return {
            ...user,
            creationStatus: newStatus,
            activeStatus: newActiveStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return user;
      });

      set({ 
        users: updatedUsers,
        loading: false 
      });
      get().updateFilters({}); // Refresh filtered list
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to update user status",
        loading: false
      });
    }
  },

  deleteUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
      
      const updatedUsers = get().users.filter(user => user._id !== userId);
      set({ 
        users: updatedUsers,
        loading: false 
      });
      get().updateFilters({}); // Refresh filtered list
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to delete user",
        loading: false
      });
    }
  }
}));

export default useUserListStore;