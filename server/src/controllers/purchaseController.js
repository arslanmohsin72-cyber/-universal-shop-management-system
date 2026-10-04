import { purchaseService } from '../services/purchaseService.js';

export const purchaseController = {
  async createPurchase(req, res, next) {
    try {
      const purchase = await purchaseService.createPurchase(req.user.shopId, req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Purchase recorded successfully',
        data: purchase
      });
    } catch (error) {
      next(error);
    }
  },

  async getPurchases(req, res, next) {
    try {
      const result = await purchaseService.getPurchases(req.user.shopId, req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getPurchaseById(req, res, next) {
    try {
      const purchase = await purchaseService.getPurchaseById(req.params.id, req.user.shopId);
      res.status(200).json({ success: true, data: purchase });
    } catch (error) {
      next(error);
    }
  }
};
