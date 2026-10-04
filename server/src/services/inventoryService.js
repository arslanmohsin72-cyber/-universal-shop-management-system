import { productRepository } from '../repositories/productRepository.js';
import { inventoryRepository } from '../repositories/inventoryRepository.js';

export const inventoryService = {
  async adjustStock(shopId, userId, { productId, quantity, type, reason }) {
    const product = await productRepository.findById(productId, shopId);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    const previousStock = product.stockQuantity;
    let newStock = previousStock;

    if (type === 'Stock In') {
      newStock = previousStock + Number(quantity);
    } else if (type === 'Stock Out') {
      newStock = previousStock - Number(quantity);
      if (newStock < 0) {
        const error = new Error('Stock cannot be less than 0');
        error.statusCode = 400;
        throw error;
      }
    } else if (type === 'Adjustment') {
      newStock = Number(quantity);
    }

    await productRepository.updateStock(productId, shopId, newStock);

    const log = await inventoryRepository.createLog({
      product: productId,
      shop: shopId,
      type: type || 'Adjustment',
      quantity: Number(quantity),
      previousStock,
      newStock,
      reason: reason || 'Manual adjustment',
      createdBy: userId
    });

    return { product: await productRepository.findById(productId, shopId), log };
  },

  async getInventoryLogs(shopId, filters) {
    return await inventoryRepository.findByShop(shopId, filters);
  }
};
