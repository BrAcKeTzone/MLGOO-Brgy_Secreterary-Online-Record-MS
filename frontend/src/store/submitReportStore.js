import { create } from 'zustand';
import { reportAPI } from '../services/api';
import { toast } from 'react-toastify';

const useSubmitReportStore = create((set, get) => ({
  reportType: '',
  reportName: '',
  comments: '',
  selectedFiles: [],
  uploadedAttachments: [],
  loading: false,
  submitting: false,
  error: null,
  success: false, // Whether a submission was just successful

  setReportType: (reportType) => set({ reportType }),
  
  setReportName: (reportName) => set({ reportName }),
  
  setComments: (comments) => set({ comments }),
  
  setSelectedFiles: (selectedFiles) => set({ selectedFiles }),

  // Reset success flag specifically - useful when returning to the form
  resetSuccess: () => set({ success: false }),
  
  // Complete reset of the form
  resetForm: () => set({
    reportType: '',
    reportName: '',
    comments: '',
    selectedFiles: [],
    uploadedAttachments: [],
    error: null,
    success: false
  }),

  handleInputChange: (e) => {
    const { name, value } = e.target;
    set(state => ({
      [name]: value
    }));
  },

  // Upload files to Cloudinary and then create report
  submitReport: async () => {
    const { reportType, reportName, comments, selectedFiles } = get();
    
    // Basic validation
    if (!reportType) {
      toast.error('Please select a report type');
      return;
    }
    
    if (!reportName || reportName.trim() === '') {
      toast.error('Please enter a report name');
      return;
    }
    
    if (selectedFiles.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }
    
    set({ submitting: true, error: null });
    
    try {
      console.log("Submitting report with type:", reportType);
      
      // Step 1: Upload files to cloudinary
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      
      const uploadResponse = await reportAPI.uploadReportFiles(selectedFiles);
      console.log("Upload response:", uploadResponse.data);
      
      // Get the uploaded files data from response
      const attachments = uploadResponse.data.files.map(file => ({
        fileName: file.originalname,
        fileSize: file.size,
        url: file.url,
        public_id: file.public_id,
        contentType: file.mimetype
      }));
      
      set({ uploadedAttachments: attachments });
      
      // Step 2: Create report with file references
      // Extract just the report type shortName if an object was selected
      const reportTypeValue = typeof reportType === 'object' && reportType !== null 
        ? reportType.value || reportType.shortName
        : reportType;
      
      const reportData = {
        reportType: reportTypeValue,
        reportName,
        comments,
        attachments
      };
      
      console.log("Creating report with data:", reportData);
      const createResponse = await reportAPI.createReport(reportData);
      
      // Set success and reset form fields, but don't show toast here
      // We'll let the component handle feedback
      set({ 
        submitting: false, 
        success: true,
        // Reset form after successful submission
        reportType: '',
        reportName: '',
        comments: '',
        selectedFiles: [],
        uploadedAttachments: []
      });
      
      return createResponse.data;
      
    } catch (error) {
      console.error('Error submitting report:', error);
      const errorMsg = error.response?.data?.message || 'Failed to submit report. Please try again.';
      
      // Show more detailed error if available
      if (error.response?.data?.debug) {
        console.error('Debug info:', error.response.data.debug);
      }
      
      toast.error(errorMsg);
      set({ 
        submitting: false,
        error: errorMsg
      });
    }
  }
}));

export default useSubmitReportStore;