import { saleRepository } from '../repositories/saleRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { customerRepository } from '../repositories/customerRepository.js';
import { shopRepository } from '../repositories/shopRepository.js';
import { inventoryRepository } from '../repositories/inventoryRepository.js';

export const saleService = {
  async processSale(shopId, cashierId, saleData) {
    const { customerId, customerName, items, discount = 0, tax = 0, paidAmount = 0, paymentMethod = 'Cash' } = saleData;

    if (!items || items.length === 0) {
      const error = new Error('Sale must contain at least one product');
      error.statusCode = 400;
      throw error;
    }

    const shop = await shopRepository.findById(shopId);

    let customer = null;
    if (customerId) {
      customer = await customerRepository.findById(customerId, shopId);
    }

    let subtotal = 0;
    let cogsTotal = 0;
    const processedItems = [];

    // Check stock & build line items
    for (const item of items) {
      const product = await productRepository.findById(item.productId, shopId);
      if (!product) {
        const error = new Error(`Product not found: ${item.productId}`);
        error.statusCode = 400;
        throw error;
      }

      const qty = Number(item.quantity);
      if (qty <= 0) {
        const error = new Error(`Invalid quantity for product ${product.name}`);
        error.statusCode = 400;
        throw error;
      }

      // Stock check unless negative stock is allowed
      if (!shop.allowNegativeStock && product.stockQuantity < qty) {
        const error = new Error(
          `Insufficient stock for '${product.name}'. Available: ${product.stockQuantity}, Requested: ${qty}`
        );
        error.statusCode = 400;
        throw error;
      }

      const sellingPrice = Number(item.sellingPrice || product.sellingPrice);
      const purchasePrice = Number(product.purchasePrice);
      const lineTotal = sellingPrice * qty;

      subtotal += lineTotal;
      cogsTotal += purchasePrice * qty;

      processedItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        purchasePrice,
        sellingPrice,
        quantity: qty,
        total: lineTotal
      });
    }

    const numDiscount = Number(discount);
    const numTax = Number(tax);
    const grandTotal = Math.max(0, subtotal - numDiscount + numTax);

    // If payment method is Credit, check customer assignment
    if (paymentMethod === 'Credit' && !customer) {
      const error = new Error('Customer must be selected for Credit sales');
      error.statusCode = 400;
      throw error;
    }

    const numPaid = paymentMethod === 'Credit' ? 0 : Number(paidAmount);
    const dueAmount = Math.max(0, grandTotal - numPaid);

    // Validate customer credit limit if due
    if (customer && dueAmount > 0) {
      if (customer.currentBalance + dueAmount > customer.creditLimit) {
        const error = new Error(
          `Credit limit exceeded for customer ${customer.name}. Current balance: ${customer.currentBalance}, Limit: ${customer.creditLimit}`
        );
        error.statusCode = 400;
        throw error;
      }
    }

    const netProfit = grandTotal - cogsTotal;
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const sale = await saleRepository.create({
      invoiceNumber,
      shop: shopId,
      customer: customer ? customer._id : null,
      customerName: customer ? customer.name : customerName || 'Walk-in Customer',
      items: processedItems,
      subtotal,
      discount: numDiscount,
      tax: numTax,
      total: grandTotal,
      paidAmount: numPaid,
      dueAmount,
      profit: netProfit,
      paymentMethod,
      cashier: cashierId
    });

    // Reduce inventory & log movement
    for (const item of processedItems) {
      const product = await productRepository.findById(item.product, shopId);
      const prevStock = product.stockQuantity;
      const newStock = prevStock - item.quantity;

      await productRepository.updateStock(item.product, shopId, newStock);

      await inventoryRepository.createLog({
        product: item.product,
        shop: shopId,
        type: 'Sale',
        quantity: item.quantity,
        previousStock: prevStock,
        newStock,
        referenceId: invoiceNumber,
        reason: `Sold via POS Invoice ${invoiceNumber}`,
        createdBy: cashierId
      });
    }

    // Update customer credit balance if due
    if (customer && dueAmount > 0) {
      await customerRepository.updateBalance(customer._id, shopId, dueAmount);
    }

    return sale;
  },

  async getSales(shopId, filters) {
    return await saleRepository.findByShop(shopId, filters);
  },

  async getSaleById(id, shopId) {
    const sale = await saleRepository.findById(id, shopId);
    if (!sale) {
      const error = new Error('Sale not found');
      error.statusCode = 404;
      throw error;
    }
    return sale;
  },

  async getSaleByInvoiceNumber(invoiceNumber, shopId) {
    const sale = await saleRepository.findByInvoiceNumber(invoiceNumber, shopId);
    if (!sale) {
      const error = new Error('Invoice not found');
      error.statusCode = 404;
      throw error;
    }
    return sale;
  }
};
