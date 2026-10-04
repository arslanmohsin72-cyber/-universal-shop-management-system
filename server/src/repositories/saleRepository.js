import Sale from '../models/Sale.js';

export const saleRepository = {
  async create(saleData) {
    return await Sale.create(saleData);
  },

  async findByShop(shopId, filters = {}) {
    const { startDate, endDate, customer, cashier, paymentMethod, search, page = 1, limit = 20 } = filters;
    const query = { shop: shopId };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (customer) query.customer = customer;
    if (cashier) query.cashier = cashier;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [sales, total] = await Promise.all([
      Sale.find(query)
        .populate('customer', 'name phone')
        .populate('cashier', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Sale.countDocuments(query)
    ]);

    return { sales, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 };
  },

  async findById(id, shopId) {
    return await Sale.findOne({ _id: id, shop: shopId })
      .populate('customer', 'name phone email address')
      .populate('cashier', 'name')
      .populate('items.product', 'name sku unit');
  },

  async findByInvoiceNumber(invoiceNumber, shopId) {
    return await Sale.findOne({ invoiceNumber, shop: shopId })
      .populate('customer', 'name phone')
      .populate('cashier', 'name');
  },

  async updateStatus(id, shopId, status) {
    return await Sale.findOneAndUpdate({ _id: id, shop: shopId }, { status }, { new: true });
  },

  async getSalesReport(shopId, startDate, endDate) {
    const match = { shop: shopId };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const result = await Sale.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$total' },
          totalCount: { $sum: 1 },
          totalDiscount: { $sum: '$discount' },
          totalTax: { $sum: '$tax' },
          totalProfit: { $sum: '$profit' },
          totalPaid: { $sum: '$paidAmount' },
          totalDue: { $sum: '$dueAmount' }
        }
      }
    ]);

    return result[0] || {
      totalSales: 0,
      totalCount: 0,
      totalDiscount: 0,
      totalTax: 0,
      totalProfit: 0,
      totalPaid: 0,
      totalDue: 0
    };
  },

  async getDailySalesTrend(shopId, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await Sale.aggregate([
      { $match: { shop: shopId, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalAmount: { $sum: '$total' },
          totalProfit: { $sum: '$profit' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }
};
