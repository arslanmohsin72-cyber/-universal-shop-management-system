import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/userRepository.js';

export const userService = {
  async getUsers(shopId) {
    return await userRepository.findByShop(shopId);
  },

  async createUser(shopId, userData) {
    const existing = await userRepository.findByEmail(userData.email);
    if (existing) {
      const error = new Error('Email already registered');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await userRepository.create({
      ...userData,
      password: hashedPassword,
      shop: shopId
    });
  },

  async updateUser(id, shopId, userData) {
    const user = await userRepository.findById(id);
    if (!user || user.shop._id.toString() !== shopId.toString()) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    } else {
      delete userData.password;
    }

    return await userRepository.update(id, userData);
  },

  async deleteUser(id, shopId) {
    const user = await userRepository.findById(id);
    if (!user || user.shop._id.toString() !== shopId.toString()) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return await userRepository.delete(id);
  }
};
