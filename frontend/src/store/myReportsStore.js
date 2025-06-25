import { create } from 'zustand';
import { reportAPI } from '../services/api';
import { toast } from 'react-toastify';
import { CURRENT_YEAR } from '../utils/dateUtils';
import useAuthStore from './authStore';

const useMyReportsStore = create((set, get) => ({
  reports: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    reportType: "all",
    status: "all",
    year: CURRENT_YEAR,
    page: 1,
    limit: 10
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  },
  selectedReport: null,
  viewModalOpen: false,
  editModalOpen: false, // Add this state for edit modal

  fetchReports: async (newFilters = null) => {
    set({ loading: true, error: null });
    try {
      // Use provided filters or current state filters
      const currentFilters = newFilters || get().filters;
      
      // Build query params
      const queryParams = new URLSearchParams();
      
      if (currentFilters.search) queryParams.append('search', currentFilters.search);
      if (currentFilters.reportType && currentFilters.reportType !== 'all') queryParams.append('reportType', currentFilters.reportType);
      if (currentFilters.status && currentFilters.status !== 'all') queryParams.append('status', currentFilters.status);
      if (currentFilters.year && currentFilters.year !== 'all') queryParams.append('year', currentFilters.year);
      if (currentFilters.page) queryParams.append('page', currentFilters.page);
      if (currentFilters.limit) queryParams.append('limit', currentFilters.limit);
      
      const queryString = queryParams.toString();
      
      // Fetch reports using the appropriate API endpoint
      let response;
      try {
        // First try to get the user info to determine if we need to filter by barangay
        const userResponse = await reportAPI.getCurrentUser();
        const userData = userResponse.data.user || userResponse.data;
        
        // If user has barangayId, fetch reports for that specific barangay
        if (userData && userData.barangayId) {
          response = await reportAPI.getReportsByBarangay(userData.barangayId, queryString);
        } else {
          // If no barangayId is found, use a fallback method to get the user's reports
          response = await reportAPI.getMyReports(queryString);
        }
      } catch (userError) {
        // If getting user info fails, fall back to fetching user's reports directly
        console.warn("Could not determine user's barangay ID, fetching reports directly:", userError);
        response = await reportAPI.getMyReports(queryString);
      }
      
      set({
        reports: response.data.reports,
        pagination: response.data.pagination,
        loading: false,
        filters: currentFilters      
      });
    } catch (err) {
      console.error("Error fetching reports:", err);
      set({
        error: err.response?.data?.message || "Failed to fetch reports",
        loading: false
      });
    }
  },

  updateFilters: (newFilters) => {
    set(state => {
      const updatedFilters = { ...state.filters, ...newFilters };
      
      // Reset page to 1 when any filter changes except page
      if (!newFilters.hasOwnProperty('page') && (
        newFilters.search !== undefined ||
        newFilters.reportType !== undefined ||
        newFilters.status !== undefined || 
        newFilters.year !== undefined
      )) {
        updatedFilters.page = 1;
      }
      
      // Fetch reports with new filters
      state.fetchReports(updatedFilters);
      
      return { filters: updatedFilters };
    });
  },

  setPage: (page) => {
    set(state => {
      const updatedFilters = { ...state.filters, page };
      state.fetchReports(updatedFilters);
      return { filters: updatedFilters };
    });
  },

  deleteReport: async (reportId) => {
    set({ loading: true, error: null });
    try {
      await reportAPI.deleteReport(reportId);
      toast.success('Report deleted successfully');
      
      // Refresh reports list
      await get().fetchReports();
      set({ loading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Failed to delete report", 
        loading: false 
      });
      
      // Show error based on status code
      if (err.response?.status === 403) {
        toast.error("You can only delete pending reports. Contact MLGOO staff for others.");
      } else {
        toast.error(err.response?.data?.message || "Failed to delete report");
      }
    }
  },

  getReportDetails: async (reportId) => {
    set({ loading: true, error: null });
    try {
      const response = await reportAPI.getReportById(reportId);
      
      // Ensure that rejectReason is properly included in the report object
      const reportData = {
        ...response.data.report,
        rejectReason: response.data.report.rejectReason || null,
      };
      
      set({ 
        selectedReport: reportData,
        loading: false 
      });
      return reportData;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch report details",
        loading: false
      });
      toast.error(err.response?.data?.message || "Failed to fetch report details");
      return null;
    }
  },

  openViewModal: async (reportId) => {
    try {
      // Start loading
      set({ loading: true });
      
      // Fetch report details 
      const reportDetails = await get().getReportDetails(reportId);
      
      // If successful, open the modal
      if (reportDetails) {
        set({ 
          selectedReport: reportDetails,
          viewModalOpen: true,
          loading: false 
        });
      } else {
        // If we couldn't get details, ensure loading is set to false
        set({ loading: false });
      }
    } catch (error) {
      console.error("Error fetching report details:", error);
      set({ loading: false });
      toast.error("Failed to load report details");
    }
  },

  closeViewModal: () => {
    set({ 
      selectedReport: null,
      viewModalOpen: false 
    });
  },

  // New functions for edit modal
  openEditModal: async (reportId) => {
    try {
      // Start loading
      set({ loading: true });
      
      // Fetch report details 
      const reportDetails = await get().getReportDetails(reportId);
      
      // If successful, open the edit modal
      if (reportDetails) {
        set({ 
          selectedReport: reportDetails,
          editModalOpen: true,
          loading: false 
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error("Error fetching report details for editing:", error);
      set({ loading: false });
      toast.error("Failed to load report details for editing");
    }
  },

  closeEditModal: () => {
    set({ 
      selectedReport: null,
      editModalOpen: false 
    });
  },
  
  updateReport: async (reportId, reportData) => {
    set({ loading: true, error: null });
    try {
      console.log("Updating report with data:", reportData);
      const response = await reportAPI.updateReport(reportId, reportData);
      
      // Update the local state with the updated report
      set(state => {
        // Find and update the report in the reports array
        const updatedReports = state.reports.map(report => 
          report.id === reportId ? response.data.report : report
        );
        
        return {
          reports: updatedReports,
          loading: false,
          selectedReport: response.data.report // Update the selected report with new data
        };
      });
      
      return response.data.report;
    } catch (err) {
      console.error("Error updating report:", err);
      set({ 
        error: err.response?.data?.message || "Failed to update report", 
        loading: false 
      });
      
      throw err; // Re-throw to allow handling in the component
    }
  }
}));

export default useMyReportsStore;