import { categoryRepository } from '../repositories/categoryRepository.js';

export const categoryService = {
  async getCategories(shopId, search = '') {
    return await categoryRepository.findByShop(shopId, search);
  },

  async createCategory(shopId, categoryData) {
    const existing = await categoryRepository.findByName(categoryData.name, shopId);
    if (existing) {
      const error = new Error('Category name already exists in this shop');
      error.statusCode = 400;
      throw error;
    }

    return await categoryRepository.create({
      ...categoryData,
      shop: shopId
    });
  },

  async updateCategory(id, shopId, updateData) {
    const category = await categoryRepository.findById(id, shopId);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }

    return await categoryRepository.update(id, shopId, updateData);
  },

  async deleteCategory(id, shopId) {
    const category = await categoryRepository.findById(id, shopId);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }

    return await categoryRepository.delete(id, shopId);
  }
};
