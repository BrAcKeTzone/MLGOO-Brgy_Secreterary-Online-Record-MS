import { create } from "zustand";
import { authAPI } from "../services/api";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'), // Initialize token from localStorage
  loading: true,
  error: null,
  initialized: false,

  initializeAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        set({ loading: false, initialized: true });
        return;
      }

      // Make sure token is included in the request
      const { data } = await authAPI.getCurrentUser(token);
      
      set({ 
        user: data.user, 
        token,
        loading: false,
        initialized: true,
        error: null
      });
    } catch (err) {
      console.error('Auth initialization error:', err);
      localStorage.removeItem('token');
      set({ 
        user: null, 
        token: null, 
        loading: false,
        initialized: true,
        error: null
      });
    }
  },

  login: async (loginData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.login(loginData);
      
      set({ 
        user: data.user, 
        token: data.token, 
        loading: false,
        error: null,
        initialized: true
      });
      
      localStorage.setItem('token', data.token);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid credentials";
      set({
        user: null,
        token: null,
        error: errorMessage,
        loading: false,
        initialized: true
      });
      throw new Error(errorMessage);
    }
  },

  requestOTP: async (email) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.checkEmail(email);
      set({ 
        loading: false,
        error: null
      });
      return {
        success: true,
        email: data.email,
        message: data.message
      };
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to send OTP",
        loading: false,
      });
      throw err;
    }
  },

  verifyOTP: async (email, otp) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.verifyEmailOtp(email, otp);
      set({ 
        loading: false,
        error: null
      });
      return {
        success: true,
        verified: data.verified,
        message: data.message
      };
    } catch (err) {
      set({
        error: err.response?.data?.message || "Invalid OTP",
        loading: false,
      });
      throw err;
    }
  },

  signup: async (formData) => {
    set({ loading: true, error: null });
    try {
      console.log("Starting signup process with form data", { ...formData, password: "[REDACTED]" });
      
      // Handle file uploads for ID images first
      const uploadPromises = [];
      let nationalIdFront = null;
      let nationalIdBack = null;
      let uploadErrors = [];

      // Upload front ID image if provided
      if (formData.nationalIdFront) {
        console.log("Uploading front ID image...");
        const frontUploadPromise = authAPI.uploadImage(formData.nationalIdFront)
          .then(response => {
            console.log("Front ID upload successful", response.data);
            nationalIdFront = {
              url: response.data.url,
              public_id: response.data.public_id
            };
          })
          .catch(error => {
            console.error("Front ID upload failed:", error);
            uploadErrors.push("Failed to upload front ID image. Please try with a smaller image or check your internet connection.");
            // Don't throw here, let's continue to try uploading the back image
          });
        uploadPromises.push(frontUploadPromise);
      } else {
        console.error("Front ID image is required but not provided");
        set({ 
          error: "Front ID image is required", 
          loading: false 
        });
        throw new Error("Front ID image is required");
      }

      // Upload back ID image if provided
      if (formData.nationalIdBack) {
        console.log("Uploading back ID image...");
        const backUploadPromise = authAPI.uploadImage(formData.nationalIdBack)
          .then(response => {
            console.log("Back ID upload successful", response.data);
            nationalIdBack = {
              url: response.data.url,
              public_id: response.data.public_id
            };
          })
          .catch(error => {
            console.error("Back ID upload failed:", error);
            uploadErrors.push("Failed to upload back ID image. Please try with a smaller image or check your internet connection.");
            // Don't throw here
          });
        uploadPromises.push(backUploadPromise);
      } else {
        console.error("Back ID image is required but not provided");
        set({ 
          error: "Back ID image is required", 
          loading: false 
        });
        throw new Error("Back ID image is required");
      }

      // Wait for all uploads to complete
      console.log("Waiting for all image uploads to complete...");
      await Promise.allSettled(uploadPromises); // Use Promise.allSettled instead of Promise.all
    
      // Check for upload errors
      if (uploadErrors.length > 0 || !nationalIdFront || !nationalIdBack) {
        const errorMessage = uploadErrors.join(" ");
        set({ 
          loading: false,
          error: errorMessage || "Failed to upload ID images. Please try again with smaller images."
        });
        throw new Error(errorMessage || "Failed to upload ID images");
      }
      
      console.log("All image uploads completed successfully");
      
      // Create the signup data object with proper formatting
      const signupData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        role: formData.role,
        // Only include assignedBrgy if role is BARANGAY_SECRETARY and it has a value
        ...(formData.role === 'BARANGAY_SECRETARY' && formData.assignedBrgy 
          ? { assignedBrgy: parseInt(formData.assignedBrgy, 10) } 
          : {}
        ),
        // Include validIDTypeId as an integer
        validIDTypeId: parseInt(formData.validIDTypeId, 10),
        // Include the uploaded image information
        nationalIdFront,
        nationalIdBack
      };
      
      console.log("Sending signup data:", { ...signupData, password: "[REDACTED]" });
      const { data } = await authAPI.signup(signupData);
      
      console.log("Signup successful:", data);
      set({ 
        loading: false,
        successMessage: 'Account created successfully! Please wait for admin approval.' 
      });
      return data;
    } catch (err) {
      console.error("Signup error:", err);
      set({
        error: err.response?.data?.message || err.message || "Signup failed. Please try again or use smaller ID images.",
        loading: false,
      });
      throw err;
    } 
  },

  requestPasswordReset: async (email) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.requestPasswordReset(email);
      set({ 
        loading: false,
        error: null
      });
      return {
        success: true,
        email: data.email,
        message: data.message || "Reset code sent successfully"
      };
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to send reset code",
        loading: false,
      });
      throw err;
    }
  },

  verifyPasswordResetOtp: async (email, otp) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.verifyPasswordResetOtp(email, otp);
      set({ 
        loading: false,
        error: null
      });
      return {
        success: true,
        verified: data.verified,
        message: data.message || "OTP verified successfully"
      };
    } catch (err) {
      set({
        error: err.response?.data?.message || "Invalid verification code",
        loading: false,
      });
      throw err;
    }
  },

  resetPassword: async (email, newPassword) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.resetPassword(email, newPassword);
      set({ 
        loading: false,
        error: null
      });
      return {
        success: true,
        message: data.message || "Password reset successfully"
      };
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to reset password",
        loading: false,
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ 
      user: null, 
      token: null,
      loading: false,
      error: null 
    });
  }
}));

export default useAuthStore;
