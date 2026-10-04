import { supplierService } from '../services/supplierService.js';

export const supplierController = {
  async getSuppliers(req, res, next) {
    try {
      const { search, page, limit } = req.query;
      const result = await supplierService.getSuppliers(req.user.shopId, search, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getSupplierById(req, res, next) {
    try {
      const supplier = await supplierService.getSupplierById(req.params.id, req.user.shopId);
      res.status(200).json({ success: true, data: supplier });
    } catch (error) {
      next(error);
    }
  },

  async createSupplier(req, res, next) {
    try {
      const supplier = await supplierService.createSupplier(req.user.shopId, req.body);
      res.status(201).json({
        success: true,
        message: 'Supplier added successfully',
        data: supplier
      });
    } catch (error) {
      next(error);
    }
  },

  async updateSupplier(req, res, next) {
    try {
      const supplier = await supplierService.updateSupplier(req.params.id, req.user.shopId, req.body);
      res.status(200).json({
        success: true,
        message: 'Supplier updated successfully',
        data: supplier
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteSupplier(req, res, next) {
    try {
      await supplierService.deleteSupplier(req.params.id, req.user.shopId);
      res.status(200).json({
        success: true,
        message: 'Supplier deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
