import { create } from "zustand";
import { sampleLogs } from "../data/samples/sampleLogs";

const SIMULATED_DELAY = 1500;

const useLogsStore = create((set, get) => ({
  logs: [],
  filteredLogs: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    action: "all",
    startDate: "",
    endDate: ""
  },

  fetchLogs: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
      // const { data } = await logsAPI.fetchLogs();
      const data = sampleLogs; // Using sample data for now
      
      set({ 
        logs: data,
        filteredLogs: data,
        loading: false 
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch logs",
        loading: false
      });
    }
  },

  updateFilters: (newFilters) => {
    const { logs } = get();
    const filters = { ...get().filters, ...newFilters };
    set({ filters });

    let filtered = [...logs];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm) ||
        log.userName.toLowerCase().includes(searchTerm) ||
        log.details.toLowerCase().includes(searchTerm)
      );
    }

    // Apply action type filter
    if (filters.action !== "all") {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    // Apply date range filter
    if (filters.startDate) {
      filtered = filtered.filter(log => 
        new Date(log.timestamp) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(log => 
        new Date(log.timestamp) <= new Date(filters.endDate)
      );
    }

    set({ filteredLogs: filtered });
  },

  clearFilters: () => {
    set(state => ({
      filters: {
        search: "",
        action: "all",
        startDate: "",
        endDate: ""
      },
      filteredLogs: state.logs
    }));
  }
}));

export default useLogsStore;