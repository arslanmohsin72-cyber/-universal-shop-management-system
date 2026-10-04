import api from './api';

export const expenseApi = {
  getExpenses: (params) => api.get('/expenses', { params }),
  createExpense: (data) => api.post('/expenses', data),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`)
};
