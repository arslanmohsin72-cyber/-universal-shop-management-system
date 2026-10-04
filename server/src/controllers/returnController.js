import { returnService } from '../services/returnService.js';

export const returnController = {
  async processSaleReturn(req, res, next) {
    try {
      const result = await returnService.processSaleReturn(req.user.shopId, req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Sale return processed successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  async processPurchaseReturn(req, res, next) {
    try {
      const result = await returnService.processPurchaseReturn(req.user.shopId, req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Purchase return processed successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  async getReturns(req, res, next) {
    try {
      const result = await returnService.getReturns(req.user.shopId, req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getReturnById(req, res, next) {
    try {
      const result = await returnService.getReturnById(req.params.id, req.user.shopId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
};
