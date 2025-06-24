import { create } from "zustand";
import { logsAPI } from "../services/api";

const useLogsStore = create((set, get) => ({
  logs: [],
  filteredLogs: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    pages: 0
  },
  actionTypes: [], // Store available action types from API
  filters: {
    search: "",
    action: "all",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 20
  },

  fetchLogs: async () => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      const filters = get().filters;
      
      // Add all filters to query params
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.action && filters.action !== 'all') queryParams.append('action', filters.action);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      queryParams.append('page', filters.page);
      queryParams.append('limit', filters.limit);
      
      const { data } = await logsAPI.fetchLogs(queryParams);
      
      set({ 
        logs: data.logs,
        filteredLogs: data.logs,
        actionTypes: data.actionTypes || [],
        pagination: data.pagination,
        loading: false 
      });
    } catch (err) {
      console.error("Error fetching logs:", err);
      set({
        error: err.response?.data?.message || "Failed to fetch logs",
        loading: false
      });
    }
  },

  updateFilters: (newFilters) => {
    const filters = { ...get().filters, ...newFilters };
    
    // If we're changing filters (not page), reset to page 1
    if (newFilters.search !== undefined || 
        newFilters.action !== undefined || 
        newFilters.startDate !== undefined || 
        newFilters.endDate !== undefined) {
      filters.page = 1;
    }
    
    set({ filters });
    get().fetchLogs(); // Fetch logs with new filters
  },

  clearFilters: () => {
    const clearedFilters = {
      search: "",
      action: "all",
      startDate: "",
      endDate: "",
      page: 1,
      limit: 20
    };
    
    set({ filters: clearedFilters });
    get().fetchLogs(); // Fetch logs with cleared filters
  },

  nextPage: () => {
    const { pagination, filters } = get();
    if (filters.page < pagination.pages) {
      get().updateFilters({ page: filters.page + 1 });
    }
  },

  prevPage: () => {
    const { filters } = get();
    if (filters.page > 1) {
      get().updateFilters({ page: filters.page - 1 });
    }
  },
  
  removeLogsByDateRange: async (startDate, endDate) => {
    set({ loading: true, error: null });
    try {
      await logsAPI.removeLogs({ startDate, endDate });
      // After removal, refresh logs
      await get().fetchLogs();
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to remove logs",
        loading: false
      });
      return false;
    }
  }
}));

export default useLogsStore;