import { create } from 'zustand';
import api from '../services/api';
import { sampleReports } from '../data/samples/sampleReports'; // Using sample data for now
import { CURRENT_YEAR } from '../utils/dateUtils';

const useMyReportsStore = create((set, get) => ({
  reports: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    reportType: "all",
    status: "all",
    year: CURRENT_YEAR
  },

  fetchReports: async (filters = null) => {
    set({ loading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // If no filters provided, use current store filters
      const currentFilters = filters || get().filters;

      // Filter reports based on current filters
      let filteredReports = [...sampleReports];

      // Filter by year
      filteredReports = filteredReports.filter(report =>
        new Date(report.submittedDate).getFullYear().toString() === currentFilters.year
      );

      // Apply search filter if present
      if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        filteredReports = filteredReports.filter(report =>
          report.reportName.toLowerCase().includes(searchTerm) ||
          report.barangayName.toLowerCase().includes(searchTerm) ||
          report.fileName.toLowerCase().includes(searchTerm)
        );
      }

      // Apply other filters
      if (currentFilters.reportType !== 'all') {
        filteredReports = filteredReports.filter(report => report.reportType === currentFilters.reportType);
      }
      if (currentFilters.status !== 'all') {
        filteredReports = filteredReports.filter(report => report.status === currentFilters.status);
      }

      // Sort by submission date (newest first)
      filteredReports.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));

      set({ reports: filteredReports, loading: false });
    } catch (err) {
      set({
        error: err.message || "Failed to fetch reports",
        loading: false
      });
    }
  },

  updateFilters: (newFilters) => {
    set(state => {
      const updatedFilters = { ...state.filters, ...newFilters };

      // Only fetch if the changes include non-search filters or if it's a search action
      if (!newFilters.hasOwnProperty('search') || newFilters.search !== undefined) {
        state.fetchReports(updatedFilters);
      }

      return { filters: updatedFilters };
    });
  },

  deleteReport: async (reportId) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      set(state => ({
        reports: state.reports.filter(report => report._id !== reportId),
        loading: false
      }));
    } catch (err) {
      set({ error: err.message || "Failed to delete report", loading: false });
    }
  }
}));

export default useMyReportsStore;