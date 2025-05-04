// /api/services/candidatesApi.js
import axios from '../client/axiosInstance';

export const candidatesApi = {
  getAll: (params = {}) => 
    axios.get('/candidates', {
      params,
      withCredentials: true
    }).then(r => r.data),
    
  getById: (id) => 
    axios.get(`/candidates/${id}`, {
      withCredentials: true
    }).then(r => r.data),
    
  create: (data) => 
    axios.post('/candidates', data, {
      withCredentials: true
    }).then(r => r.data),
    
  update: (id, data) => 
    axios.put(`/candidates/${id}`, data, {
      withCredentials: true
    }).then(r => r.data),
};