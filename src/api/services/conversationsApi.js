// /api/services/conversationsApi.js
import axios from '../client/axiosInstance';
export const conversationsApi = {
  getByCandidateId: (cid)    => axios.get(`/conversations/${cid}`).then(r => r.data),
  create:           (data)   => axios.post('/conversations', data).then(r => r.data),
};
