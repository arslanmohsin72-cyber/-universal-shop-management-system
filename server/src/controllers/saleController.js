import { saleService } from '../services/saleService.js';

export const saleController = {
  async processSale(req, res, next) {
    try {
      const sale = await saleService.processSale(req.user.shopId, req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Sale completed successfully',
        data: sale
      });
    } catch (error) {
      next(error);
    }
  },

  async getSales(req, res, next) {
    try {
      const result = await saleService.getSales(req.user.shopId, req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getSaleById(req, res, next) {
    try {
      const sale = await saleService.getSaleById(req.params.id, req.user.shopId);
      res.status(200).json({ success: true, data: sale });
    } catch (error) {
      next(error);
    }
  },

  async getSaleByInvoiceNumber(req, res, next) {
    try {
      const sale = await saleService.getSaleByInvoiceNumber(req.params.invoiceNumber, req.user.shopId);
      res.status(200).json({ success: true, data: sale });
    } catch (error) {
      next(error);
    }
  }
};
