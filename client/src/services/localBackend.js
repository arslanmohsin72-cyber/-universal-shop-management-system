// In-Browser Database & Business Logic Engine for Live Static Hosting Fallback

const DB_KEY = 'UNIVERSAL_SHOP_DB';

export const getLocalDB = () => {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    return initLocalDB();
  }
  return JSON.parse(data);
};

export const saveLocalDB = (db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const initLocalDB = () => {
  const db = {
    shop: {
      _id: 'shop_01',
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
    },
    users: [
      {
        _id: 'u_admin',
        name: 'Muhammad Admin',
        email: 'admin@mobilezone.pk',
        password: 'Admin@12345',
        role: 'Admin',
        shop: 'shop_01',
        phone: '+92 300 1234567',
        status: 'Active'
      },
      {
        _id: 'u_manager',
        name: 'Tariq Manager',
        email: 'manager@mobilezone.pk',
        password: 'Manager@12345',
        role: 'Manager',
        shop: 'shop_01',
        phone: '+92 321 7654321',
        status: 'Active'
      },
      {
        _id: 'u_cashier',
        name: 'Zaid Cashier',
        email: 'cashier@mobilezone.pk',
        password: 'Cashier@12345',
        role: 'Cashier',
        shop: 'shop_01',
        phone: '+92 333 5554433',
        status: 'Active'
      }
    ],
    categories: [
      { _id: 'c_apple', name: 'Apple', description: 'iPhones and Apple ecosystem' },
      { _id: 'c_samsung', name: 'Samsung', description: 'Samsung Galaxy smartphones & tablets' },
      { _id: 'c_xiaomi', name: 'Xiaomi', description: 'Redmi & Xiaomi smartphones' },
      { _id: 'c_infinix', name: 'Infinix', description: 'Infinix budget & gaming smartphones' },
      { _id: 'c_tecno', name: 'Tecno', description: 'Tecno Spark & Camon series' },
      { _id: 'c_oppo', name: 'Oppo', description: 'Oppo A series & Reno series' },
      { _id: 'c_vivo', name: 'Vivo', description: 'Vivo Y series & V series' },
      { _id: 'c_chargers', name: 'Chargers', description: 'Wall chargers, fast chargers, adapters' },
      { _id: 'c_cables', name: 'USB Cables', description: 'Type-C, Lightning, Micro-USB cables' },
      { _id: 'c_earbuds', name: 'Earbuds', description: 'True wireless earbuds & headphones' },
      { _id: 'c_powerbanks', name: 'Power Banks', description: 'Portable power banks & battery packs' },
      { _id: 'c_covers', name: 'Covers & Protectors', description: 'Back covers & glass screen protectors' }
    ],
    suppliers: [
      { _id: 's_hafeez', name: 'Hafeez Center Wholesale Hub', company: 'Hafeez Telecom', phone: '+92 42 35712345', currentBalance: 50000 },
      { _id: 's_hallroad', name: 'Hall Road Mobile Importers', company: 'Hall Road Trading', phone: '+92 42 37219876', currentBalance: 120000 },
      { _id: 's_prime', name: 'Prime Accessories Lahore', company: 'Prime Tech Supply', phone: '+92 301 8889900', currentBalance: 0 }
    ],
    customers: [
      { _id: 'cust_ali', name: 'Ali Raza', phone: '+92 300 4443322', email: 'ali.raza@gmail.com', currentBalance: 15000, creditLimit: 100000 },
      { _id: 'cust_ahmed', name: 'Ahmed Khan', phone: '+92 321 9998877', email: 'ahmed@hotmail.com', currentBalance: 0, creditLimit: 50000 },
      { _id: 'cust_usman', name: 'Usman Tariq', phone: '+92 333 1112233', email: 'usman@yahoo.com', currentBalance: 25000, creditLimit: 150000 }
    ],
    products: [
      { _id: 'p_iph15', name: 'iPhone 15 128GB', sku: 'IPH-15-128', barcode: '88842110001', category: { _id: 'c_apple', name: 'Apple' }, purchasePrice: 240000, sellingPrice: 265000, stockQuantity: 8, minimumStock: 2, unit: 'pcs' },
      { _id: 'p_iph15pm', name: 'iPhone 15 Pro Max 256GB', sku: 'IPH-15PM-256', barcode: '88842110002', category: { _id: 'c_apple', name: 'Apple' }, purchasePrice: 380000, sellingPrice: 415000, stockQuantity: 4, minimumStock: 2, unit: 'pcs' },
      { _id: 'p_sama15', name: 'Samsung Galaxy A15 6GB/128GB', sku: 'SAM-A15-128', barcode: '88842110003', category: { _id: 'c_samsung', name: 'Samsung' }, purchasePrice: 42000, sellingPrice: 47500, stockQuantity: 15, minimumStock: 5, unit: 'pcs' },
      { _id: 'p_sams24u', name: 'Samsung Galaxy S24 Ultra 512GB', sku: 'SAM-S24U-512', barcode: '88842110004', category: { _id: 'c_samsung', name: 'Samsung' }, purchasePrice: 360000, sellingPrice: 395000, stockQuantity: 3, minimumStock: 2, unit: 'pcs' },
      { _id: 'p_rn13', name: 'Xiaomi Redmi Note 13 8GB/256GB', sku: 'XIA-RN13-256', barcode: '88842110005', category: { _id: 'c_xiaomi', name: 'Xiaomi' }, purchasePrice: 49000, sellingPrice: 54999, stockQuantity: 12, minimumStock: 4, unit: 'pcs' },
      { _id: 'p_infh40', name: 'Infinix Hot 40 8GB/256GB', sku: 'INF-H40-256', barcode: '88842110006', category: { _id: 'c_infinix', name: 'Infinix' }, purchasePrice: 35000, sellingPrice: 39999, stockQuantity: 18, minimumStock: 5, unit: 'pcs' },
      { _id: 'p_tecsp20', name: 'Tecno Spark 20 8GB/256GB', sku: 'TEC-SP20-256', barcode: '88842110007', category: { _id: 'c_tecno', name: 'Tecno' }, purchasePrice: 33000, sellingPrice: 37500, stockQuantity: 10, minimumStock: 3, unit: 'pcs' },
      { _id: 'p_oppa58', name: 'Oppo A58 8GB/128GB', sku: 'OPP-A58-128', barcode: '88842110008', category: { _id: 'c_oppo', name: 'Oppo' }, purchasePrice: 48000, sellingPrice: 53500, stockQuantity: 7, minimumStock: 3, unit: 'pcs' },
      { _id: 'p_vivy27', name: 'Vivo Y27 6GB/128GB', sku: 'VIV-Y27-128', barcode: '88842110009', category: { _id: 'c_vivo', name: 'Vivo' }, purchasePrice: 43000, sellingPrice: 48999, stockQuantity: 3, minimumStock: 5, unit: 'pcs' },
      { _id: 'p_chg20w', name: 'Apple 20W USB-C Power Adapter', sku: 'ACC-CHG-20W', barcode: '88842110010', category: { _id: 'c_chargers', name: 'Chargers' }, purchasePrice: 3500, sellingPrice: 4800, stockQuantity: 25, minimumStock: 5, unit: 'pcs' },
      { _id: 'p_chg25w', name: 'Samsung 25W Fast Charger', sku: 'ACC-CHG-25W', barcode: '88842110011', category: { _id: 'c_chargers', name: 'Chargers' }, purchasePrice: 2200, sellingPrice: 3200, stockQuantity: 30, minimumStock: 5, unit: 'pcs' },
      { _id: 'p_cbltypec', name: 'Braided Type-C Fast Cable 1.5m', sku: 'ACC-CBL-TYPEC', barcode: '88842110012', category: { _id: 'c_cables', name: 'USB Cables' }, purchasePrice: 450, sellingPrice: 850, stockQuantity: 50, minimumStock: 10, unit: 'pcs' },
      { _id: 'p_cbllightning', name: 'Lightning to USB-C Cable', sku: 'ACC-CBL-LIGHTNING', barcode: '88842110013', category: { _id: 'c_cables', name: 'USB Cables' }, purchasePrice: 600, sellingPrice: 1100, stockQuantity: 40, minimumStock: 10, unit: 'pcs' },
      { _id: 'p_earbuds', name: 'Audionic TWS Wireless Earbuds', sku: 'ACC-EAR-AUDIONIC', barcode: '88842110014', category: { _id: 'c_earbuds', name: 'Earbuds' }, purchasePrice: 2800, sellingPrice: 4200, stockQuantity: 14, minimumStock: 4, unit: 'pcs' },
      { _id: 'p_pb20000', name: 'Ronin 20000mAh Power Bank', sku: 'ACC-PB-20000', barcode: '88842110015', category: { _id: 'c_powerbanks', name: 'Power Banks' }, purchasePrice: 5200, sellingPrice: 7499, stockQuantity: 2, minimumStock: 5, unit: 'pcs' },
      { _id: 'p_cover', name: 'iPhone 15 Clear Silicone Case', sku: 'ACC-COV-IPH15', barcode: '88842110016', category: { _id: 'c_covers', name: 'Covers & Protectors' }, purchasePrice: 250, sellingPrice: 650, stockQuantity: 60, minimumStock: 10, unit: 'pcs' },
      { _id: 'p_glass', name: '9H Tempered Glass Protector', sku: 'ACC-GLS-UNIVERSAL', barcode: '88842110017', category: { _id: 'c_covers', name: 'Covers & Protectors' }, purchasePrice: 80, sellingPrice: 300, stockQuantity: 150, minimumStock: 20, unit: 'pcs' }
    ],
    sales: [
      {
        _id: 'sale_01',
        invoiceNumber: 'INV-2026-0001',
        customerName: 'Ahmed Khan',
        items: [{ product: 'p_iph15', name: 'iPhone 15 128GB', quantity: 1, sellingPrice: 265000, total: 265000 }],
        subtotal: 265000,
        discount: 1800,
        tax: 0,
        total: 263200,
        paidAmount: 263200,
        dueAmount: 0,
        profit: 23200,
        paymentMethod: 'Cash',
        cashier: { name: 'Zaid Cashier' },
        createdAt: new Date().toISOString()
      },
      {
        _id: 'sale_02',
        invoiceNumber: 'INV-2026-0002',
        customerName: 'Ali Raza',
        items: [{ product: 'p_sama15', name: 'Samsung Galaxy A15', quantity: 1, sellingPrice: 47500, total: 47500 }],
        subtotal: 47500,
        discount: 0,
        tax: 0,
        total: 47500,
        paidAmount: 32500,
        dueAmount: 15000,
        profit: 5500,
        paymentMethod: 'Credit',
        cashier: { name: 'Zaid Cashier' },
        createdAt: new Date().toISOString()
      }
    ],
    purchases: [
      {
        _id: 'pur_01',
        purchaseNumber: 'PUR-2026-0001',
        supplierName: 'Hafeez Center Wholesale Hub',
        items: [{ product: 'p_iph15', name: 'iPhone 15 128GB', quantity: 5, purchasePrice: 240000, total: 1200000 }],
        subtotal: 1200000,
        total: 1200000,
        paidAmount: 1150000,
        dueAmount: 50000,
        paymentMethod: 'Cash',
        createdAt: new Date().toISOString()
      }
    ],
    expenses: [
      { _id: 'exp_01', title: 'Shop Rent for Current Month', category: 'Rent', amount: 45000, paymentMethod: 'Bank Transfer', date: new Date().toISOString() },
      { _id: 'exp_02', title: 'Electricity Bill', category: 'Electricity', amount: 12500, paymentMethod: 'Cash', date: new Date().toISOString() },
      { _id: 'exp_03', title: 'High Speed Fiber Internet', category: 'Internet', amount: 3500, paymentMethod: 'Cash', date: new Date().toISOString() }
    ],
    inventoryLogs: [],
    payments: [],
    returns: []
  };

  saveLocalDB(db);
  return db;
};

export const handleLocalRequest = async (url, method, data) => {
  const db = getLocalDB();
  const cleanUrl = url.split('?')[0];

  // Auth Login
  if (cleanUrl.endsWith('/auth/login') && method.toLowerCase() === 'post') {
    const { email, password } = data || {};
    const user = db.users.find((u) => u.email.toLowerCase() === email?.toLowerCase());
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    return {
      success: true,
      data: {
        token: `mock_jwt_token_${user.role}`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          shopId: db.shop._id,
          shopName: db.shop.shopName,
          shopType: db.shop.shopType,
          currency: db.shop.currency
        }
      }
    };
  }

  // Dashboard Summary
  if (cleanUrl.endsWith('/dashboard/summary')) {
    const todaySales = db.sales.reduce((acc, s) => acc + s.total, 0);
    const todayProfit = db.sales.reduce((acc, s) => acc + s.profit, 0);
    const todayExpenses = db.expenses.reduce((acc, e) => acc + e.amount, 0);
    const lowStockCount = db.products.filter((p) => p.stockQuantity <= p.minimumStock).length;
    const customerCredit = db.customers.reduce((acc, c) => acc + (c.currentBalance > 0 ? c.currentBalance : 0), 0);
    const supplierPayables = db.suppliers.reduce((acc, s) => acc + (s.currentBalance > 0 ? s.currentBalance : 0), 0);

    return {
      success: true,
      data: {
        todaySales,
        todaySalesCount: db.sales.length,
        todayProfit,
        todayPurchases: 1200000,
        todayExpenses,
        totalProducts: db.products.length,
        lowStockProducts: lowStockCount,
        outstandingCustomerCredit: customerCredit,
        supplierPayables,
        salesTrend: [
          { _id: '2026-09-28', totalAmount: 180000 },
          { _id: '2026-09-29', totalAmount: 220000 },
          { _id: '2026-09-30', totalAmount: 195000 },
          { _id: '2026-10-01', totalAmount: 240000 },
          { _id: '2026-10-02', totalAmount: 310000 },
          { _id: '2026-10-03', totalAmount: todaySales }
        ]
      }
    };
  }

  // Products
  if (cleanUrl.endsWith('/products')) {
    if (method.toLowerCase() === 'get') {
      return { success: true, data: { products: db.products, total: db.products.length } };
    }
    if (method.toLowerCase() === 'post') {
      const newProd = {
        _id: `p_${Date.now()}`,
        ...data,
        category: db.categories.find((c) => c._id === data.category) || { name: 'General' },
        stockQuantity: Number(data.stockQuantity || 0)
      };
      db.products.unshift(newProd);
      saveLocalDB(db);
      return { success: true, data: newProd };
    }
  }

  // Search Barcode / SKU
  if (cleanUrl.endsWith('/products/search-code')) {
    const query = data?.code?.toString()?.toLowerCase();
    const prod = db.products.find(
      (p) => p.barcode?.toLowerCase() === query || p.sku?.toLowerCase() === query
    );
    if (!prod) throw new Error('Product not found with given code');
    return { success: true, data: prod };
  }

  // Categories
  if (cleanUrl.endsWith('/categories')) {
    if (method.toLowerCase() === 'get') {
      return { success: true, data: db.categories };
    }
    if (method.toLowerCase() === 'post') {
      const newCat = { _id: `c_${Date.now()}`, ...data };
      db.categories.push(newCat);
      saveLocalDB(db);
      return { success: true, data: newCat };
    }
  }

  // Process POS Sale
  if (cleanUrl.endsWith('/sales') && method.toLowerCase() === 'post') {
    const { customerId, items, discount = 0, tax = 0, paidAmount = 0, paymentMethod } = data;
    let subtotal = 0;
    let cogs = 0;
    const processedItems = [];

    for (const item of items) {
      const prod = db.products.find((p) => p._id === item.productId);
      if (!prod) throw new Error('Product not found');
      if (prod.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${prod.name}`);
      }
      prod.stockQuantity -= item.quantity;
      const lineTotal = prod.sellingPrice * item.quantity;
      subtotal += lineTotal;
      cogs += prod.purchasePrice * item.quantity;
      processedItems.push({
        product: prod._id,
        name: prod.name,
        sku: prod.sku,
        sellingPrice: prod.sellingPrice,
        quantity: item.quantity,
        total: lineTotal
      });
    }

    const total = subtotal - Number(discount) + Number(tax);
    const dueAmount = Math.max(0, total - Number(paidAmount));
    const profit = total - cogs;
    const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    let custName = 'Walk-in Customer';
    if (customerId) {
      const cust = db.customers.find((c) => c._id === customerId);
      if (cust) {
        custName = cust.name;
        if (dueAmount > 0) {
          cust.currentBalance += dueAmount;
        }
      }
    }

    const newSale = {
      _id: `sale_${Date.now()}`,
      invoiceNumber,
      customerName: custName,
      items: processedItems,
      subtotal,
      discount: Number(discount),
      tax: Number(tax),
      total,
      paidAmount: Number(paidAmount),
      dueAmount,
      profit,
      paymentMethod,
      cashier: { name: 'Staff' },
      createdAt: new Date().toISOString()
    };

    db.sales.unshift(newSale);
    saveLocalDB(db);
    return { success: true, data: newSale };
  }

  // Get Sales
  if (cleanUrl.endsWith('/sales') && method.toLowerCase() === 'get') {
    return { success: true, data: { sales: db.sales, total: db.sales.length } };
  }

  // Customers
  if (cleanUrl.endsWith('/customers')) {
    if (method.toLowerCase() === 'get') {
      return { success: true, data: { customers: db.customers, total: db.customers.length } };
    }
    if (method.toLowerCase() === 'post') {
      const newCust = { _id: `cust_${Date.now()}`, ...data, currentBalance: Number(data.openingBalance || 0) };
      db.customers.push(newCust);
      saveLocalDB(db);
      return { success: true, data: newCust };
    }
  }

  // Customer Payment
  if (cleanUrl.endsWith('/payments/customer') && method.toLowerCase() === 'post') {
    const { customerId, amount } = data;
    const cust = db.customers.find((c) => c._id === customerId);
    if (cust) {
      cust.currentBalance = Math.max(0, cust.currentBalance - Number(amount));
    }
    saveLocalDB(db);
    return { success: true, message: 'Payment recorded successfully' };
  }

  // Suppliers
  if (cleanUrl.endsWith('/suppliers')) {
    if (method.toLowerCase() === 'get') {
      return { success: true, data: { suppliers: db.suppliers, total: db.suppliers.length } };
    }
    if (method.toLowerCase() === 'post') {
      const newSup = { _id: `s_${Date.now()}`, ...data, currentBalance: Number(data.openingBalance || 0) };
      db.suppliers.push(newSup);
      saveLocalDB(db);
      return { success: true, data: newSup };
    }
  }

  // Purchases
  if (cleanUrl.endsWith('/purchases')) {
    if (method.toLowerCase() === 'get') {
      return { success: true, data: { purchases: db.purchases, total: db.purchases.length } };
    }
    if (method.toLowerCase() === 'post') {
      const { supplierId, items, paidAmount = 0 } = data;
      const sup = db.suppliers.find((s) => s._id === supplierId);
      let total = 0;
      for (const item of items) {
        const prod = db.products.find((p) => p._id === item.productId);
        if (prod) {
          prod.stockQuantity += Number(item.quantity);
        }
        total += item.purchasePrice * item.quantity;
      }
      const dueAmount = Math.max(0, total - Number(paidAmount));
      if (sup && dueAmount > 0) {
        sup.currentBalance += dueAmount;
      }
      const newPur = {
        _id: `pur_${Date.now()}`,
        purchaseNumber: `PUR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        supplierName: sup ? sup.name : 'Vendor',
        items,
        total,
        paidAmount: Number(paidAmount),
        dueAmount,
        paymentMethod: data.paymentMethod || 'Cash',
        createdAt: new Date().toISOString()
      };
      db.purchases.unshift(newPur);
      saveLocalDB(db);
      return { success: true, data: newPur };
    }
  }

  // Expenses
  if (cleanUrl.endsWith('/expenses')) {
    if (method.toLowerCase() === 'get') {
      return { success: true, data: { expenses: db.expenses, total: db.expenses.length } };
    }
    if (method.toLowerCase() === 'post') {
      const newExp = { _id: `exp_${Date.now()}`, ...data, date: new Date().toISOString() };
      db.expenses.unshift(newExp);
      saveLocalDB(db);
      return { success: true, data: newExp };
    }
  }

  // Shop Settings
  if (cleanUrl.endsWith('/shops/settings')) {
    if (method.toLowerCase() === 'get') {
      return { success: true, data: db.shop };
    }
    if (method.toLowerCase() === 'put') {
      db.shop = { ...db.shop, ...data };
      saveLocalDB(db);
      return { success: true, data: db.shop };
    }
  }

  // Reports
  if (cleanUrl.endsWith('/reports/sales')) {
    const totalSales = db.sales.reduce((acc, s) => acc + s.total, 0);
    const totalProfit = db.sales.reduce((acc, s) => acc + s.profit, 0);
    return { success: true, data: { totalSales, totalCount: db.sales.length, totalDiscount: 1800, totalProfit } };
  }
  if (cleanUrl.endsWith('/reports/purchases')) {
    const totalPurchases = db.purchases.reduce((acc, p) => acc + p.total, 0);
    return { success: true, data: { totalPurchases, totalCount: db.purchases.length, totalPaid: 1150000, totalDue: 50000 } };
  }
  if (cleanUrl.endsWith('/reports/inventory')) {
    const totalPurchaseValue = db.products.reduce((acc, p) => acc + p.stockQuantity * p.purchasePrice, 0);
    const totalSellingValue = db.products.reduce((acc, p) => acc + p.stockQuantity * p.sellingPrice, 0);
    return { success: true, data: { totalProducts: db.products.length, lowStockCount: 2, totalPurchaseValue, totalSellingValue } };
  }
  if (cleanUrl.endsWith('/reports/profit-loss')) {
    const grossSales = db.sales.reduce((acc, s) => acc + s.total, 0);
    const grossProfitFromSales = db.sales.reduce((acc, s) => acc + s.profit, 0);
    const totalExpenses = db.expenses.reduce((acc, e) => acc + e.amount, 0);
    return { success: true, data: { grossSales, cogs: grossSales - grossProfitFromSales, grossProfitFromSales, totalExpenses, netProfit: grossProfitFromSales - totalExpenses } };
  }

  // Fallback default response
  return { success: true, data: [] };
};
