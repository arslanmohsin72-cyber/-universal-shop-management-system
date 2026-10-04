import { paymentRepository } from '../repositories/paymentRepository.js';
import { customerRepository } from '../repositories/customerRepository.js';
import { supplierRepository } from '../repositories/supplierRepository.js';

export const paymentService = {
  async recordCustomerPayment(shopId, userId, { customerId, amount, paymentMethod = 'Cash', note }) {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      const error = new Error('Invalid payment amount');
      error.statusCode = 400;
      throw error;
    }

    const customer = await customerRepository.findById(customerId, shopId);
    if (!customer) {
      const error = new Error('Customer not found');
      error.statusCode = 404;
      throw error;
    }

    const paymentNumber = `PAY-C-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const payment = await paymentRepository.create({
      paymentNumber,
      shop: shopId,
      type: 'CustomerPayment',
      customer: customer._id,
      amount: numAmount,
      paymentMethod,
      note: note || `Received payment from ${customer.name}`,
      createdBy: userId
    });

    // Reduce customer credit balance (due amount decreases)
    await customerRepository.updateBalance(customer._id, shopId, -numAmount);

    return payment;
  },

  async recordSupplierPayment(shopId, userId, { supplierId, amount, paymentMethod = 'Cash', note }) {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      const error = new Error('Invalid payment amount');
      error.statusCode = 400;
      throw error;
    }

    const supplier = await supplierRepository.findById(supplierId, shopId);
    if (!supplier) {
      const error = new Error('Supplier not found');
      error.statusCode = 404;
      throw error;
    }

    const paymentNumber = `PAY-S-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const payment = await paymentRepository.create({
      paymentNumber,
      shop: shopId,
      type: 'SupplierPayment',
      supplier: supplier._id,
      amount: numAmount,
      paymentMethod,
      note: note || `Paid to supplier ${supplier.name}`,
      createdBy: userId
    });

    // Reduce supplier payable balance
    await supplierRepository.updateBalance(supplier._id, shopId, -numAmount);

    return payment;
  },

  async getPayments(shopId, filters) {
    return await paymentRepository.findByShop(shopId, filters);
  }
};
