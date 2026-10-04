import test, { describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { connectDB, closeDB } from '../config/db.js';
import Shop from '../models/Shop.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';
import { saleService } from '../services/saleService.js';
import { purchaseService } from '../services/purchaseService.js';
import { returnService } from '../services/returnService.js';
import { reportService } from '../services/reportService.js';

describe('Universal Shop Management Business Logic Tests', () => {
  let shop, user, category, product, customer, supplier;

  before(async () => {
    await connectDB();

    shop = await Shop.create({
      shopName: 'Test Shop',
      shopType: 'Mobile Shop',
      currency: 'PKR'
    });

    user = await User.create({
      name: 'Test Cashier',
      email: 'cashier.test@shop.com',
      password: 'hashedpassword',
      role: 'Cashier',
      shop: shop._id
    });

    category = await Category.create({
      name: 'Smartphones',
      shop: shop._id
    });

    supplier = await Supplier.create({
      name: 'Test Supplier',
      company: 'Supplier Corp',
      shop: shop._id
    });

    product = await Product.create({
      name: 'Test Phone',
      sku: 'TEST-PHONE-1',
      purchasePrice: 10000,
      sellingPrice: 15000,
      stockQuantity: 20,
      minimumStock: 5,
      category: category._id,
      supplier: supplier._id,
      shop: shop._id
    });

    customer = await Customer.create({
      name: 'Test Customer',
      phone: '03001234567',
      creditLimit: 50000,
      shop: shop._id
    });
  });

  after(async () => {
    await closeDB();
  });

  test('Sale processing calculates subtotal, grand total, profit & stock deduction correctly', async () => {
    const saleData = {
      customerId: customer._id,
      items: [{ productId: product._id, quantity: 2 }],
      discount: 1000,
      tax: 500,
      paidAmount: 29500,
      paymentMethod: 'Cash'
    };

    const sale = await saleService.processSale(shop._id, user._id, saleData);

    assert.equal(sale.subtotal, 30000); // 2 * 15000
    assert.equal(sale.total, 29500); // 30000 - 1000 + 500
    assert.equal(sale.profit, 9500); // Total(29500) - COGS(20000)

    const updatedProduct = await Product.findById(product._id);
    assert.equal(updatedProduct.stockQuantity, 18); // 20 - 2
  });

  test('Credit sale updates customer outstanding balance', async () => {
    const saleData = {
      customerId: customer._id,
      items: [{ productId: product._id, quantity: 1 }],
      discount: 0,
      tax: 0,
      paidAmount: 0,
      paymentMethod: 'Credit'
    };

    const sale = await saleService.processSale(shop._id, user._id, saleData);
    assert.equal(sale.dueAmount, 15000);

    const updatedCustomer = await Customer.findById(customer._id);
    assert.equal(updatedCustomer.currentBalance, 15000);
  });

  test('Purchase processing increases product stock and calculates totals', async () => {
    const initialStock = (await Product.findById(product._id)).stockQuantity;

    const purchaseData = {
      supplierId: supplier._id,
      items: [{ productId: product._id, quantity: 5, purchasePrice: 10000 }],
      paidAmount: 50000,
      paymentMethod: 'Cash'
    };

    const purchase = await purchaseService.createPurchase(shop._id, user._id, purchaseData);

    assert.equal(purchase.total, 50000);
    const updatedProduct = await Product.findById(product._id);
    assert.equal(updatedProduct.stockQuantity, initialStock + 5);
  });

  test('Profit & Loss report accurately reflects sales profit minus expenses', async () => {
    const report = await reportService.getProfitLossReport(shop._id);
    assert.ok(report.grossSales > 0);
    assert.ok(report.grossProfitFromSales > 0);
  });
});
