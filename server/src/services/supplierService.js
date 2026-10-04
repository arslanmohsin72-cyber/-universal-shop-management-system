import { supplierRepository } from '../repositories/supplierRepository.js';

export const supplierService = {
  async getSuppliers(shopId, search, page, limit) {
    return await supplierRepository.findByShop(shopId, search, page, limit);
  },

  async getSupplierById(id, shopId) {
    const supplier = await supplierRepository.findById(id, shopId);
    if (!supplier) {
      const error = new Error('Supplier not found');
      error.statusCode = 404;
      throw error;
    }
    return supplier;
  },

  async createSupplier(shopId, supplierData) {
    const openingBalance = Number(supplierData.openingBalance || 0);
    return await supplierRepository.create({
      ...supplierData,
      openingBalance,
      currentBalance: openingBalance,
      shop: shopId
    });
  },

  async updateSupplier(id, shopId, updateData) {
    const supplier = await supplierRepository.findById(id, shopId);
    if (!supplier) {
      const error = new Error('Supplier not found');
      error.statusCode = 404;
      throw error;
    }
    return await supplierRepository.update(id, shopId, updateData);
  },

  async deleteSupplier(id, shopId) {
    const supplier = await supplierRepository.findById(id, shopId);
    if (!supplier) {
      const error = new Error('Supplier not found');
      error.statusCode = 404;
      throw error;
    }
    return await supplierRepository.delete(id, shopId);
  }
};
