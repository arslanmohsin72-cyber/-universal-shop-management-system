import User from '../models/User.js';

export const userRepository = {
  async findByEmail(email) {
    return await User.findOne({ email }).populate('shop');
  },

  async findById(id) {
    return await User.findById(id).populate('shop').select('-password');
  },

  async findByShop(shopId) {
    return await User.find({ shop: shopId }).select('-password').sort({ createdAt: -1 });
  },

  async create(userData) {
    return await User.create(userData);
  },

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  },

  async delete(id) {
    return await User.findByIdAndDelete(id);
  },

  async countByShop(shopId) {
    return await User.countDocuments({ shop: shopId });
  }
};
