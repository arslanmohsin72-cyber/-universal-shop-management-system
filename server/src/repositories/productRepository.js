import Product from '../models/Product.js';

export const productRepository = {
  async findByShop(shopId, filters = {}) {
    const { search, category, lowStock, page = 1, limit = 20, sort = 'name' } = filters;
    const query = { shop: shopId };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (lowStock === 'true' || lowStock === true) {
      query.$expr = { $lte: ['$stockQuantity', '$minimumStock'] };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name')
        .populate('supplier', 'name company')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query)
    ]);

    return {
      products,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1
    };
  },

  async findById(id, shopId) {
    return await Product.findOne({ _id: id, shop: shopId })
      .populate('category', 'name')
      .populate('supplier', 'name company');
  },

  async findBySku(sku, shopId) {
    return await Product.findOne({ sku, shop: shopId });
  },

  async findByBarcodeOrSku(query, shopId) {
    return await Product.findOne({
      shop: shopId,
      $or: [{ barcode: query }, { sku: query }, { name: { $regex: query, $options: 'i' } }]
    }).populate('category', 'name');
  },

  async create(productData) {
    return await Product.create(productData);
  },

  async update(id, shopId, updateData) {
    return await Product.findOneAndUpdate({ _id: id, shop: shopId }, updateData, { new: true })
      .populate('category', 'name')
      .populate('supplier', 'name company');
  },

  async updateStock(id, shopId, newQuantity) {
    return await Product.findOneAndUpdate({ _id: id, shop: shopId }, { stockQuantity: newQuantity }, { new: true });
  },

  async incrementStock(id, shopId, qty) {
    return await Product.findOneAndUpdate(
      { _id: id, shop: shopId },
      { $inc: { stockQuantity: qty } },
      { new: true }
    );
  },

  async delete(id, shopId) {
    return await Product.findOneAndDelete({ _id: id, shop: shopId });
  },

  async countLowStock(shopId) {
    return await Product.countDocuments({
      shop: shopId,
      $expr: { $lte: ['$stockQuantity', '$minimumStock'] }
    });
  },

  async countTotal(shopId) {
    return await Product.countDocuments({ shop: shopId });
  },

  async getInventoryValue(shopId) {
    const result = await Product.aggregate([
      { $match: { shop: shopId } },
      {
        $group: {
          _id: null,
          totalPurchaseValue: { $sum: { $multiply: ['$stockQuantity', '$purchasePrice'] } },
          totalSellingValue: { $sum: { $multiply: ['$stockQuantity', '$sellingPrice'] } }
        }
      }
    ]);
    return result[0] || { totalPurchaseValue: 0, totalSellingValue: 0 };
  }
};
