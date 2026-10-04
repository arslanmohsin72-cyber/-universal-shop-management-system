import React, { useEffect, useState } from 'react';
import { inventoryApi } from '../services/inventoryApi';
import { productApi } from '../services/productApi';
import { formatDate } from '../utils/formatters';

export const InventoryPage = () => {
  const [logs, setLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [type, setType] = useState('Stock In');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProducts();
    loadLogs();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await productApi.getProducts({ limit: 200 });
      setProducts(res.data?.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getLogs({ limit: 100 });
      setLogs(res.data?.logs || []);
    } catch (err) {
      setError('Failed to fetch inventory logs');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await inventoryApi.adjustStock({
        productId: selectedProduct,
        type,
        quantity: Number(quantity),
        reason
      });
      setSuccess('Stock adjusted successfully');
      setShowModal(false);
      setSelectedProduct('');
      setQuantity('');
      setReason('');
      loadLogs();
      loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to adjust stock');
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Inventory Management</h3>
          <p className="text-muted mb-0">Track stock movements, stock-in, stock-out & manual adjustments.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-sliders"></i> Adjust Product Stock
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="card-header bg-white py-3 border-bottom">
          <h5 className="fw-bold m-0"><i className="bi bi-journal-text me-2 text-primary"></i> Stock Movement History</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle m-0">
            <thead className="table-light">
              <tr>
                <th>Date & Time</th>
                <th>Product</th>
                <th>Movement Type</th>
                <th className="text-center">Qty Changed</th>
                <th className="text-center">Prev Stock</th>
                <th className="text-center">New Stock</th>
                <th>Reason / Ref</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div> Loading logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">No stock logs recorded yet.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id}>
                    <td>{formatDate(log.createdAt)}</td>
                    <td className="fw-semibold">{log.product?.name || 'Deleted Product'}</td>
                    <td>
                      <span
                        className={`badge ${
                          log.type === 'Stock In' || log.type === 'Purchase'
                            ? 'bg-success-subtle text-success border border-success-subtle'
                            : log.type === 'Sale' || log.type === 'Stock Out'
                            ? 'bg-danger-subtle text-danger border border-danger-subtle'
                            : 'bg-primary-subtle text-primary border border-primary-subtle'
                        }`}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td className="text-center fw-bold">{log.quantity}</td>
                    <td className="text-center text-muted">{log.previousStock}</td>
                    <td className="text-center fw-bold text-dark">{log.newStock}</td>
                    <td>
                      <small className="text-muted">{log.reason || log.referenceId || '-'}</small>
                    </td>
                    <td><small>{log.createdBy?.name || 'System'}</small></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {showModal && (
        <div className="modal fade show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-light border-bottom">
                <h5 className="modal-title fw-bold">Manual Stock Adjustment</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleAdjustSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Select Product *</label>
                    <select
                      className="form-select"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      required
                    >
                      <option value="">Choose a product...</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} (Current Stock: {p.stockQuantity} {p.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold small">Adjustment Type *</label>
                      <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="Stock In">Stock In (Add)</option>
                        <option value="Stock Out">Stock Out (Deduct)</option>
                        <option value="Adjustment">Adjustment (Set Exact)</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold small">Quantity *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Reason / Note</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Damaged item removal, inventory recount"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light border-top">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Save Adjustment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
