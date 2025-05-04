import axiosInstance from '../client/axiosInstance';

export const dashboardApi = {

  getAll: (params = {}) =>
    axiosInstance.get('/dashobard', {
      params,
      withCredentials: true
    }).then(r => r.data),
}