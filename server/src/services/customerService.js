import { customerRepository } from '../repositories/customerRepository.js';

export const customerService = {
  async getCustomers(shopId, search, page, limit) {
    return await customerRepository.findByShop(shopId, search, page, limit);
  },

  async getCustomerById(id, shopId) {
    const customer = await customerRepository.findById(id, shopId);
    if (!customer) {
      const error = new Error('Customer not found');
      error.statusCode = 404;
      throw error;
    }
    return customer;
  },

  async createCustomer(shopId, customerData) {
    const openingBalance = Number(customerData.openingBalance || 0);
    return await customerRepository.create({
      ...customerData,
      openingBalance,
      currentBalance: openingBalance,
      shop: shopId
    });
  },

  async updateCustomer(id, shopId, updateData) {
    const customer = await customerRepository.findById(id, shopId);
    if (!customer) {
      const error = new Error('Customer not found');
      error.statusCode = 404;
      throw error;
    }
    return await customerRepository.update(id, shopId, updateData);
  },

  async deleteCustomer(id, shopId) {
    const customer = await customerRepository.findById(id, shopId);
    if (!customer) {
      const error = new Error('Customer not found');
      error.statusCode = 404;
      throw error;
    }
    return await customerRepository.delete(id, shopId);
  }
};
