import { create } from 'zustand';
import { CURRENT_YEAR } from '../utils/dateUtils';
import { sampleReports } from '../data/samples/sampleReports';

const useDocumentStore = create((set, get) => ({
  documents: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    reportType: "all",
    status: "all",
    barangay: "all",
    year: CURRENT_YEAR
  },

  fetchDocuments: async (filters = null) => {
    set({ loading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // If no filters provided, use current store filters
      const currentFilters = filters || get().filters;
      
      // Filter documents based on current filters
      let filteredDocs = [...sampleReports];
      
      // Filter by year
      filteredDocs = filteredDocs.filter(doc => 
        new Date(doc.submittedDate).getFullYear().toString() === currentFilters.year
      );

      // Apply search filter if present
      if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        filteredDocs = filteredDocs.filter(doc => 
          doc.reportName.toLowerCase().includes(searchTerm) ||
          doc.barangayName.toLowerCase().includes(searchTerm) ||
          doc.fileName.toLowerCase().includes(searchTerm)
        );
      }

      // Apply other filters
      if (currentFilters.reportType !== 'all') {
        filteredDocs = filteredDocs.filter(doc => doc.reportType === currentFilters.reportType);
      }
      if (currentFilters.status !== 'all') {
        filteredDocs = filteredDocs.filter(doc => doc.status === currentFilters.status);
      }
      if (currentFilters.barangay !== 'all') {
        filteredDocs = filteredDocs.filter(doc => doc.barangayId === currentFilters.barangay);
      }

      // Sort by submission date (newest first)
      filteredDocs.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));

      set({ documents: filteredDocs, loading: false });
    } catch (err) {
      set({
        error: err.message || "Failed to fetch documents",
        loading: false
      });
    }
  },

  updateFilters: (newFilters) => {
    set(state => {
      const updatedFilters = { ...state.filters, ...newFilters };
      
      // Only fetch if the changes include non-search filters or if it's a search action
      if (!newFilters.hasOwnProperty('search') || newFilters.search !== undefined) {
        state.fetchDocuments(updatedFilters);
      }
      
      return { filters: updatedFilters };
    });
  },

  approveDocument: async (documentId) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      set(state => ({
        documents: state.documents.map(doc =>
          doc._id === documentId ? { ...doc, status: "Approved", updatedAt: new Date().toISOString() } : doc
        ),
        loading: false
      }));
    } catch (err) {
      set({ error: err.message || "Failed to approve document", loading: false });
    }
  },

  rejectDocument: async (documentId) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      set(state => ({
        documents: state.documents.map(doc =>
          doc._id === documentId ? { ...doc, status: "Rejected", updatedAt: new Date().toISOString() } : doc
        ),
        loading: false
      }));
    } catch (err) {
      set({ error: err.message || "Failed to reject document", loading: false });
    }
  },

  deleteDocument: async (documentId) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      set(state => ({
        documents: state.documents.filter(doc => doc._id !== documentId),
        loading: false
      }));
    } catch (err) {
      set({ error: err.message || "Failed to delete document", loading: false });
    }
  }
}));

export default useDocumentStore;