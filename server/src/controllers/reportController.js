import { reportService } from '../services/reportService.js';

export const reportController = {
  async getSalesReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const report = await reportService.getSalesReport(req.user.shopId, startDate, endDate);
      res.status(200).json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  },

  async getPurchaseReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const report = await reportService.getPurchaseReport(req.user.shopId, startDate, endDate);
      res.status(200).json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  },

  async getInventoryReport(req, res, next) {
    try {
      const report = await reportService.getInventoryReport(req.user.shopId);
      res.status(200).json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  },

  async getProfitLossReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const report = await reportService.getProfitLossReport(req.user.shopId, startDate, endDate);
      res.status(200).json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }
};
