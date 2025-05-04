// /api/services/appointmentsApi.js
import axios from 'axios';
import axiosInstance from '../client/axiosInstance';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const appointmentsApi = {
  getAll: async (params = {}) => {
    try {
      const response = await axiosInstance.get(`/appointments`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error);
      throw error;
    }
  },

  getByCandidateId: async (id, currentPage, itemsPerPage) => {
    try {
        const response = await axiosInstance.get(`/appointments/candidate/${id}`, {
            params: { page: currentPage, limit: itemsPerPage }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching appointment ${id}:`, error);
        throw error;
    }
},

  update: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/appointments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating appointment ${id}:`, error);
      throw error;
    }
  },

  cancel: async (id) => {
    try {
      const response = await axiosInstance.patch(`/appointments/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error canceling appointment ${id}:`, error);
      throw error;
    }
  },

  addNotes: async (id, notes) => {
    try {
      const response = await axiosInstance.patch(`/appointments/${id}/notes`, { notes });
      return response.data;
    } catch (error) {
      console.error(`Error adding notes to appointment ${id}:`, error);
      throw error;
    }
  }
};