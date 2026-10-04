import Customer from '../models/Customer.js';

export const customerRepository = {
  async findByShop(shopId, search = '', page = 1, limit = 20) {
    const query = { shop: shopId };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [customers, total] = await Promise.all([
      Customer.find(query).sort({ name: 1 }).skip(skip).limit(limitNum),
      Customer.countDocuments(query)
    ]);

    return { customers, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 };
  },

  async findById(id, shopId) {
    return await Customer.findOne({ _id: id, shop: shopId });
  },

  async create(customerData) {
    return await Customer.create(customerData);
  },

  async update(id, shopId, updateData) {
    return await Customer.findOneAndUpdate({ _id: id, shop: shopId }, updateData, { new: true });
  },

  async updateBalance(id, shopId, amountChange) {
    return await Customer.findOneAndUpdate(
      { _id: id, shop: shopId },
      { $inc: { currentBalance: amountChange } },
      { new: true }
    );
  },

  async delete(id, shopId) {
    return await Customer.findOneAndDelete({ _id: id, shop: shopId });
  },

  async getTotalCreditDue(shopId) {
    const result = await Customer.aggregate([
      { $match: { shop: shopId, currentBalance: { $gt: 0 } } },
      { $group: { _id: null, totalCredit: { $sum: '$currentBalance' } } }
    ]);
    return result[0]?.totalCredit || 0;
  }
};
