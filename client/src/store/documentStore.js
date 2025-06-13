import { create } from "zustand";
import { sampleReports } from "../data/samples/sampleReports";

const SIMULATED_DELAY = 1500;

// Helper function to sort documents by date
const sortByDate = (docs) => {
  return [...docs].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
};

const useDocumentStore = create((set, get) => ({
  documents: [],
  filteredDocuments: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    reportType: "all",
    status: "all",
    barangay: "all",
    startDate: "", // Add start date filter
    endDate: ""    // Add end date filter
  },

  fetchDocuments: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
      const sortedDocs = sortByDate(sampleReports);
      set({ 
        documents: sortedDocs,
        filteredDocuments: sortedDocs,
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
    const { documents } = get();
    const filters = { ...get().filters, ...newFilters };
    set({ filters });

    let filtered = [...documents];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.reportName.toLowerCase().includes(searchTerm) ||
        doc.barangayName.toLowerCase().includes(searchTerm) ||
        doc._id.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.reportType !== 'all') {
      filtered = filtered.filter(doc => doc.reportType === filters.reportType);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(doc => doc.status === filters.status);
    }

    if (filters.barangay !== 'all') {
      filtered = filtered.filter(doc => doc.barangayId === filters.barangay);
    }

    // Add date range filtering
    if (filters.startDate) {
      filtered = filtered.filter(doc => 
        new Date(doc.submittedAt) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(doc => 
        new Date(doc.submittedAt) <= new Date(filters.endDate)
      );
    }

    // Sort the filtered results by date
    filtered = sortByDate(filtered);

    set({ filteredDocuments: filtered });
  },

  updateDocumentStatus: async (documentId, newStatus, comments = "") => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
      
      const updatedDocs = get().documents.map(doc => {
        if (doc._id === documentId) {
          return {
            ...doc,
            status: newStatus,
            comments: comments,
            updatedAt: new Date().toISOString()
          };
        }
        return doc;
      });

      set({ 
        documents: updatedDocs,
        loading: false 
      });
      get().updateFilters({});
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to update document status",
        loading: false
      });
    }
  },

  deleteDocument: async (documentId) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
      
      const updatedDocs = get().documents.filter(doc => doc._id !== documentId);
      set({ 
        documents: updatedDocs,
        loading: false 
      });
      get().updateFilters({});
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to delete document",
        loading: false
      });
    }
  }
}));

export default useDocumentStore;