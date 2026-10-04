import { productService } from '../services/productService.js';

export const productController = {
  async getProducts(req, res, next) {
    try {
      const result = await productService.getProducts(req.user.shopId, req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getProductById(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id, req.user.shopId);
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  async searchBarcodeOrSku(req, res, next) {
    try {
      const { code } = req.query;
      const product = await productService.getProductByBarcodeOrSku(code, req.user.shopId);
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  async createProduct(req, res, next) {
    try {
      const product = await productService.createProduct(req.user.shopId, req.body);
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProduct(req, res, next) {
    try {
      const product = await productService.updateProduct(req.params.id, req.user.shopId, req.body);
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id, req.user.shopId);
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
