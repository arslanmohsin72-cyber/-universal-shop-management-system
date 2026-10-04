import Shop from '../models/Shop.js';

export const shopRepository = {
  async findById(id) {
    return await Shop.findById(id).populate('owner', 'name email');
  },

  async create(shopData) {
    return await Shop.create(shopData);
  },

  async update(id, updateData) {
    return await Shop.findByIdAndUpdate(id, updateData, { new: true });
  },

  async findAll() {
    return await Shop.find().sort({ createdAt: -1 });
  }
};
