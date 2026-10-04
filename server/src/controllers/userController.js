import { userService } from '../services/userService.js';

export const userController = {
  async getUsers(req, res, next) {
    try {
      const users = await userService.getUsers(req.user.shopId);
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  },

  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.user.shopId, req.body);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.user.shopId, req.body);
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id, req.user.shopId);
      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
