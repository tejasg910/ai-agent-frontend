// /api/services/appointmentsApi.js
import axios from '../client/axiosInstance';
export const authApi = {
    login: (data) => axios.post('/auth/login', data).then(r => r.data),
    signup: (data) => axios.post('/auth/signup', data).then(r => r.data),
    logout: (data) => axios.post('/auth/logout', data).then(r => r.data),

};
