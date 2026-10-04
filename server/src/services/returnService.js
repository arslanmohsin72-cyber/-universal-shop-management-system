import { returnRepository } from '../repositories/returnRepository.js';
import { saleRepository } from '../repositories/saleRepository.js';
import { purchaseRepository } from '../repositories/purchaseRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { customerRepository } from '../repositories/customerRepository.js';
import { supplierRepository } from '../repositories/supplierRepository.js';
import { inventoryRepository } from '../repositories/inventoryRepository.js';

export const returnService = {
  async processSaleReturn(shopId, userId, returnData) {
    const { saleId, invoiceNumber, items, reason, refundMethod = 'Cash' } = returnData;

    let sale = null;
    if (saleId) {
      sale = await saleRepository.findById(saleId, shopId);
    } else if (invoiceNumber) {
      sale = await saleRepository.findByInvoiceNumber(invoiceNumber, shopId);
    }

    if (!sale) {
      const error = new Error('Original sale invoice not found');
      error.statusCode = 404;
      throw error;
    }

    if (!items || items.length === 0) {
      const error = new Error('Return must contain at least one item');
      error.statusCode = 400;
      throw error;
    }

    let totalReturnAmount = 0;
    const processedReturnItems = [];

    for (const retItem of items) {
      const origItem = sale.items.find(
        (i) => i.product.toString() === retItem.productId.toString() || i.product._id?.toString() === retItem.productId.toString()
      );

      if (!origItem) {
        const error = new Error(`Item ${retItem.productId} was not part of original sale`);
        error.statusCode = 400;
        throw error;
      }

      const returnQty = Number(retItem.quantity);
      if (returnQty > origItem.quantity) {
        const error = new Error(`Return quantity (${returnQty}) exceeds sold quantity (${origItem.quantity}) for ${origItem.name}`);
        error.statusCode = 400;
        throw error;
      }

      const unitPrice = origItem.sellingPrice;
      const lineTotal = returnQty * unitPrice;
      totalReturnAmount += lineTotal;

      processedReturnItems.push({
        product: origItem.product._id || origItem.product,
        name: origItem.name,
        quantity: returnQty,
        unitPrice,
        total: lineTotal
      });
    }

    const returnNumber = `SR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const returnRecord = await returnRepository.create({
      returnNumber,
      shop: shopId,
      type: 'SaleReturn',
      originalInvoiceOrPurchaseNumber: sale.invoiceNumber,
      originalReferenceId: sale._id,
      customer: sale.customer ? (sale.customer._id || sale.customer) : null,
      items: processedReturnItems,
      totalAmount: totalReturnAmount,
      refundMethod,
      reason,
      createdBy: userId
    });

    // Increase product stock back
    for (const item of processedReturnItems) {
      const product = await productRepository.findById(item.product, shopId);
      const prevStock = product.stockQuantity;
      const newStock = prevStock + item.quantity;

      await productRepository.updateStock(item.product, shopId, newStock);

      await inventoryRepository.createLog({
        product: item.product,
        shop: shopId,
        type: 'Sale Return',
        quantity: item.quantity,
        previousStock: prevStock,
        newStock,
        referenceId: returnNumber,
        reason: `Sale Return for Invoice ${sale.invoiceNumber}: ${reason}`,
        createdBy: userId
      });
    }

    // Adjust customer credit if customer has balance
    if (sale.customer) {
      const customerId = sale.customer._id || sale.customer;
      if (refundMethod === 'Credit Adjustment') {
        await customerRepository.updateBalance(customerId, shopId, -totalReturnAmount);
      }
    }

    await saleRepository.updateStatus(sale._id, shopId, 'Returned');

    return returnRecord;
  },

  async processPurchaseReturn(shopId, userId, returnData) {
    const { purchaseId, purchaseNumber, items, reason, refundMethod = 'Cash' } = returnData;

    let purchase = null;
    if (purchaseId) {
      purchase = await purchaseRepository.findById(purchaseId, shopId);
    } else if (purchaseNumber) {
      purchase = await purchaseRepository.findByPurchaseNumber(purchaseNumber, shopId);
    }

    if (!purchase) {
      const error = new Error('Original purchase order not found');
      error.statusCode = 404;
      throw error;
    }

    if (!items || items.length === 0) {
      const error = new Error('Return must contain at least one item');
      error.statusCode = 400;
      throw error;
    }

    let totalReturnAmount = 0;
    const processedReturnItems = [];

    for (const retItem of items) {
      const origItem = purchase.items.find(
        (i) => i.product.toString() === retItem.productId.toString() || i.product._id?.toString() === retItem.productId.toString()
      );

      if (!origItem) {
        const error = new Error(`Item ${retItem.productId} was not part of original purchase`);
        error.statusCode = 400;
        throw error;
      }

      const returnQty = Number(retItem.quantity);
      if (returnQty > origItem.quantity) {
        const error = new Error(`Return quantity (${returnQty}) exceeds purchased quantity (${origItem.quantity}) for ${origItem.name}`);
        error.statusCode = 400;
        throw error;
      }

      const unitPrice = origItem.purchasePrice;
      const lineTotal = returnQty * unitPrice;
      totalReturnAmount += lineTotal;

      processedReturnItems.push({
        product: origItem.product._id || origItem.product,
        name: origItem.name,
        quantity: returnQty,
        unitPrice,
        total: lineTotal
      });
    }

    const returnNumber = `PR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const returnRecord = await returnRepository.create({
      returnNumber,
      shop: shopId,
      type: 'PurchaseReturn',
      originalInvoiceOrPurchaseNumber: purchase.purchaseNumber,
      originalReferenceId: purchase._id,
      supplier: purchase.supplier ? (purchase.supplier._id || purchase.supplier) : null,
      items: processedReturnItems,
      totalAmount: totalReturnAmount,
      refundMethod,
      reason,
      createdBy: userId
    });

    // Decrease stock back
    for (const item of processedReturnItems) {
      const product = await productRepository.findById(item.product, shopId);
      const prevStock = product.stockQuantity;
      const newStock = Math.max(0, prevStock - item.quantity);

      await productRepository.updateStock(item.product, shopId, newStock);

      await inventoryRepository.createLog({
        product: item.product,
        shop: shopId,
        type: 'Purchase Return',
        quantity: item.quantity,
        previousStock: prevStock,
        newStock,
        referenceId: returnNumber,
        reason: `Purchase Return for ${purchase.purchaseNumber}: ${reason}`,
        createdBy: userId
      });
    }

    // Adjust supplier balance if supplier exists
    if (purchase.supplier) {
      const supplierId = purchase.supplier._id || purchase.supplier;
      await supplierRepository.updateBalance(supplierId, shopId, -totalReturnAmount);
    }

    await purchaseRepository.updateStatus(purchase._id, shopId, 'Returned');

    return returnRecord;
  },

  async getReturns(shopId, filters) {
    return await returnRepository.findByShop(shopId, filters);
  },

  async getReturnById(id, shopId) {
    const ret = await returnRepository.findById(id, shopId);
    if (!ret) {
      const error = new Error('Return record not found');
      error.statusCode = 404;
      throw error;
    }
    return ret;
  }
};
