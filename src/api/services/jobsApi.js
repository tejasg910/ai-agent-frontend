// /api/services/jobsApi.js
import axios from '../client/axiosInstance';
export const jobsApi = {
  getAll: (params = {}) => axios.get('/jobs', { params, withCredentials: true }).then(r => r.data),
  getAllCandidates: (params = {}, id) => axios.get(`/jobs/candidates/${id}`, { params, withCredentials: true }).then(r => r.data),
  getAllRecruiter: (params = {}, id) => axios.get(`/jobs/recruiter`, { params, withCredentials: true }).then(r => r.data),
  getById: (id) => axios.get(`/jobs/${id}`).then(r => r.data),
  create: (data) => axios.post('/jobs', data).then(r => r.data),
  update: (id, data) => axios.put(`/jobs/${id}`, data).then(r => r.data),
  remove: (id) => axios.delete(`/jobs/${id}`).then(r => r.data),
};
