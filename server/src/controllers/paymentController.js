import { paymentService } from '../services/paymentService.js';

export const paymentController = {
  async recordCustomerPayment(req, res, next) {
    try {
      const payment = await paymentService.recordCustomerPayment(req.user.shopId, req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Customer payment recorded successfully',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  },

  async recordSupplierPayment(req, res, next) {
    try {
      const payment = await paymentService.recordSupplierPayment(req.user.shopId, req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Supplier payment recorded successfully',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  },

  async getPayments(req, res, next) {
    try {
      const result = await paymentService.getPayments(req.user.shopId, req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
};
