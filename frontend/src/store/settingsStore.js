/*************  ✨ Windsurf Command 🌟  *************/
import { create } from 'zustand';
import { settingsAPI } from '../services/api';

const useSettingsStore = create((set) => ({
  reportTypes: [],
  barangays: [],
  privacyPolicy: {},
  termsOfService: {},
  loading: false,
  error: null,

  // Initialize function to load all data from API
  initialize: async () => {
    set({ loading: true });
    try {
      const [barangays, reportTypes, privacy, terms] = await Promise.all([
        settingsAPI.fetchBarangays(),
        settingsAPI.fetchReportTypes(),
        settingsAPI.fetchPrivacyPolicy(),
        settingsAPI.fetchTermsOfService(),
      ]);
      set({
        barangays: barangays.data.barangays,
        reportTypes: reportTypes.data.reportTypes,
        privacyPolicy: Object.fromEntries(privacy.data.privacyPolicy.map(p => [p.section, p.content])),
        termsOfService: Object.fromEntries(terms.data.termsOfService.map(t => [t.section, t.content])),
        loading: false,
        error: null
      });
    } catch (error) {
      set({ error: error.message, loading: false });
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
      set({ barangays: data.barangays, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchPrivacyPolicy: async () => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.fetchPrivacyPolicy();
      set({ privacyPolicy: Object.fromEntries(data.privacyPolicy.map(p => [p.section, p.content])), loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTermsOfService: async () => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.fetchTermsOfService();
      set({ termsOfService: Object.fromEntries(data.termsOfService.map(t => [t.section, t.content])), loading: false });
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

  updatePrivacyPolicy: async (updates) => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.updatePrivacyPolicy(updates);
      set({ privacyPolicy: Object.fromEntries(data.privacyPolicy.map(p => [p.section, p.content])), loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateTermsOfService: async (updates) => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.updateTermsOfService(updates);
      set({ termsOfService: Object.fromEntries(data.termsOfService.map(t => [t.section, t.content])), loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
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
/*******  b98886ab-36cf-4a0d-9cba-eba0af998511  *******/