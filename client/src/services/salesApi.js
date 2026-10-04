import api from './api';

export const salesApi = {
  getSales: (params) => api.get('/sales', { params }),
  getSaleById: (id) => api.get(`/sales/${id}`),
  getSaleByInvoice: (invoiceNumber) => api.get(`/sales/invoice/${invoiceNumber}`),
  processSale: (data) => api.post('/sales', data)
};
