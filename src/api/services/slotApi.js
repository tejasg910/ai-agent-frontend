// /api/services/slotApi.js
import axios from '../client/axiosInstance';

export const slotApi = {
  // Get available slots within a date range
  getAvailableSlots: (startDate, endDate) => {
    return axios.get('/slots', {
      withCredentials: true,
      params: { start_date: startDate, end_date: endDate }
    }).then(r => r.data);
  },

  // Get available slots for a specific date
  getSlotsForDate: (date) => {
    return axios.get(`/slots/date/${date}`, { withCredentials: true }).then(r => r.data);
  },

  // Get slots by interviewer
  getSlotsByInterviewer: (interviewerId, startDate, endDate) => {
    return axios.get(`/slots/interviewer/${interviewerId}`, {
      withCredentials: true,
      params: { start_date: startDate, end_date: endDate }
    }).then(r => r.data);
  },

  // Create a single slot
  createSlot: (slotData) => {
    return axios.post('/slots', slotData, { withCredentials: true }).then(r => r.data);
  },

  // Generate multiple slots
  generateSlots: (data) => {
    return axios.post('/slots/generate', data, { withCredentials: true }).then(r => r.data);
  },

  // Release a slot (make it available again)
  releaseSlot: (slotId) => {
    return axios.patch(`/slots/${slotId}/release`).then(r => r.data);
  }
};