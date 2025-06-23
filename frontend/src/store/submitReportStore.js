import { create } from 'zustand';
import { reportAPI } from '../services/api';
import { toast } from 'react-toastify';

const useSubmitReportStore = create((set, get) => ({
  reportType: '',
  reportName: '',
  comments: '',
  selectedFiles: [],
  uploadedAttachments: [],
  existingAttachments: [], // Added for edit mode
  loading: false,
  submitting: false,
  error: null,
  success: false, // Whether a submission was just successful
  isEditMode: false, // Track if we're editing a report

  setReportType: (reportType) => set({ reportType }),
  
  setReportName: (reportName) => set({ reportName }),
  
  setComments: (comments) => set({ comments }),
  
  setSelectedFiles: (selectedFiles) => set({ selectedFiles }),
  
  setEditMode: (isEditMode) => set({ isEditMode }),
  
  setExistingAttachments: (attachments) => set({ existingAttachments: attachments || [] }),

  // Initialize form with existing report data
  initializeEditForm: (report) => {
    if (!report) return;
    
    set({
      reportType: report.reportType,
      reportName: report.reportName,
      comments: report.comments || '',
      existingAttachments: report.attachments || [],
      selectedFiles: [],
      isEditMode: true,
      error: null
    });
  },

  // Reset success flag specifically - useful when returning to the form
  resetSuccess: () => set({ success: false }),
  
  // Complete reset of the form
  resetForm: () => set({
    reportType: '',
    reportName: '',
    comments: '',
    selectedFiles: [],
    uploadedAttachments: [],
    existingAttachments: [],
    error: null,
    success: false,
    isEditMode: false
  }),

  handleInputChange: (e) => {
    const { name, value } = e.target;
    set(state => ({
      [name]: value
    }));
  },

  // Upload files to Cloudinary and then create report
  submitReport: async () => {
    // Check if already submitting to prevent double submissions
    if (get().submitting) {
      console.log("Submission already in progress");
      return;
    }
    
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
      const uploadResponse = await reportAPI.uploadReportFiles(selectedFiles, reportType);
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
        uploadedAttachments: [],
        existingAttachments: []
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
  },
  
  // New function for updating existing reports
  updateReport: async (reportId) => {
    // Check if already submitting to prevent double submissions
    if (get().submitting) {
      console.log("Update already in progress");
      return;
    }
    
    const { reportName, comments, selectedFiles, existingAttachments } = get();
    
    // Basic validation
    if (!reportName || reportName.trim() === '') {
      toast.error('Please enter a report name');
      return;
    }
    
    set({ submitting: true, error: null });
    
    try {
      let attachments = existingAttachments;
      
      // If new files are selected, upload them
      if (selectedFiles.length > 0) {
        const reportType = get().reportType;
        const uploadResponse = await reportAPI.uploadReportFiles(selectedFiles, reportType);
        
        // Replace existing attachments with new ones
        attachments = uploadResponse.data.files.map(file => ({
          fileName: file.originalname,
          fileSize: file.size,
          url: file.url,
          public_id: file.public_id,
          contentType: file.mimetype
        }));
      }
      
      // Make sure we have at least one attachment
      if (!attachments || attachments.length === 0) {
        toast.error('At least one attachment is required');
        set({ submitting: false });
        return;
      }
      
      const reportData = {
        reportName,
        comments,
        attachments
      };
      
      console.log("Updating report with data:", reportData);
      const updateResponse = await reportAPI.updateReport(reportId, reportData);
      
      // Set success and reset form fields
      set({ 
        submitting: false, 
        success: true,
        // Reset form after successful submission
        reportType: '',
        reportName: '',
        comments: '',
        selectedFiles: [],
        uploadedAttachments: [],
        existingAttachments: [],
        isEditMode: false
      });
      
      return updateResponse.data;
      
    } catch (error) {
      console.error('Error updating report:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update report. Please try again.';
      
      toast.error(errorMsg);
      set({ 
        submitting: false,
        error: errorMsg
      });
    }
  }
}));

export default useSubmitReportStore;