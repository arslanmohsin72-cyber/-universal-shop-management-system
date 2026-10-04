import { productRepository } from '../repositories/productRepository.js';
import { categoryRepository } from '../repositories/categoryRepository.js';

export const productService = {
  async getProducts(shopId, filters) {
    return await productRepository.findByShop(shopId, filters);
  },

  async getProductById(id, shopId) {
    const product = await productRepository.findById(id, shopId);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product;
  },

  async getProductByBarcodeOrSku(query, shopId) {
    const product = await productRepository.findByBarcodeOrSku(query, shopId);
    if (!product) {
      const error = new Error('Product not found with given barcode or SKU');
      error.statusCode = 404;
      throw error;
    }
    return product;
  },

  async createProduct(shopId, productData) {
    const existingSku = await productRepository.findBySku(productData.sku, shopId);
    if (existingSku) {
      const error = new Error('SKU already exists in this shop');
      error.statusCode = 400;
      throw error;
    }

    const category = await categoryRepository.findById(productData.category, shopId);
    if (!category) {
      const error = new Error('Selected category is invalid or does not exist');
      error.statusCode = 400;
      throw error;
    }

    return await productRepository.create({
      ...productData,
      shop: shopId
    });
  },

  async updateProduct(id, shopId, updateData) {
    const product = await productRepository.findById(id, shopId);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    if (updateData.sku && updateData.sku !== product.sku) {
      const existingSku = await productRepository.findBySku(updateData.sku, shopId);
      if (existingSku) {
        const error = new Error('SKU already exists in another product');
        error.statusCode = 400;
        throw error;
      }
    }

    return await productRepository.update(id, shopId, updateData);
  },

  async deleteProduct(id, shopId) {
    const product = await productRepository.findById(id, shopId);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return await productRepository.delete(id, shopId);
  }
};
