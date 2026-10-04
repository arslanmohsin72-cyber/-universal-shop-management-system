import api from './api';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  registerShop: (data) => api.post('/auth/register-shop', data),
  getMe: () => api.get('/auth/me')
};
