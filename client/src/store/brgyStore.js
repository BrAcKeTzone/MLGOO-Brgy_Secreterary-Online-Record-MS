import { create } from "zustand";
import { brgyAPI } from "../services/api";
import { sampleBarangays } from "../data/sampleBarangays";

const useBrgyStore = create((set) => ({
  barangays: [],
  loading: false,
  error: null,
  selectedBarangay: null,

  fetchBarangays: async () => {
    set({ loading: true, error: null });
    try {
    //   const { data } = await brgyAPI.fetchBarangays();
      set({ 
        barangays: sampleBarangays,
        loading: false 
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch barangays",
        loading: false
      });
      console.error("Error fetching barangays:", err);
    }
  },

  getBarangay: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await brgyAPI.getBarangay(id);
      set({ 
        selectedBarangay: data,
        loading: false 
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch barangay",
        loading: false
      });
      console.error("Error fetching barangay:", err);
    }
  },

  clearBarangays: () => {
    set({ 
      barangays: [],
      selectedBarangay: null,
      error: null 
    });
  },
}));

export default useBrgyStore;