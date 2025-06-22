import { create } from "zustand";
import { userAPI } from "../services/api";

const useUserListStore = create((set, get) => ({
  users: [],
  filteredUsers: [],
  loading: false,
  error: null,
  selectedUser: null,
  viewModalOpen: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  filters: {
    search: "",
    role: "all",
    status: "all",
    barangay: "all" 
  },

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const { filters, pagination } = get();
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.role !== 'all') queryParams.append('role', filters.role);
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.barangay !== 'all') queryParams.append('barangay', filters.barangay);
      
      const { data } = await userAPI.fetchUsers(queryParams.toString());
      
      set({ 
        users: data.users,
        filteredUsers: data.users,
        pagination: data.pagination,
        loading: false 
      });
    } catch (err) {
      console.error("Error fetching users:", err);
      set({
        error: err.response?.data?.message || "Failed to fetch users",
        loading: false
      });
    }
  },

  updateFilters: (newFilters) => {
    set(state => ({ 
      filters: { ...state.filters, ...newFilters },
      // Reset to page 1 when filters change
      pagination: { ...state.pagination, page: 1 }
    }));
    get().fetchUsers();
  },

  setPage: (page) => {
    set(state => ({ 
      pagination: { ...state.pagination, page }
    }));
    get().fetchUsers();
  },

  updateUserStatus: async (userId, newStatus, newActiveStatus = null) => {
    set({ loading: true, error: null });
    try {
      const updateData = {};
      if (newStatus) updateData.status = newStatus;
      if (newActiveStatus) updateData.activeStatus = newActiveStatus;
      
      await userAPI.updateUserStatus(userId, updateData);
      
      // Refresh the user list after update
      await get().fetchUsers();
      set({ loading: false });
    } catch (err) {
      console.error("Error updating user status:", err);
      set({
        error: err.response?.data?.message || "Failed to update user status",
        loading: false
      });
      throw err;
    }
  },

  deleteUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      await userAPI.deleteUser(userId);
      
      // Refresh the user list after deletion
      await get().fetchUsers();
      set({ loading: false });
    } catch (err) {
      console.error("Error deleting user:", err);
      set({
        error: err.response?.data?.message || "Failed to delete user",
        loading: false
      });
      throw err;
    }
  },
  
  // Add functions for the user view modal
  openViewModal: (user) => {
    set({ 
      selectedUser: user,
      viewModalOpen: true 
    });
  },
  
  closeViewModal: () => {
    set({ 
      selectedUser: null,
      viewModalOpen: false 
    });
  }
}));

export default useUserListStore;