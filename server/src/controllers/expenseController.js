import { expenseService } from '../services/expenseService.js';

export const expenseController = {
  async getExpenses(req, res, next) {
    try {
      const result = await expenseService.getExpenses(req.user.shopId, req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async createExpense(req, res, next) {
    try {
      const expense = await expenseService.createExpense(req.user.shopId, req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Expense added successfully',
        data: expense
      });
    } catch (error) {
      next(error);
    }
  },

  async updateExpense(req, res, next) {
    try {
      const expense = await expenseService.updateExpense(req.params.id, req.user.shopId, req.body);
      res.status(200).json({
        success: true,
        message: 'Expense updated successfully',
        data: expense
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteExpense(req, res, next) {
    try {
      await expenseService.deleteExpense(req.params.id, req.user.shopId);
      res.status(200).json({
        success: true,
        message: 'Expense deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
