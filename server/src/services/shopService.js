import { shopRepository } from '../repositories/shopRepository.js';

export const shopService = {
  async getShopDetails(shopId) {
    const shop = await shopRepository.findById(shopId);
    if (!shop) {
      const error = new Error('Shop not found');
      error.statusCode = 404;
      throw error;
    }
    return shop;
  },

  async updateShopSettings(shopId, updateData) {
    const shop = await shopRepository.update(shopId, updateData);
    if (!shop) {
      const error = new Error('Shop not found');
      error.statusCode = 404;
      throw error;
    }
    return shop;
  }
};
