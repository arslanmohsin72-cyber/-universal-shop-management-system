import { saleRepository } from '../repositories/saleRepository.js';
import { purchaseRepository } from '../repositories/purchaseRepository.js';
import { expenseRepository } from '../repositories/expenseRepository.js';
import { productRepository } from '../repositories/productRepository.js';

export const reportService = {
  async getSalesReport(shopId, startDate, endDate) {
    return await saleRepository.getSalesReport(shopId, startDate, endDate);
  },

  async getPurchaseReport(shopId, startDate, endDate) {
    return await purchaseRepository.getPurchaseReport(shopId, startDate, endDate);
  },

  async getInventoryReport(shopId) {
    const { totalPurchaseValue, totalSellingValue } = await productRepository.getInventoryValue(shopId);
    const totalProducts = await productRepository.countTotal(shopId);
    const lowStockCount = await productRepository.countLowStock(shopId);

    return {
      totalProducts,
      lowStockCount,
      totalPurchaseValue,
      totalSellingValue,
      potentialProfit: totalSellingValue - totalPurchaseValue
    };
  },

  async getProfitLossReport(shopId, startDate, endDate) {
    const salesReport = await saleRepository.getSalesReport(shopId, startDate, endDate);
    const totalExpenses = await expenseRepository.getTotalExpenses(shopId, startDate, endDate);

    const grossSales = salesReport.totalSales || 0;
    const grossProfitFromSales = salesReport.totalProfit || 0;
    const cogs = grossSales - grossProfitFromSales;
    const netProfit = grossProfitFromSales - totalExpenses;

    return {
      grossSales,
      cogs,
      grossProfitFromSales,
      totalExpenses,
      netProfit,
      startDate,
      endDate
    };
  }
};
