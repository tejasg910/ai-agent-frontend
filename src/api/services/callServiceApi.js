// /api/services/appointmentsApi.js
import axios from '../client/axiosInstance';
export const callServiceApi = {
    call: () => axios.post('/voice/call', {}, { withCredentials: true }).then(r => r.data),

};
