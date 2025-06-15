import { create } from 'zustand';

const useSubmitReportStore = create((set, get) => ({
  reportType: '',
  formData: {},
  selectedFiles: [],
  loading: false,
  error: null,

  setReportType: (reportType) => set({ reportType }),
  setFormData: (formData) => set({ formData }),
  setSelectedFiles: (selectedFiles) => set({ selectedFiles }),

  handleInputChange: (e) => {
    set(state => ({
      formData: { ...state.formData, [e.target.name]: e.target.value }
    }));
  },

  submitReport: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // const formData = new FormData();
      // formData.append('reportType', get().reportType);
      // // Append other form data
      // Object.keys(get().formData).forEach(key => {
      //   formData.append(key, get().formData[key]);
      // });
      // // Append files
      // get().selectedFiles.forEach(file => {
      //   formData.append('files', file);
      // });

      // const response = await api.post('/reports', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });

      // console.log('Report submitted successfully:', response.data);
      set({ loading: false });
    } catch (error) {
      console.error('Error submitting report:', error);
      set({ loading: false, error: error.message || 'Failed to submit report' });
    }
  },

  saveDraft: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ loading: false });
    } catch (error) {
      console.error('Error saving draft:', error);
      set({ loading: false, error: error.message || 'Failed to save draft' });
    }
  },
}));

export default useSubmitReportStore;