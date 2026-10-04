import Supplier from '../models/Supplier.js';

export const supplierRepository = {
  async findByShop(shopId, search = '', page = 1, limit = 20) {
    const query = { shop: shopId };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [suppliers, total] = await Promise.all([
      Supplier.find(query).sort({ name: 1 }).skip(skip).limit(limitNum),
      Supplier.countDocuments(query)
    ]);

    return { suppliers, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 };
  },

  async findById(id, shopId) {
    return await Supplier.findOne({ _id: id, shop: shopId });
  },

  async create(supplierData) {
    return await Supplier.create(supplierData);
  },

  async update(id, shopId, updateData) {
    return await Supplier.findOneAndUpdate({ _id: id, shop: shopId }, updateData, { new: true });
  },

  async updateBalance(id, shopId, amountChange) {
    return await Supplier.findOneAndUpdate(
      { _id: id, shop: shopId },
      { $inc: { currentBalance: amountChange } },
      { new: true }
    );
  },

  async delete(id, shopId) {
    return await Supplier.findOneAndDelete({ _id: id, shop: shopId });
  },

  async getTotalPayables(shopId) {
    const result = await Supplier.aggregate([
      { $match: { shop: shopId, currentBalance: { $gt: 0 } } },
      { $group: { _id: null, totalPayable: { $sum: '$currentBalance' } } }
    ]);
    return result[0]?.totalPayable || 0;
  }
};
