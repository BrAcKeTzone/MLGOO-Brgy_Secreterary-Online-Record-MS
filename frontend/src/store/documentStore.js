import { create } from 'zustand';
import { reportAPI } from '../services/api';
import { toast } from 'react-toastify';
import { CURRENT_YEAR } from '../utils/dateUtils';

const useDocumentStore = create((set, get) => ({
  documents: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    reportType: "all",
    status: "all",
    barangay: "all",
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
  
  // Modal state
  selectedDocument: null,
  viewModalOpen: false,
  rejectModalOpen: false,
  documentToReject: null,

  fetchDocuments: async (filters = null) => {
    set({ loading: true, error: null });
    try {
      // If no filters provided, use current store filters
      const currentFilters = filters || get().filters;
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      if (currentFilters.search) queryParams.append('search', currentFilters.search);
      if (currentFilters.reportType) queryParams.append('reportType', currentFilters.reportType);
      if (currentFilters.status) queryParams.append('status', currentFilters.status);
      if (currentFilters.barangay) queryParams.append('barangay', currentFilters.barangay);
      if (currentFilters.year) queryParams.append('year', currentFilters.year);
      if (currentFilters.page) queryParams.append('page', currentFilters.page);
      if (currentFilters.limit) queryParams.append('limit', currentFilters.limit);
      
      const queryString = queryParams.toString();
      
      // Call the API with filters
      const response = await reportAPI.getAllReports(queryString);
      
      set({ 
        documents: response.data.reports, 
        pagination: response.data.pagination,
        loading: false 
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch documents",
        loading: false
      });
    }
  },

  updateFilters: (newFilters) => {
    set(state => {
      const updatedFilters = { ...state.filters, ...newFilters };
      
      // Reset to first page when filters change (except when explicitly changing pages)
      if (!newFilters.hasOwnProperty('page') && (
        newFilters.search !== undefined || 
        newFilters.reportType !== undefined || 
        newFilters.status !== undefined || 
        newFilters.barangay !== undefined || 
        newFilters.year !== undefined
      )) {
        updatedFilters.page = 1;
      }
      
      // Fetch documents with updated filters
      state.fetchDocuments(updatedFilters);
      
      return { filters: updatedFilters };
    });
  },

  approveDocument: async (documentId) => {
    set({ loading: true, error: null });
    try {
      await reportAPI.updateReportStatus(documentId, { 
        status: 'APPROVED' 
      });
      
      toast.success('Document approved successfully');
      
      // Refresh the documents list
      await get().fetchDocuments();
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Failed to approve document", 
        loading: false 
      });
      toast.error(err.response?.data?.message || "Failed to approve document");
    }
  },

  // Updated reject document with reason
  rejectDocument: async (documentId, rejectReason) => {
    set({ loading: true, error: null });
    try {
      await reportAPI.updateReportStatus(documentId, { 
        status: 'REJECTED',
        rejectReason: rejectReason
      });
      
      toast.success('Document rejected successfully');
      
      // Close reject modal
      set({ rejectModalOpen: false, documentToReject: null });
      
      // Refresh the documents list
      await get().fetchDocuments();
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Failed to reject document", 
        loading: false 
      });
      toast.error(err.response?.data?.message || "Failed to reject document");
    }
  },

  deleteDocument: async (documentId) => {
    set({ loading: true, error: null });
    try {
      await reportAPI.deleteReport(documentId);
      
      toast.success('Document deleted successfully');
      
      // Refresh the documents list
      await get().fetchDocuments();
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Failed to delete document", 
        loading: false 
      });
      toast.error(err.response?.data?.message || "Failed to delete document");
    }
  },

  // Modal management
  fetchDocumentDetails: async (docId) => {
    set({ loading: true, error: null });
    try {
      const response = await reportAPI.getReportById(docId);
      
      // Format the document data and ensure rejection reason is properly included
      const formattedDocument = {
        ...response.data.report,
        // Make sure rejectReason is included in the document details
        rejectReason: response.data.report.rejectReason || null,
      };
      
      set({ 
        selectedDocument: formattedDocument,
        loading: false 
      });
      return formattedDocument;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch document details", 
        loading: false
      });
      toast.error(err.response?.data?.message || "Failed to fetch document details");
      return null;
    }
  },

  openViewModal: async (docId) => {
    // Fetch detailed document info and open modal
    const documentDetails = await get().fetchDocumentDetails(docId);
    if (documentDetails) {
      set({ viewModalOpen: true });
    }
  },

  closeViewModal: () => {
    set({ 
      selectedDocument: null,
      viewModalOpen: false 
    });
  },

  // New methods for reject modal
  openRejectModal: async (docId) => {
    // Fetch document details if not already selected
    let documentToReject = get().selectedDocument;
    
    if (!documentToReject || documentToReject.id !== docId) {
      documentToReject = await get().fetchDocumentDetails(docId);
    }
    
    if (documentToReject) {
      set({ 
        documentToReject,
        rejectModalOpen: true 
      });
    }
  },

  closeRejectModal: () => {
    set({ 
      documentToReject: null,
      rejectModalOpen: false 
    });
  }
}));

export default useDocumentStore;