import Inventory from '../models/Inventory.js';

export const inventoryRepository = {
  async createLog(logData) {
    return await Inventory.create(logData);
  },

  async findByShop(shopId, filters = {}) {
    const { product, type, page = 1, limit = 20 } = filters;
    const query = { shop: shopId };
    if (product) query.product = product;
    if (type) query.type = type;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      Inventory.find(query)
        .populate('product', 'name sku unit')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Inventory.countDocuments(query)
    ]);

    return { logs, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 };
  }
};
