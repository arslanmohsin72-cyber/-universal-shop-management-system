import api from './api';

export const shopApi = {
  getSettings: () => api.get('/shops/settings'),
  updateSettings: (data) => api.put('/shops/settings', data)
};
