// /api/services/jobsApi.js
import axios from '../client/axiosInstance';
export const skillsApi = {
  getAll:    ()        => axios.get('/skills').then(r => r.data),

};
