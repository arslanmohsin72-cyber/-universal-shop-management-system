import React, { useEffect, useState } from 'react';
import { returnApi } from '../services/returnApi';
import { salesApi } from '../services/salesApi';
import { purchaseApi } from '../services/purchaseApi';
import { formatCurrency, formatDate } from '../utils/formatters';

export const ReturnsPage = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('list'); // 'list', 'saleReturn', 'purchaseReturn'
  const [searchInvoice, setSearchInvoice] = useState('');
  const [foundSale, setFoundSale] = useState(null);
  const [saleReturnItems, setSaleReturnItems] = useState({});
  const [saleReason, setSaleReason] = useState('');
  const [saleRefundMethod, setSaleRefundMethod] = useState('Cash');

  const [searchPurchase, setSearchPurchase] = useState('');
  const [foundPurchase, setFoundPurchase] = useState(null);
  const [purchaseReturnItems, setPurchaseReturnItems] = useState({});
  const [purchaseReason, setPurchaseReason] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadReturns();
  }, []);

  const loadReturns = async () => {
    try {
      setLoading(true);
      const res = await returnApi.getReturns({ limit: 100 });
      setReturns(res.data?.returns || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSale = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await salesApi.getSaleByInvoice(searchInvoice.trim());
      setFoundSale(res.data);
      const initItems = {};
      res.data.items.forEach((item) => {
        initItems[item.product._id || item.product] = 0;
      });
      setSaleReturnItems(initItems);
    } catch (err) {
      setError(err.message || 'Invoice not found');
      setFoundSale(null);
    }
  };

  const handleProcessSaleReturn = async (e) => {
    e.preventDefault();
    const returnPayloadItems = Object.entries(saleReturnItems)
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([productId, qty]) => ({ productId, quantity: Number(qty) }));

    if (returnPayloadItems.length === 0) {
      alert('Please select at least one item quantity to return');
      return;
    }

    try {
      setError('');
      await returnApi.processSaleReturn({
        saleId: foundSale._id,
        items: returnPayloadItems,
        reason: saleReason || 'Customer Return',
        refundMethod: saleRefundMethod
      });
      setSuccess('Sale return processed successfully and inventory restored!');
      setFoundSale(null);
      setActiveTab('list');
      loadReturns();
    } catch (err) {
      setError(err.message || 'Failed to process sale return');
    }
  };

  const handleSearchPurchase = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await purchaseApi.getPurchases({ search: searchPurchase.trim() });
      const p = res.data?.purchases?.[0];
      if (!p) throw new Error('Purchase order not found');
      setFoundPurchase(p);
      const initItems = {};
      p.items.forEach((item) => {
        initItems[item.product._id || item.product] = 0;
      });
      setPurchaseReturnItems(initItems);
    } catch (err) {
      setError(err.message || 'Purchase order not found');
      setFoundPurchase(null);
    }
  };

  const handleProcessPurchaseReturn = async (e) => {
    e.preventDefault();
    const returnPayloadItems = Object.entries(purchaseReturnItems)
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([productId, qty]) => ({ productId, quantity: Number(qty) }));

    if (returnPayloadItems.length === 0) {
      alert('Please select at least one item quantity to return to supplier');
      return;
    }

    try {
      setError('');
      await returnApi.processPurchaseReturn({
        purchaseId: foundPurchase._id,
        items: returnPayloadItems,
        reason: purchaseReason || 'Supplier Defect Return',
        refundMethod: 'Cash'
      });
      setSuccess('Purchase return processed successfully and stock deducted!');
      setFoundPurchase(null);
      setActiveTab('list');
      loadReturns();
    } catch (err) {
      setError(err.message || 'Failed to process purchase return');
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Returns Management</h3>
          <p className="text-muted mb-0">Process customer sales returns & supplier purchase returns.</p>
        </div>
        <div className="btn-group">
          <button
            className={`btn btn-sm ${activeTab === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('list')}
          >
            Return Logs
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'saleReturn' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('saleReturn')}
          >
            + Process Sale Return
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'purchaseReturn' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('purchaseReturn')}
          >
            + Process Purchase Return
          </button>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Tab 1: Return Logs */}
      {activeTab === 'list' && (
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle m-0">
              <thead className="table-light">
                <tr>
                  <th>Return #</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Ref Invoice / Purchase</th>
                  <th>Party</th>
                  <th className="text-end">Total Refunded</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div> Loading return history...
                    </td>
                  </tr>
                ) : returns.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">No returns recorded yet.</td>
                  </tr>
                ) : (
                  returns.map((ret) => (
                    <tr key={ret._id}>
                      <td className="fw-bold text-primary">{ret.returnNumber}</td>
                      <td>
                        <span
                          className={`badge ${
                            ret.type === 'SaleReturn'
                              ? 'bg-info-subtle text-info border border-info-subtle'
                              : 'bg-warning-subtle text-warning border border-warning-subtle'
                          }`}
                        >
                          {ret.type}
                        </span>
                      </td>
                      <td>{formatDate(ret.createdAt)}</td>
                      <td className="fw-mono small">{ret.originalInvoiceOrPurchaseNumber}</td>
                      <td>{ret.customer?.name || ret.supplier?.name || '-'}</td>
                      <td className="text-end fw-bold">{formatCurrency(ret.totalAmount)}</td>
                      <td><small className="text-muted">{ret.reason}</small></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Sale Return Workflow */}
      {activeTab === 'saleReturn' && (
        <div className="card border-0 shadow-sm p-4 rounded-3">
          <h5 className="fw-bold mb-3">Process Customer Sales Return</h5>

          <form onSubmit={handleSearchSale} className="row g-2 mb-4">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Invoice Number (e.g. INV-2026-0001)..."
                value={searchInvoice}
                onChange={(e) => setSearchInvoice(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <button type="submit" className="btn btn-primary w-100 fw-semibold">
                <i className="bi bi-search me-1"></i> Find Invoice
              </button>
            </div>
          </form>

          {foundSale && (
            <form onSubmit={handleProcessSaleReturn} className="border-top pt-3">
              <div className="alert alert-light border mb-3">
                <div><strong>Invoice #:</strong> {foundSale.invoiceNumber}</div>
                <div><strong>Customer:</strong> {foundSale.customerName}</div>
                <div><strong>Total Paid:</strong> {formatCurrency(foundSale.paidAmount)}</div>
              </div>

              <h6 className="fw-bold mb-2">Select Items to Return & Restock:</h6>
              <div className="table-responsive border rounded mb-3">
                <table className="table table-sm align-middle m-0">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th className="text-center">Sold Qty</th>
                      <th className="text-end">Unit Price</th>
                      <th style={{ width: '120px' }}>Return Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foundSale.items.map((item) => {
                      const prodId = item.product._id || item.product;
                      return (
                        <tr key={prodId}>
                          <td>{item.name}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">{formatCurrency(item.sellingPrice)}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm text-center"
                              min="0"
                              max={item.quantity}
                              value={saleReturnItems[prodId] || 0}
                              onChange={(e) =>
                                setSaleReturnItems({
                                  ...saleReturnItems,
                                  [prodId]: Math.min(item.quantity, Number(e.target.value))
                                })
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Refund Method</label>
                  <select
                    className="form-select"
                    value={saleRefundMethod}
                    onChange={(e) => setSaleRefundMethod(e.target.value)}
                  >
                    <option value="Cash">Cash Refund</option>
                    <option value="Credit Adjustment">Credit Adjustment (Reduce Due)</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Return Reason *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Defective piece, wrong model"
                    value={saleReason}
                    onChange={(e) => setSaleReason(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-danger w-100 py-2 fw-bold">
                Confirm & Refund Sale Return
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab 3: Purchase Return Workflow */}
      {activeTab === 'purchaseReturn' && (
        <div className="card border-0 shadow-sm p-4 rounded-3">
          <h5 className="fw-bold mb-3">Process Supplier Purchase Return</h5>

          <form onSubmit={handleSearchPurchase} className="row g-2 mb-4">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Purchase Order # (e.g. PUR-171...)..."
                value={searchPurchase}
                onChange={(e) => setSearchPurchase(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <button type="submit" className="btn btn-primary w-100 fw-semibold">
                <i className="bi bi-search me-1"></i> Find Purchase
              </button>
            </div>
          </form>

          {foundPurchase && (
            <form onSubmit={handleProcessPurchaseReturn} className="border-top pt-3">
              <div className="alert alert-light border mb-3">
                <div><strong>Purchase #:</strong> {foundPurchase.purchaseNumber}</div>
                <div><strong>Supplier:</strong> {foundPurchase.supplierName || foundPurchase.supplier?.name}</div>
              </div>

              <h6 className="fw-bold mb-2">Select Items to Return to Supplier:</h6>
              <div className="table-responsive border rounded mb-3">
                <table className="table table-sm align-middle m-0">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th className="text-center">Purchased Qty</th>
                      <th className="text-end">Cost Price</th>
                      <th style={{ width: '120px' }}>Return Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foundPurchase.items.map((item) => {
                      const prodId = item.product._id || item.product;
                      return (
                        <tr key={prodId}>
                          <td>{item.name}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">{formatCurrency(item.purchasePrice)}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm text-center"
                              min="0"
                              max={item.quantity}
                              value={purchaseReturnItems[prodId] || 0}
                              onChange={(e) =>
                                setPurchaseReturnItems({
                                  ...purchaseReturnItems,
                                  [prodId]: Math.min(item.quantity, Number(e.target.value))
                                })
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Return Reason *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Damaged stock in shipment"
                  value={purchaseReason}
                  onChange={(e) => setPurchaseReason(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-danger w-100 py-2 fw-bold">
                Confirm Purchase Return & Deduct Stock
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
