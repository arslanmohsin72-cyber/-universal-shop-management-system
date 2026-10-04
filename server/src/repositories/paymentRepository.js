import Payment from '../models/Payment.js';

export const paymentRepository = {
  async create(paymentData) {
    return await Payment.create(paymentData);
  },

  async findByShop(shopId, filters = {}) {
    const { type, customer, supplier, startDate, endDate, page = 1, limit = 20 } = filters;
    const query = { shop: shopId };

    if (type) query.type = type;
    if (customer) query.customer = customer;
    if (supplier) query.supplier = supplier;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate('customer', 'name phone')
        .populate('supplier', 'name company')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Payment.countDocuments(query)
    ]);

    return { payments, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 };
  },

  async findById(id, shopId) {
    return await Payment.findOne({ _id: id, shop: shopId })
      .populate('customer', 'name phone')
      .populate('supplier', 'name company')
      .populate('createdBy', 'name');
  }
};
