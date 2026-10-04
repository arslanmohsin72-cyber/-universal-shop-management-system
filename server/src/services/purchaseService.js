import { purchaseRepository } from '../repositories/purchaseRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { supplierRepository } from '../repositories/supplierRepository.js';
import { inventoryRepository } from '../repositories/inventoryRepository.js';

export const purchaseService = {
  async createPurchase(shopId, userId, purchaseData) {
    const { supplierId, items, discount = 0, tax = 0, paidAmount = 0, paymentMethod = 'Cash' } = purchaseData;

    if (!items || items.length === 0) {
      const error = new Error('Purchase must contain at least one item');
      error.statusCode = 400;
      throw error;
    }

    const supplier = await supplierRepository.findById(supplierId, shopId);
    if (!supplier) {
      const error = new Error('Supplier not found');
      error.statusCode = 400;
      throw error;
    }

    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await productRepository.findById(item.productId, shopId);
      if (!product) {
        const error = new Error(`Product not found: ${item.productId}`);
        error.statusCode = 400;
        throw error;
      }

      const qty = Number(item.quantity);
      const price = Number(item.purchasePrice || product.purchasePrice);
      const lineTotal = qty * price;
      subtotal += lineTotal;

      processedItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        purchasePrice: price,
        quantity: qty,
        total: lineTotal
      });
    }

    const numDiscount = Number(discount);
    const numTax = Number(tax);
    const grandTotal = subtotal - numDiscount + numTax;
    const numPaid = Number(paidAmount);
    const dueAmount = Math.max(0, grandTotal - numPaid);

    const purchaseNumber = `PUR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const purchase = await purchaseRepository.create({
      purchaseNumber,
      shop: shopId,
      supplier: supplier._id,
      supplierName: supplier.name,
      items: processedItems,
      subtotal,
      discount: numDiscount,
      tax: numTax,
      total: grandTotal,
      paidAmount: numPaid,
      dueAmount,
      paymentMethod,
      createdBy: userId
    });

    // Stock increase & inventory logs
    for (const item of processedItems) {
      const product = await productRepository.findById(item.product, shopId);
      const prevStock = product.stockQuantity;
      const newStock = prevStock + item.quantity;

      await productRepository.updateStock(item.product, shopId, newStock);

      await inventoryRepository.createLog({
        product: item.product,
        shop: shopId,
        type: 'Purchase',
        quantity: item.quantity,
        previousStock: prevStock,
        newStock,
        referenceId: purchaseNumber,
        reason: `Purchased from ${supplier.name}`,
        createdBy: userId
      });
    }

    // Update supplier payable if remaining balance > 0
    if (dueAmount > 0) {
      await supplierRepository.updateBalance(supplier._id, shopId, dueAmount);
    }

    return purchase;
  },

  async getPurchases(shopId, filters) {
    return await purchaseRepository.findByShop(shopId, filters);
  },

  async getPurchaseById(id, shopId) {
    const purchase = await purchaseRepository.findById(id, shopId);
    if (!purchase) {
      const error = new Error('Purchase not found');
      error.statusCode = 404;
      throw error;
    }
    return purchase;
  }
};
