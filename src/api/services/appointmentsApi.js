// /api/services/appointmentsApi.js
import axios from '../client/axiosInstance';
export const appointmentsApi = {
  getAll:         ()             => axios.get('/appointments').then(r => r.data),
  create:         (data)         => axios.post('/appointments', data).then(r => r.data),
  updateStatus:   (id, status)   => axios.put(`/appointments/${id}`, { status }).then(r => r.data),
  remove:         (id)           => axios.delete(`/appointments/${id}`).then(r => r.data),
};
