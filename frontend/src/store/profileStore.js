import { create } from "zustand";
import { profileAPI } from "../services/api";

const useProfileStore = create((set) => ({
  profileData: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await profileAPI.getProfile();
      set({ profileData: data.profile, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch profile",
        loading: false
      });
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ loading: true, error: null });
    try {
      const { data } = await profileAPI.changePassword(currentPassword, newPassword);
      set({ loading: false });
      return data;
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