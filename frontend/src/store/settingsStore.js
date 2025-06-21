import { create } from 'zustand';
import { settingsAPI } from '../services/api';

const useSettingsStore = create((set) => ({
  reportTypes: [],
  barangays: [],
  privacyPolicy: [],
  termsOfService: [],
  validIDTypes: [],
  loading: false,
  error: null,

  // Initialize function to load all data from API
  initialize: async () => {
    set({ loading: true });
    try {
      const [barangays, reportTypes, privacy, terms, validIDTypes] = await Promise.all([
        settingsAPI.fetchBarangays(),
        settingsAPI.fetchReportTypes(),
        settingsAPI.fetchPrivacyPolicy(),
        settingsAPI.fetchTermsOfService(),
        settingsAPI.fetchValidIDTypes(),
      ]);
      set({
        barangays: barangays.data.barangays,
        reportTypes: reportTypes.data.reportTypes,
        privacyPolicy: privacy.data.privacyPolicy || [],
        termsOfService: terms.data.termsOfService || [],
        validIDTypes: validIDTypes.data.validIDTypes || [],
        loading: false,
        error: null
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  // Valid ID Types functions
  fetchValidIDTypes: async () => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.fetchValidIDTypes();
      set({ validIDTypes: data.validIDTypes, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchActiveValidIDTypes: async () => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.fetchActiveValidIDTypes();
      set({ validIDTypes: data.validIDTypes, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  createValidIDType: async (validIDType) => {
    set({ loading: true });
    try {
      // Ensure we're handling all fields including description
      const { data } = await settingsAPI.createValidIDType({
        name: validIDType.name,
        description: validIDType.description || '',
        isActive: validIDType.isActive
      });
      set(state => ({
        validIDTypes: [...state.validIDTypes, data.validIDType],
        loading: false
      }));
      return data.validIDType;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  updateValidIDType: async (id, updates) => {
    set({ loading: true });
    try {
      // Ensure we're handling all fields including description
      const { data } = await settingsAPI.updateValidIDType(id, {
        name: updates.name,
        description: updates.description || '',
        isActive: updates.isActive
      });
      set(state => ({
        validIDTypes: state.validIDTypes.map(idType =>
          idType.id === data.validIDType.id ? data.validIDType : idType
        ),
        loading: false
      }));
      return data.validIDType;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  deleteValidIDType: async (id) => {
    set({ loading: true, error: null });
    try {
      // Convert id to number if it's a string
      const idToDelete = typeof id === 'string' ? parseInt(id, 10) : id;
      
      await settingsAPI.deleteValidIDType(idToDelete);
      set(state => ({
        validIDTypes: state.validIDTypes.filter(idType => 
          // Compare as numbers to avoid string/number mismatch
          parseInt(idType.id, 10) !== parseInt(idToDelete, 10)
        ),
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error deleting valid ID type:', error);
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to delete ID type', 
        loading: false 
      });
      throw error;
    }
  },

  toggleValidIDTypeStatus: async (id) => {
    set({ loading: true, error: null });
    try {
      // Convert id to number if it's a string
      const idToToggle = typeof id === 'string' ? parseInt(id, 10) : id;
      
      const { data } = await settingsAPI.toggleValidIDTypeStatus(idToToggle);
      
      set(state => ({
        validIDTypes: state.validIDTypes.map(idType => 
          idType.id === data.validIDType.id ? data.validIDType : idType
        ),
        loading: false,
        error: null
      }));
      
      return data.validIDType;
    } catch (error) {
      console.error('Error toggling valid ID type status:', error);
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to toggle ID type status', 
        loading: false 
      });
      throw error;
    }
  },
  
  createBarangay: async (barangay) => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.createBarangay(barangay);
      set(state => ({
        barangays: [...state.barangays, data.barangay],
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  createReportType: async (newReportType) => {
    set({ loading: true });
    try {
      const { data: { reportType } } = await settingsAPI.createReportType(newReportType);
      set(state => ({
        reportTypes: [...state.reportTypes, reportType],
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Create new section for Privacy Policy
  createPrivacyPolicySection: async (sectionData) => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.createPrivacyPolicySection(sectionData);
      set(state => ({
        privacyPolicy: [...state.privacyPolicy, data.section],
        loading: false
      }));
      return data.section;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Create new section for Terms of Service
  createTermsOfServiceSection: async (sectionData) => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.createTermsOfServiceSection(sectionData);
      set(state => ({
        termsOfService: [...state.termsOfService, data.section],
        loading: false
      }));
      return data.section;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Fetch functions
  fetchReportTypes: async () => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.fetchReportTypes();
      set({ reportTypes: data.reportTypes, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchBarangays: async () => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.fetchBarangays();
      // Ensure each barangay has both id and _id fields for compatibility
      const formattedBarangays = data.barangays.map(brgy => ({
        ...brgy,
        id: brgy.id || brgy._id, // Ensure id exists
        _id: brgy._id || brgy.id, // Ensure _id exists
      }));
      set({ barangays: formattedBarangays, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchPrivacyPolicy: async () => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.fetchPrivacyPolicy();
      set({ 
        privacyPolicy: data.privacyPolicy || [], 
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTermsOfService: async () => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.fetchTermsOfService();
      set({ 
        termsOfService: data.termsOfService || [], 
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Update functions
  updateReportType: async (typeId, updates) => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.updateReportType(typeId, updates);
      set(state => ({
        reportTypes: state.reportTypes.map(type =>
          type.id === data.reportType.id ? data.reportType : type
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateBarangay: async (brgyId, updates) => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.updateBarangay(brgyId, updates);
      set(state => ({
        barangays: state.barangays.map(brgy =>
          brgy.id === data.barangay.id ? data.barangay : brgy
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updatePrivacyPolicySection: async (id, updates) => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.updatePrivacyPolicySection(id, updates);
      set(state => ({
        privacyPolicy: state.privacyPolicy.map(section => 
          section.id === data.section.id ? data.section : section
        ),
        loading: false
      }));
      return data.section;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateTermsOfServiceSection: async (id, updates) => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.updateTermsOfServiceSection(id, updates);
      set(state => ({
        termsOfService: state.termsOfService.map(section => 
          section.id === data.section.id ? data.section : section
        ),
        loading: false
      }));
      return data.section;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deletePrivacyPolicySection: async (id) => {
    set({ loading: true });
    try {
      await settingsAPI.deletePrivacyPolicySection(id);
      
      // Fetch updated data from server instead of filtering locally
      // This ensures we get the correctly reordered sections from the backend
      await useSettingsStore.getState().fetchPrivacyPolicy();
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteTermsOfServiceSection: async (id) => {
    set({ loading: true });
    try {
      await settingsAPI.deleteTermsOfServiceSection(id);
      
      // Fetch updated data from server instead of filtering locally
      // This ensures we get the correctly reordered sections from the backend
      await useSettingsStore.getState().fetchTermsOfService();
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  reorderPrivacyPolicySections: async (sections) => {
    set({ loading: true });
    try {
      await settingsAPI.reorderPrivacyPolicySections({ sections });
      // After reordering, fetch to get the updated order
      await useSettingsStore.getState().fetchPrivacyPolicy();
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  reorderTermsOfServiceSections: async (sections) => {
    set({ loading: true });
    try {
      // Send the array of sections with the correct format required by the backend
      await settingsAPI.reorderTermsOfServiceSections({ sections });
      // Set loading to false after API call completes
      set({ loading: false });
      // After reordering, refresh the data
      await useSettingsStore.getState().fetchTermsOfService();
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteBarangay: async (id) => {
    set({ loading: true });
    try {
      await settingsAPI.deleteBarangay(id);
      set(state => ({
        barangays: state.barangays.filter(b => b.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteReportType: async (id) => {
    set({ loading: true });
    try {
      await settingsAPI.deleteReportType(id);
      set(state => ({
        reportTypes: state.reportTypes.filter(rt => rt.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));

export default useSettingsStore;
