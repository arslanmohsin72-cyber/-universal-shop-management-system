import { inventoryService } from '../services/inventoryService.js';

export const inventoryController = {
  async adjustStock(req, res, next) {
    try {
      const result = await inventoryService.adjustStock(req.user.shopId, req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Stock updated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  async getLogs(req, res, next) {
    try {
      const result = await inventoryService.getInventoryLogs(req.user.shopId, req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
};
