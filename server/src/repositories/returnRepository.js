import Return from '../models/Return.js';

export const returnRepository = {
  async create(returnData) {
    return await Return.create(returnData);
  },

  async findByShop(shopId, filters = {}) {
    const { type, startDate, endDate, page = 1, limit = 20 } = filters;
    const query = { shop: shopId };

    if (type) query.type = type;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [returns, total] = await Promise.all([
      Return.find(query)
        .populate('customer', 'name phone')
        .populate('supplier', 'name company')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Return.countDocuments(query)
    ]);

    return { returns, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 };
  },

  async findById(id, shopId) {
    return await Return.findOne({ _id: id, shop: shopId })
      .populate('customer', 'name phone')
      .populate('supplier', 'name company')
      .populate('createdBy', 'name')
      .populate('items.product', 'name sku unit');
  }
};
