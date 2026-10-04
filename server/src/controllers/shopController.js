import { shopService } from '../services/shopService.js';

export const shopController = {
  async getShop(req, res, next) {
    try {
      const shop = await shopService.getShopDetails(req.user.shopId);
      res.status(200).json({ success: true, data: shop });
    } catch (error) {
      next(error);
    }
  },

  async updateShop(req, res, next) {
    try {
      const shop = await shopService.updateShopSettings(req.user.shopId, req.body);
      res.status(200).json({
        success: true,
        message: 'Shop settings updated successfully',
        data: shop
      });
    } catch (error) {
      next(error);
    }
  }
};
