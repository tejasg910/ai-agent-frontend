// /api/services/jobsApi.js
import axios from '../client/axiosInstance';
export const jobsApi = {
  getAll:    ()        => axios.get('/jobs').then(r => r.data),
  getById:   (id)      => axios.get(`/jobs/${id}`).then(r => r.data),
  create:    (data)    => axios.post('/jobs',    data).then(r => r.data),
  update:    (id, data)=> axios.put(`/jobs/${id}`,data).then(r => r.data),
  remove:    (id)      => axios.delete(`/jobs/${id}`).then(r => r.data),
};
