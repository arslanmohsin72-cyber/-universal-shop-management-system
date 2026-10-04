import api from './api';

export const paymentApi = {
  getPayments: (params) => api.get('/payments', { params }),
  recordCustomerPayment: (data) => api.post('/payments/customer', data),
  recordSupplierPayment: (data) => api.post('/payments/supplier', data)
};
