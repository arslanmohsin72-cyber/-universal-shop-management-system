import { authService } from '../services/authService.js';

export const authController = {
  async registerShop(req, res, next) {
    try {
      const result = await authService.registerShopAndAdmin(req.body);
      res.status(201).json({
        success: true,
        message: 'Shop and Admin registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: {
          id: req.user.id,
          role: req.user.role,
          shopId: req.user.shopId
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
