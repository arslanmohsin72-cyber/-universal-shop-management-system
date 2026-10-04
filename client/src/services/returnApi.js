import api from './api';

export const returnApi = {
  getReturns: (params) => api.get('/returns', { params }),
  getReturnById: (id) => api.get(`/returns/${id}`),
  processSaleReturn: (data) => api.post('/returns/sale', data),
  processPurchaseReturn: (data) => api.post('/returns/purchase', data)
};
