import Expense from '../models/Expense.js';

export const expenseRepository = {
  async create(expenseData) {
    return await Expense.create(expenseData);
  },

  async findByShop(shopId, filters = {}) {
    const { category, startDate, endDate, search, page = 1, limit = 20 } = filters;
    const query = { shop: shopId };

    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [expenses, total] = await Promise.all([
      Expense.find(query)
        .populate('createdBy', 'name')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limitNum),
      Expense.countDocuments(query)
    ]);

    return { expenses, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 };
  },

  async findById(id, shopId) {
    return await Expense.findOne({ _id: id, shop: shopId }).populate('createdBy', 'name');
  },

  async update(id, shopId, updateData) {
    return await Expense.findOneAndUpdate({ _id: id, shop: shopId }, updateData, { new: true });
  },

  async delete(id, shopId) {
    return await Expense.findOneAndDelete({ _id: id, shop: shopId });
  },

  async getTotalExpenses(shopId, startDate, endDate) {
    const match = { shop: shopId };
    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }

    const result = await Expense.aggregate([
      { $match: match },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);

    return result[0]?.totalAmount || 0;
  }
};
