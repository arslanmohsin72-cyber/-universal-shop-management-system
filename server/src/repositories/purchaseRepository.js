import Purchase from '../models/Purchase.js';

export const purchaseRepository = {
  async create(purchaseData) {
    return await Purchase.create(purchaseData);
  },

  async findByShop(shopId, filters = {}) {
    const { startDate, endDate, supplier, search, page = 1, limit = 20 } = filters;
    const query = { shop: shopId };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (supplier) query.supplier = supplier;
    if (search) {
      query.$or = [
        { purchaseNumber: { $regex: search, $options: 'i' } },
        { supplierName: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [purchases, total] = await Promise.all([
      Purchase.find(query)
        .populate('supplier', 'name company phone')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Purchase.countDocuments(query)
    ]);

    return { purchases, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 };
  },

  async findById(id, shopId) {
    return await Purchase.findOne({ _id: id, shop: shopId })
      .populate('supplier', 'name company phone email address')
      .populate('createdBy', 'name')
      .populate('items.product', 'name sku unit');
  },

  async findByPurchaseNumber(purchaseNumber, shopId) {
    return await Purchase.findOne({ purchaseNumber, shop: shopId }).populate('supplier', 'name company');
  },

  async updateStatus(id, shopId, status) {
    return await Purchase.findOneAndUpdate({ _id: id, shop: shopId }, { status }, { new: true });
  },

  async getPurchaseReport(shopId, startDate, endDate) {
    const match = { shop: shopId };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const result = await Purchase.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: '$total' },
          totalCount: { $sum: 1 },
          totalPaid: { $sum: '$paidAmount' },
          totalDue: { $sum: '$dueAmount' }
        }
      }
    ]);

    return result[0] || { totalPurchases: 0, totalCount: 0, totalPaid: 0, totalDue: 0 };
  }
};
