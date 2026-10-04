import api from './api';

export const inventoryApi = {
  adjustStock: (data) => api.post('/inventory/adjust', data),
  getLogs: (params) => api.get('/inventory/logs', { params })
};
