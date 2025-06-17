import { create } from 'zustand';
import { sampleBarangays } from '../data/samples/sampleBarangays';
import { optionsReportTypes } from '../data/options/optionsReportTypes';
import { privacyPolicyOptions } from '../data/options/optionsPrivacyPolicy';
import { termsOfServiceOptions } from '../data/options/optionsTermsOfService';

const useSettingsStore = create((set) => ({
  reportTypes: [],
  barangays: [],
  privacyPolicy: {},
  termsOfService: {},
  loading: false,
  error: null,

  // Initialize function to load all dummy data
  initialize: async () => {
    set({ loading: true });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({
        barangays: sampleBarangays,
        reportTypes: optionsReportTypes,
        privacyPolicy: privacyPolicyOptions,
        termsOfService: termsOfServiceOptions,
        loading: false,
        error: null
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Fetch functions with dummy data
  fetchReportTypes: async () => {
    set({ loading: true });
    try {
      set({ reportTypes: optionsReportTypes, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchBarangays: async () => {
    set({ loading: true });
    try {
      set({ barangays: sampleBarangays, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchPrivacyPolicy: async () => {
    set({ loading: true });
    try {
      set({ privacyPolicy: privacyPolicyOptions, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTermsOfService: async () => {
    set({ loading: true });
    try {
      set({ termsOfService: termsOfServiceOptions, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Update functions

  updateReportType: async (typeId, updates) => {
    set({ loading: true });
    try {
      set(state => ({
        reportTypes: state.reportTypes.map(type => 
          type._id === typeId ? { ...type, ...updates } : type
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
      set(state => ({
        barangays: state.barangays.map(brgy => 
          brgy._id === brgyId ? { ...brgy, ...updates } : brgy
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
      set({ privacyPolicy: updates, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateTermsOfService: async (updates) => {
    set({ loading: true });
    try {
      set({ termsOfService: updates, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));

export default useSettingsStore;