import { customerService } from '../services/customerService.js';

export const customerController = {
  async getCustomers(req, res, next) {
    try {
      const { search, page, limit } = req.query;
      const result = await customerService.getCustomers(req.user.shopId, search, page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getCustomerById(req, res, next) {
    try {
      const customer = await customerService.getCustomerById(req.params.id, req.user.shopId);
      res.status(200).json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  },

  async createCustomer(req, res, next) {
    try {
      const customer = await customerService.createCustomer(req.user.shopId, req.body);
      res.status(201).json({
        success: true,
        message: 'Customer added successfully',
        data: customer
      });
    } catch (error) {
      next(error);
    }
  },

  async updateCustomer(req, res, next) {
    try {
      const customer = await customerService.updateCustomer(req.params.id, req.user.shopId, req.body);
      res.status(200).json({
        success: true,
        message: 'Customer updated successfully',
        data: customer
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteCustomer(req, res, next) {
    try {
      await customerService.deleteCustomer(req.params.id, req.user.shopId);
      res.status(200).json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
