import { saleRepository } from '../repositories/saleRepository.js';
import { purchaseRepository } from '../repositories/purchaseRepository.js';
import { expenseRepository } from '../repositories/expenseRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { customerRepository } from '../repositories/customerRepository.js';
import { supplierRepository } from '../repositories/supplierRepository.js';

export const dashboardService = {
  async getDashboardSummary(shopId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todaySales,
      todayPurchases,
      todayExpenses,
      totalProducts,
      lowStockProducts,
      customerCredit,
      supplierPayable,
      salesTrend
    ] = await Promise.all([
      saleRepository.getSalesReport(shopId, today, tomorrow),
      purchaseRepository.getPurchaseReport(shopId, today, tomorrow),
      expenseRepository.getTotalExpenses(shopId, today, tomorrow),
      productRepository.countTotal(shopId),
      productRepository.countLowStock(shopId),
      customerRepository.getTotalCreditDue(shopId),
      supplierRepository.getTotalPayables(shopId),
      saleRepository.getDailySalesTrend(shopId, 7)
    ]);

    return {
      todaySales: todaySales.totalSales || 0,
      todaySalesCount: todaySales.totalCount || 0,
      todayProfit: todaySales.totalProfit || 0,
      todayPurchases: todayPurchases.totalPurchases || 0,
      todayExpenses: todayExpenses || 0,
      totalProducts,
      lowStockProducts,
      outstandingCustomerCredit: customerCredit,
      supplierPayables: supplierPayable,
      salesTrend
    };
  }
};
