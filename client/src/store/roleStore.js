import { create } from "zustand";
import { roleAPI } from "../services/api";
import { sampleRoles } from "../data/sampleRoles";

const useRoleStore = create((set) => ({
  roles: [],
  loading: false,
  error: null,
  selectedRole: null,

  fetchRoles: async () => {
    set({ loading: true, error: null });
    try {
      // const { data } = await roleAPI.fetchRoles();
      set({ 
        roles: sampleRoles,
        loading: false 
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch roles",
        loading: false
      });
      console.error("Error fetching roles:", err);
    }
  },

  getRole: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await roleAPI.getRole(id);
      set({ 
        selectedRole: data,
        loading: false 
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch role",
        loading: false
      });
      console.error("Error fetching role:", err);
    }
  },

  clearRoles: () => {
    set({ 
      roles: [],
      selectedRole: null,
      error: null 
    });
  },
}));

export default useRoleStore;