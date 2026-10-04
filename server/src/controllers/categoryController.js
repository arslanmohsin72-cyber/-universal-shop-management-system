import { categoryService } from '../services/categoryService.js';

export const categoryController = {
  async getCategories(req, res, next) {
    try {
      const { search } = req.query;
      const categories = await categoryService.getCategories(req.user.shopId, search);
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  },

  async createCategory(req, res, next) {
    try {
      const category = await categoryService.createCategory(req.user.shopId, req.body);
      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  },

  async updateCategory(req, res, next) {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.user.shopId, req.body);
      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteCategory(req, res, next) {
    try {
      await categoryService.deleteCategory(req.params.id, req.user.shopId);
      res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
