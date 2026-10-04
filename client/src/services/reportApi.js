import api from './api';

export const reportApi = {
  getSalesReport: (params) => api.get('/reports/sales', { params }),
  getPurchaseReport: (params) => api.get('/reports/purchases', { params }),
  getInventoryReport: () => api.get('/reports/inventory'),
  getProfitLossReport: (params) => api.get('/reports/profit-loss', { params })
};
