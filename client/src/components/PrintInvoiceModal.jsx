import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const PrintInvoiceModal = ({ sale, shop, onClose }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal fade show d-block bg-dark bg-opacity-50" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header bg-light border-bottom no-print">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-printer me-2 text-primary"></i> Invoice Receipt #{sale.invoiceNumber}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4" id="printableInvoice">
            {/* Printable Receipt Container */}
            <div className="border rounded-3 p-4 bg-white" style={{ maxWidth: '600px', margin: '0 auto' }}>
              {/* Receipt Header */}
              <div className="text-center pb-3 mb-3 border-bottom">
                <h4 className="fw-bold mb-1">{shop?.shopName || 'Mobile Zone Lahore'}</h4>
                <div className="text-muted small">{shop?.address || 'Shop #42, Main Boulevard, Gulberg III, Lahore'}</div>
                <div className="text-muted small">Phone: {shop?.phone || '+92 42 35789012'}</div>
                {shop?.taxNumber && <div className="text-muted small">NTN: {shop.taxNumber}</div>}
              </div>

              {/* Invoice Meta */}
              <div className="row mb-3 small">
                <div className="col-6">
                  <div><strong>Invoice #:</strong> {sale.invoiceNumber}</div>
                  <div><strong>Date:</strong> {formatDate(sale.createdAt)}</div>
                  <div><strong>Cashier:</strong> {sale.cashier?.name || 'Staff'}</div>
                </div>
                <div className="col-6 text-end">
                  <div><strong>Customer:</strong> {sale.customerName || 'Walk-in'}</div>
                  <div><strong>Payment Method:</strong> {sale.paymentMethod}</div>
                </div>
              </div>

              {/* Items Table */}
              <table className="table table-sm border-top border-bottom small mb-3">
                <thead className="table-light">
                  <tr>
                    <th>Item</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Price</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="fw-semibold">{item.name}</div>
                        {item.sku && <small className="text-muted">SKU: {item.sku}</small>}
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">{formatCurrency(item.sellingPrice)}</td>
                      <td className="text-end fw-semibold">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary Totals */}
              <div className="row justify-content-end small mb-3">
                <div className="col-6">
                  <div className="d-flex justify-content-between py-1">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(sale.subtotal)}</span>
                  </div>
                  {sale.discount > 0 && (
                    <div className="d-flex justify-content-between py-1 text-danger">
                      <span>Discount:</span>
                      <span>-{formatCurrency(sale.discount)}</span>
                    </div>
                  )}
                  {sale.tax > 0 && (
                    <div className="d-flex justify-content-between py-1">
                      <span>Tax:</span>
                      <span>+{formatCurrency(sale.tax)}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between py-1 fw-bold fs-6 border-top border-bottom">
                    <span>Grand Total:</span>
                    <span>{formatCurrency(sale.total)}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1 text-muted">
                    <span>Paid Amount:</span>
                    <span>{formatCurrency(sale.paidAmount)}</span>
                  </div>
                  {sale.dueAmount > 0 && (
                    <div className="d-flex justify-content-between py-1 fw-bold text-danger">
                      <span>Remaining Due:</span>
                      <span>{formatCurrency(sale.dueAmount)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Receipt Footer */}
              <div className="text-center pt-3 border-top small text-muted">
                <div>{shop?.receiptFooter || 'Thank you for your business!'}</div>
                <div className="fw-bold mt-1">Universal Shop Management System</div>
              </div>
            </div>
          </div>

          <div className="modal-footer bg-light border-top no-print">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={handlePrint}>
              <i className="bi bi-printer me-1"></i> Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
