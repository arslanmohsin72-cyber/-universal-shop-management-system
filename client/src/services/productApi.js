import api from './api';

export const productApi = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  searchByCode: (code) => api.get('/products/search-code', { params: { code } }),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`)
};
