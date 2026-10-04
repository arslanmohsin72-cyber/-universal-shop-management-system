import { dashboardService } from '../services/dashboardService.js';

export const dashboardController = {
  async getSummary(req, res, next) {
    try {
      const summary = await dashboardService.getDashboardSummary(req.user.shopId);
      res.status(200).json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  }
};
