import { create } from "zustand";
import { sampleAdmin } from "../data/samples/sampleAdmin";
import { sampleUser } from "../data/samples/sampleUser";

const SIMULATED_DELAY = 1500;

const useProfileStore = create((set, get) => ({
  profileData: null,
  loading: false,
  error: null,

  fetchProfile: async (userId) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
      
      // Simulate fetching profile data
      const profile = userId.includes('admin') ? sampleAdmin : sampleUser;
      set({ profileData: profile, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch profile",
        loading: false
      });
    }
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
      
      set(state => ({
        profileData: { ...state.profileData, ...data },
        loading: false
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to update profile",
        loading: false
      });
      throw err;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to change password",
        loading: false
      });
      throw err;
    }
  },

  clearProfile: () => {
    set({ profileData: null, error: null });
  }
}));

export default useProfileStore;