import Category from '../models/Category.js';

export const categoryRepository = {
  async findByShop(shopId, search = '') {
    const query = { shop: shopId };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    return await Category.find(query).sort({ name: 1 });
  },

  async findById(id, shopId) {
    return await Category.findOne({ _id: id, shop: shopId });
  },

  async findByName(name, shopId) {
    return await Category.findOne({ name: { $regex: `^${name}$`, $options: 'i' }, shop: shopId });
  },

  async create(categoryData) {
    return await Category.create(categoryData);
  },

  async update(id, shopId, updateData) {
    return await Category.findOneAndUpdate({ _id: id, shop: shopId }, updateData, { new: true });
  },

  async delete(id, shopId) {
    return await Category.findOneAndDelete({ _id: id, shop: shopId });
  },

  async countByShop(shopId) {
    return await Category.countDocuments({ shop: shopId });
  }
};
