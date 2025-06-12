import { create } from "zustand";
import { authAPI } from "../services/api";
import { sampleUser, sampleUserCredentials } from "../data/sampleUser";
import { sampleAdmin, sampleAdminCredentials } from "../data/sampleAdmin";


const apiURL = import.meta.env.VITE_API_URL_DEV;

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      console.log("LOGIN: Email:", email, "Password:", password)
      // const { data } = await authAPI.login(email, password);
      // set({ user: data.user, token: data.token, loading: false });
      // localStorage.setItem('token', data.token);
      
      // Mock authentication logic
      let mockUser = null;
      if (email === sampleUserCredentials.email && password === sampleUserCredentials.password) {
        mockUser = sampleUser;
      } else if (email === sampleAdminCredentials.email && password === sampleAdminCredentials.password) {
        mockUser = sampleAdmin;
      }

      if (!mockUser) {
        throw new Error("Invalid credentials");
      }

      const mockData = {
        user: mockUser,
        token: `mock-jwt-token-${mockUser._id}`
      };

      set({ 
        user: mockData.user, 
        token: mockData.token, 
        loading: false 
      });
      localStorage.setItem('token', mockData.token);
    } catch (err) {
      set({
        error: err.response?.data?.message || "Login failed",
        loading: false,
      });
    }
  },

  requestOTP: async (email) => {
    set({ loading: true, error: null });
    try {
      console.log("REQUEST OTP: Email:", email);
      // const { data } = await authAPI.requestOTP(email);
      set({ loading: false });
      // return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to send OTP",
        loading: false,
      });
      throw err;
    }
  },

  verifyOTP: async (email, otp, purpose) => {
    set({ loading: true, error: null });
    try {
      console.log("API URL:", apiURL);
      console.log("VERIFY OTP: Email:", email, "OTP:", otp, "Purpose:", purpose);
      // const { data } = await authAPI.verifyOTP(email, otp);
      set({ loading: false });
      // return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Invalid OTP",
        loading: false,
      });
      throw err;
    }
  },

  signup: async (data) => {
    set({ loading: true, error: null });
    try {
      console.log("API URL:", apiURL);
      console.log("SIGNUP: Data:", data);
      // const response = await authAPI.signup(data);
      set({ 
        user: response.data.user, 
        token: response.data.token, 
        loading: false 
      });
      localStorage.setItem('token', response.data.token);
    } catch (err) {
      set({
        error: err.response?.data?.message || "Signup failed",
        loading: false,
      });
    }
  },

  resetPassword: async (email, newPassword) => {
    set({ loading: true, error: null });
    try {
      console.log("API URL:", apiURL);
      console.log("RESET PASSWORD: Email:", email);
      // const { data } = await authAPI.resetPassword(email, newPassword);
      set({ loading: false });
      return true; // Return success status
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
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
