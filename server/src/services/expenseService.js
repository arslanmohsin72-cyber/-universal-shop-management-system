import { expenseRepository } from '../repositories/expenseRepository.js';

export const expenseService = {
  async getExpenses(shopId, filters) {
    return await expenseRepository.findByShop(shopId, filters);
  },

  async createExpense(shopId, userId, expenseData) {
    const amount = Number(expenseData.amount);
    if (isNaN(amount) || amount <= 0) {
      const error = new Error('Valid expense amount is required');
      error.statusCode = 400;
      throw error;
    }

    return await expenseRepository.create({
      ...expenseData,
      amount,
      shop: shopId,
      createdBy: userId
    });
  },

  async updateExpense(id, shopId, updateData) {
    const expense = await expenseRepository.findById(id, shopId);
    if (!expense) {
      const error = new Error('Expense not found');
      error.statusCode = 404;
      throw error;
    }

    if (updateData.amount) {
      updateData.amount = Number(updateData.amount);
    }

    return await expenseRepository.update(id, shopId, updateData);
  },

  async deleteExpense(id, shopId) {
    const expense = await expenseRepository.findById(id, shopId);
    if (!expense) {
      const error = new Error('Expense not found');
      error.statusCode = 404;
      throw error;
    }

    return await expenseRepository.delete(id, shopId);
  }
};
