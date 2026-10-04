import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository.js';
import { shopRepository } from '../repositories/shopRepository.js';

export const authService = {
  async registerShopAndAdmin(data) {
    const { shopName, shopType, city, country, currency, ownerName, email, password, phone } = data;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('User email already exists');
      error.statusCode = 400;
      throw error;
    }

    const shop = await shopRepository.create({
      shopName: shopName || 'Mobile Zone Lahore',
      shopType: shopType || 'Mobile Shop',
      city: city || 'Lahore',
      country: country || 'Pakistan',
      currency: currency || 'PKR',
      phone: phone || ''
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      name: ownerName,
      email,
      password: hashedPassword,
      role: 'Admin',
      shop: shop._id,
      phone: phone || ''
    });

    await shopRepository.update(shop._id, { owner: user._id });

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopId: shop._id,
        shopName: shop.shopName,
        shopType: shop.shopType,
        currency: shop.currency
      }
    };
  },

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user || user.status !== 'Active') {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopId: user.shop._id,
        shopName: user.shop.shopName,
        shopType: user.shop.shopType,
        currency: user.shop.currency
      }
    };
  },

  generateToken(user) {
    const secret = process.env.JWT_SECRET || 'universal_shop_system_secret_key_2026';
    return jwt.sign(
      {
        id: user._id,
        role: user.role,
        shopId: user.shop._id || user.shop
      },
      secret,
      { expiresIn: '30d' }
    );
  }
};
