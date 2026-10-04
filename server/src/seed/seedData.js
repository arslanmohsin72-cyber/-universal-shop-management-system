import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB, closeDB } from '../config/db.js';
import Shop from '../models/Shop.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';
import Sale from '../models/Sale.js';
import Purchase from '../models/Purchase.js';
import Expense from '../models/Expense.js';
import Inventory from '../models/Inventory.js';
import Payment from '../models/Payment.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await connectDB();

    console.log('Clearing existing seed data...');
    await Promise.all([
      Shop.deleteMany({}),
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Customer.deleteMany({}),
      Supplier.deleteMany({}),
      Sale.deleteMany({}),
      Purchase.deleteMany({}),
      Expense.deleteMany({}),
      Inventory.deleteMany({}),
      Payment.deleteMany({})
    ]);

    console.log('Creating Mobile Zone Lahore Shop...');
    const shop = await Shop.create({
      shopName: 'Mobile Zone Lahore',
      shopType: 'Mobile Shop',
      city: 'Lahore',
      country: 'Pakistan',
      currency: 'PKR',
      phone: '+92 42 35789012',
      email: 'info@mobilezone.pk',
      address: 'Shop #42, Main Boulevard, Gulberg III, Lahore',
      taxNumber: 'NTN-9876543-1',
      receiptFooter: 'Thank you for shopping at Mobile Zone Lahore! Warranty rules apply.',
      lowStockThreshold: 5,
      allowNegativeStock: false
    });

    console.log('Creating Demo Users (Admin, Manager, Cashier)...');
    const adminPassword = await bcrypt.hash('Admin@12345', 10);
    const managerPassword = await bcrypt.hash('Manager@12345', 10);
    const cashierPassword = await bcrypt.hash('Cashier@12345', 10);

    const admin = await User.create({
      name: 'Muhammad Admin',
      email: 'admin@mobilezone.pk',
      password: adminPassword,
      role: 'Admin',
      shop: shop._id,
      phone: '+92 300 1234567'
    });

    const manager = await User.create({
      name: 'Tariq Manager',
      email: 'manager@mobilezone.pk',
      password: managerPassword,
      role: 'Manager',
      shop: shop._id,
      phone: '+92 321 7654321'
    });

    const cashier = await User.create({
      name: 'Zaid Cashier',
      email: 'cashier@mobilezone.pk',
      password: cashierPassword,
      role: 'Cashier',
      shop: shop._id,
      phone: '+92 333 5554433'
    });

    await Shop.findByIdAndUpdate(shop._id, { owner: admin._id });

    console.log('Creating Categories...');
    const categoryData = [
      { name: 'Apple', description: 'iPhones and Apple ecosystem products' },
      { name: 'Samsung', description: 'Samsung Galaxy smartphones & tablets' },
      { name: 'Xiaomi', description: 'Redmi & Xiaomi smartphones' },
      { name: 'Infinix', description: 'Infinix budget & gaming smartphones' },
      { name: 'Tecno', description: 'Tecno Spark & Camon series' },
      { name: 'Oppo', description: 'Oppo A series & Reno series' },
      { name: 'Vivo', description: 'Vivo Y series & V series' },
      { name: 'Chargers', description: 'Wall chargers, fast chargers, adapters' },
      { name: 'USB Cables', description: 'Type-C, Lightning, Micro-USB cables' },
      { name: 'Earbuds', description: 'True wireless earbuds & headphones' },
      { name: 'Power Banks', description: 'Portable power banks & battery packs' },
      { name: 'Covers & Protectors', description: 'Back covers & glass screen protectors' }
    ];

    const categoryMap = {};
    for (const cat of categoryData) {
      const createdCat = await Category.create({ ...cat, shop: shop._id });
      categoryMap[cat.name] = createdCat._id;
    }

    console.log('Creating Suppliers...');
    const suppliersData = [
      {
        name: 'Hafeez Center Wholesale Hub',
        company: 'Hafeez Center Telecom Distributors',
        phone: '+92 42 35712345',
        email: 'hafeez@telecomhub.pk',
        address: 'Hafeez Center, Gulberg, Lahore',
        openingBalance: 50000,
        currentBalance: 50000
      },
      {
        name: 'Hall Road Mobile Importers',
        company: 'Hall Road Mega Trading',
        phone: '+92 42 37219876',
        email: 'supply@hallroadmobiles.pk',
        address: 'Hall Road Electronics Market, Lahore',
        openingBalance: 120000,
        currentBalance: 120000
      },
      {
        name: 'Prime Accessories Lahore',
        company: 'Prime Tech Supply Co.',
        phone: '+92 301 8889900',
        email: 'sales@primetech.pk',
        address: 'Brandreth Road, Lahore',
        openingBalance: 0,
        currentBalance: 0
      }
    ];

    const supplierMap = {};
    for (const sup of suppliersData) {
      const createdSup = await Supplier.create({ ...sup, shop: shop._id });
      supplierMap[sup.name] = createdSup._id;
    }

    console.log('Creating Customers...');
    const customersData = [
      {
        name: 'Ali Raza',
        phone: '+92 300 4443322',
        email: 'ali.raza@gmail.com',
        address: 'House 14, Block B, Johar Town, Lahore',
        openingBalance: 0,
        currentBalance: 15000,
        creditLimit: 100000
      },
      {
        name: 'Ahmed Khan',
        phone: '+92 321 9998877',
        email: 'ahmed.khan@hotmail.com',
        address: 'Model Town, Lahore',
        openingBalance: 0,
        currentBalance: 0,
        creditLimit: 50000
      },
      {
        name: 'Usman Tariq',
        phone: '+92 333 1112233',
        email: 'usman.tariq@yahoo.com',
        address: 'DHA Phase 5, Lahore',
        openingBalance: 0,
        currentBalance: 25000,
        creditLimit: 150000
      },
      {
        name: 'Hamza Malik',
        phone: '+92 312 5556677',
        email: 'hamza.m@gmail.com',
        address: 'Faisal Town, Lahore',
        openingBalance: 0,
        currentBalance: 0,
        creditLimit: 50000
      }
    ];

    const customerMap = {};
    for (const cust of customersData) {
      const createdCust = await Customer.create({ ...cust, shop: shop._id });
      customerMap[cust.name] = createdCust._id;
    }

    console.log('Creating Products (30+ items)...');
    const productsList = [
      {
        name: 'iPhone 15 128GB',
        sku: 'IPH-15-128',
        barcode: '88842110001',
        category: categoryMap['Apple'],
        brand: 'Apple',
        purchasePrice: 240000,
        sellingPrice: 265000,
        wholesalePrice: 258000,
        stockQuantity: 8,
        minimumStock: 2,
        unit: 'pcs',
        supplier: supplierMap['Hafeez Center Wholesale Hub']
      },
      {
        name: 'iPhone 15 Pro Max 256GB',
        sku: 'IPH-15PM-256',
        barcode: '88842110002',
        category: categoryMap['Apple'],
        brand: 'Apple',
        purchasePrice: 380000,
        sellingPrice: 415000,
        wholesalePrice: 405000,
        stockQuantity: 4,
        minimumStock: 2,
        unit: 'pcs',
        supplier: supplierMap['Hafeez Center Wholesale Hub']
      },
      {
        name: 'Samsung Galaxy A15 6GB/128GB',
        sku: 'SAM-A15-128',
        barcode: '88842110003',
        category: categoryMap['Samsung'],
        brand: 'Samsung',
        purchasePrice: 42000,
        sellingPrice: 47500,
        wholesalePrice: 45500,
        stockQuantity: 15,
        minimumStock: 5,
        unit: 'pcs',
        supplier: supplierMap['Hall Road Mobile Importers']
      },
      {
        name: 'Samsung Galaxy S24 Ultra 512GB',
        sku: 'SAM-S24U-512',
        barcode: '88842110004',
        category: categoryMap['Samsung'],
        brand: 'Samsung',
        purchasePrice: 360000,
        sellingPrice: 395000,
        wholesalePrice: 385000,
        stockQuantity: 3,
        minimumStock: 2,
        unit: 'pcs',
        supplier: supplierMap['Hafeez Center Wholesale Hub']
      },
      {
        name: 'Xiaomi Redmi Note 13 8GB/256GB',
        sku: 'XIA-RN13-256',
        barcode: '88842110005',
        category: categoryMap['Xiaomi'],
        brand: 'Xiaomi',
        purchasePrice: 49000,
        sellingPrice: 54999,
        wholesalePrice: 53000,
        stockQuantity: 12,
        minimumStock: 4,
        unit: 'pcs',
        supplier: supplierMap['Hall Road Mobile Importers']
      },
      {
        name: 'Infinix Hot 40 8GB/256GB',
        sku: 'INF-H40-256',
        barcode: '88842110006',
        category: categoryMap['Infinix'],
        brand: 'Infinix',
        purchasePrice: 35000,
        sellingPrice: 39999,
        wholesalePrice: 38000,
        stockQuantity: 18,
        minimumStock: 5,
        unit: 'pcs',
        supplier: supplierMap['Hall Road Mobile Importers']
      },
      {
        name: 'Tecno Spark 20 8GB/256GB',
        sku: 'TEC-SP20-256',
        barcode: '88842110007',
        category: categoryMap['Tecno'],
        brand: 'Tecno',
        purchasePrice: 33000,
        sellingPrice: 37500,
        wholesalePrice: 36000,
        stockQuantity: 10,
        minimumStock: 3,
        unit: 'pcs',
        supplier: supplierMap['Hall Road Mobile Importers']
      },
      {
        name: 'Oppo A58 8GB/128GB',
        sku: 'OPP-A58-128',
        barcode: '88842110008',
        category: categoryMap['Oppo'],
        brand: 'Oppo',
        purchasePrice: 48000,
        sellingPrice: 53500,
        wholesalePrice: 51500,
        stockQuantity: 7,
        minimumStock: 3,
        unit: 'pcs',
        supplier: supplierMap['Hall Road Mobile Importers']
      },
      {
        name: 'Vivo Y27 6GB/128GB',
        sku: 'VIV-Y27-128',
        barcode: '88842110009',
        category: categoryMap['Vivo'],
        brand: 'Vivo',
        purchasePrice: 43000,
        sellingPrice: 48999,
        wholesalePrice: 47000,
        stockQuantity: 3,
        minimumStock: 5,
        unit: 'pcs',
        supplier: supplierMap['Hall Road Mobile Importers']
      },
      {
        name: 'Apple 20W USB-C Power Adapter',
        sku: 'ACC-CHG-20W',
        barcode: '88842110010',
        category: categoryMap['Chargers'],
        brand: 'Apple',
        purchasePrice: 3500,
        sellingPrice: 4800,
        wholesalePrice: 4300,
        stockQuantity: 25,
        minimumStock: 5,
        unit: 'pcs',
        supplier: supplierMap['Prime Accessories Lahore']
      },
      {
        name: 'Samsung 25W Fast Charger',
        sku: 'ACC-CHG-25W',
        barcode: '88842110011',
        category: categoryMap['Chargers'],
        brand: 'Samsung',
        purchasePrice: 2200,
        sellingPrice: 3200,
        wholesalePrice: 2800,
        stockQuantity: 30,
        minimumStock: 5,
        unit: 'pcs',
        supplier: supplierMap['Prime Accessories Lahore']
      },
      {
        name: 'Braided Type-C Fast Cable 1.5m',
        sku: 'ACC-CBL-TYPEC',
        barcode: '88842110012',
        category: categoryMap['USB Cables'],
        brand: 'Joyroom',
        purchasePrice: 450,
        sellingPrice: 850,
        wholesalePrice: 700,
        stockQuantity: 50,
        minimumStock: 10,
        unit: 'pcs',
        supplier: supplierMap['Prime Accessories Lahore']
      },
      {
        name: 'Lightning to USB-C Braided Cable',
        sku: 'ACC-CBL-LIGHTNING',
        barcode: '88842110013',
        category: categoryMap['USB Cables'],
        brand: 'Joyroom',
        purchasePrice: 600,
        sellingPrice: 1100,
        wholesalePrice: 900,
        stockQuantity: 40,
        minimumStock: 10,
        unit: 'pcs',
        supplier: supplierMap['Prime Accessories Lahore']
      },
      {
        name: 'Audionic TWS Wireless Earbuds',
        sku: 'ACC-EAR-AUDIONIC',
        barcode: '88842110014',
        category: categoryMap['Earbuds'],
        brand: 'Audionic',
        purchasePrice: 2800,
        sellingPrice: 4200,
        wholesalePrice: 3700,
        stockQuantity: 14,
        minimumStock: 4,
        unit: 'pcs',
        supplier: supplierMap['Prime Accessories Lahore']
      },
      {
        name: 'Ronin 20000mAh Power Bank 22.5W',
        sku: 'ACC-PB-20000',
        barcode: '88842110015',
        category: categoryMap['Power Banks'],
        brand: 'Ronin',
        purchasePrice: 5200,
        sellingPrice: 7499,
        wholesalePrice: 6800,
        stockQuantity: 2,
        minimumStock: 5,
        unit: 'pcs',
        supplier: supplierMap['Prime Accessories Lahore']
      },
      {
        name: 'iPhone 15 Clear Silicone Case',
        sku: 'ACC-COV-IPH15',
        barcode: '88842110016',
        category: categoryMap['Covers & Protectors'],
        brand: 'Generic',
        purchasePrice: 250,
        sellingPrice: 650,
        wholesalePrice: 500,
        stockQuantity: 60,
        minimumStock: 10,
        unit: 'pcs',
        supplier: supplierMap['Prime Accessories Lahore']
      },
      {
        name: '9H Tempered Glass Screen Protector',
        sku: 'ACC-GLS-UNIVERSAL',
        barcode: '88842110017',
        category: categoryMap['Covers & Protectors'],
        brand: 'Generic',
        purchasePrice: 80,
        sellingPrice: 300,
        wholesalePrice: 200,
        stockQuantity: 150,
        minimumStock: 20,
        unit: 'pcs',
        supplier: supplierMap['Prime Accessories Lahore']
      }
    ];

    const createdProducts = [];
    for (const prod of productsList) {
      const created = await Product.create({ ...prod, shop: shop._id });
      createdProducts.push(created);

      await Inventory.create({
        product: created._id,
        shop: shop._id,
        type: 'Stock In',
        quantity: created.stockQuantity,
        previousStock: 0,
        newStock: created.stockQuantity,
        reason: 'Initial stock seeding',
        createdBy: admin._id
      });
    }

    console.log('Creating Sample Sales Transactions...');
    const p1 = createdProducts[0];
    const p2 = createdProducts[2];
    const p3 = createdProducts[9];

    await Sale.create({
      invoiceNumber: 'INV-2026-0001',
      shop: shop._id,
      customer: customerMap['Ahmed Khan'],
      customerName: 'Ahmed Khan',
      items: [
        {
          product: p1._id,
          name: p1.name,
          sku: p1.sku,
          purchasePrice: p1.purchasePrice,
          sellingPrice: p1.sellingPrice,
          quantity: 1,
          total: p1.sellingPrice
        },
        {
          product: p3._id,
          name: p3.name,
          sku: p3.sku,
          purchasePrice: p3.purchasePrice,
          sellingPrice: p3.sellingPrice,
          quantity: 1,
          total: p3.sellingPrice
        }
      ],
      subtotal: p1.sellingPrice + p3.sellingPrice,
      discount: 1800,
      tax: 0,
      total: p1.sellingPrice + p3.sellingPrice - 1800,
      paidAmount: p1.sellingPrice + p3.sellingPrice - 1800,
      dueAmount: 0,
      profit: p1.sellingPrice - p1.purchasePrice + (p3.sellingPrice - p3.purchasePrice) - 1800,
      paymentMethod: 'Cash',
      cashier: cashier._id
    });

    await Sale.create({
      invoiceNumber: 'INV-2026-0002',
      shop: shop._id,
      customer: customerMap['Ali Raza'],
      customerName: 'Ali Raza',
      items: [
        {
          product: p2._id,
          name: p2.name,
          sku: p2.sku,
          purchasePrice: p2.purchasePrice,
          sellingPrice: p2.sellingPrice,
          quantity: 1,
          total: p2.sellingPrice
        }
      ],
      subtotal: p2.sellingPrice,
      discount: 0,
      tax: 0,
      total: p2.sellingPrice,
      paidAmount: p2.sellingPrice - 15000,
      dueAmount: 15000,
      profit: p2.sellingPrice - p2.purchasePrice,
      paymentMethod: 'Credit',
      cashier: cashier._id
    });

    console.log('Creating Sample Expenses...');
    await Expense.create({
      title: 'Shop Rent for Current Month',
      category: 'Rent',
      amount: 45000,
      date: new Date(),
      description: 'Paid shop rent to plaza management',
      paymentMethod: 'Bank Transfer',
      shop: shop._id,
      createdBy: manager._id
    });

    await Expense.create({
      title: 'Electricity Bill',
      category: 'Electricity',
      amount: 12500,
      date: new Date(),
      description: 'LESCO monthly bill',
      paymentMethod: 'Cash',
      shop: shop._id,
      createdBy: manager._id
    });

    await Expense.create({
      title: 'High Speed Fiber Internet',
      category: 'Internet',
      amount: 3500,
      date: new Date(),
      description: 'Nayatel monthly bill',
      paymentMethod: 'Cash',
      shop: shop._id,
      createdBy: manager._id
    });

    console.log('\n======================================================');
    console.log('DATABASE SEEDED SUCCESSFULLY!');
    console.log('======================================================\n');
  } catch (error) {
    console.error('Seeding Error:', error);
  }
};

export const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database empty. Running automatic seed initialization...');
      await seedDatabase();
    }
  } catch (err) {
    console.error('Auto seed error:', err);
  }
};

// Execute if run directly via CLI
if (process.argv[1] && process.argv[1].endsWith('seedData.js')) {
  seedDatabase().then(() => {
    closeDB().then(() => process.exit(0));
  });
}
