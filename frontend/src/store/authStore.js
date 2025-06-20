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

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.login(email, password);
      
      // Remove success check since backend doesn't return a success flag
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
      // const { data } = await authAPI.checkEmail(email);
      set({ 
        loading: false,
        error: null
      });
      return {
        success: true,
        // email: data.email,
        // message: data.message
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
      // const { data } = await authAPI.verifyEmailOtp(email, otp);
      set({ 
        loading: false,
        error: null
      });
      return {
        success: true,
        // verified: data.verified,
        // message: data.message
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
      // const { data } = await authAPI.signup(formData);
      set({ 
        loading: false,
        successMessage: 'Account created successfully! Please wait for admin approval.' 
      });
      // return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Signup failed",
        loading: false,
      });
      throw err;
    }
  },

  requestPasswordReset: async (email) => {
    set({ loading: true, error: null });
    try {
      // const { data } = await authAPI.requestPasswordReset(email);
      set({ 
        loading: false,
        error: null
      });
      return {
        success: true,
        // email: data.email,
        // message: data.message || "Reset code sent successfully"
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
      // const { data } = await authAPI.verifyPasswordResetOtp(email, otp);
      set({ 
        loading: false,
        error: null
      });
      return {
        success: true,
        // verified: data.verified,
        // message: data.message || "OTP verified successfully"
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
      // const { data } = await authAPI.resetPassword(email, newPassword);
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
