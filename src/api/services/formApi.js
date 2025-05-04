// /api/services/candidatesApi.js
import axios from '../client/axiosInstance';
export const formApi = {
  getSlots:   (id)      => axios.get(`/form/candidates/${id}/slots`).then(r => r.data),
  create:    (data)    => axios.post('/form/candidates', data).then(r => r.data),
  shedule:    (data)    => axios.post('/form/interviews/schedule', data).then(r => r.data),
  checkValid:    (id)    => axios.get(`/form/check-valid/${id}`).then(r => r.data),
  copy:    ()    => axios.get(`/form/link`).then(r => r.data),
};