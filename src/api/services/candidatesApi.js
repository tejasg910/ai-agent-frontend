// /api/services/candidatesApi.js
import axios from '../client/axiosInstance';
export const candidatesApi = {
  getAll:    ()        => axios.get('/candidates').then(r => r.data),
  getById:   (id)      => axios.get(`/candidates/${id}`).then(r => r.data),
  create:    (data)    => axios.post('/candidates', data).then(r => r.data),
  update:    (id, data)=> axios.put(`/candidates/${id}`, data).then(r => r.data),
};
