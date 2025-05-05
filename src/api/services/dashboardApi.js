import axiosInstance from '../client/axiosInstance';

export const dashboardApi = {

  getAll: (params = {}) =>
    axiosInstance.get('/dashboard', {
      params,
      withCredentials: true
    }).then(r => r.data),
}