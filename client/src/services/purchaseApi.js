import api from './api';

export const purchaseApi = {
  getPurchases: (params) => api.get('/purchases', { params }),
  getPurchaseById: (id) => api.get(`/purchases/${id}`),
  createPurchase: (data) => api.post('/purchases', data)
};
