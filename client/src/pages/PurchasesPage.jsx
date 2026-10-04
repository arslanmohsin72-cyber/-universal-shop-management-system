import React, { useEffect, useState } from 'react';
import { purchaseApi } from '../services/purchaseApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PurchasesPage = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  useEffect(() => {
    loadPurchases();
  }, [search]);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const res = await purchaseApi.getPurchases({ search, limit: 100 });
      setPurchases(res.data?.purchases || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Purchase Orders</h3>
          <p className="text-muted mb-0">Record wholesale stock purchases from suppliers.</p>
        </div>
        <Link to="/purchases/new" className="btn btn-primary d-flex align-items-center gap-2 fw-semibold">
          <i className="bi bi-cart-plus"></i> New Purchase Order
        </Link>
      </div>

      <div className="card border-0 shadow-sm p-3 mb-4 rounded-3">
        <div className="input-group">
          <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by purchase number or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle m-0">
            <thead className="table-light">
              <tr>
                <th>Purchase #</th>
                <th>Date</th>
                <th>Supplier</th>
                <th className="text-center">Items</th>
                <th className="text-end">Total Amount</th>
                <th className="text-end">Paid Amount</th>
                <th className="text-center">Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div> Loading purchases...
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">No purchase orders found.</td>
                </tr>
              ) : (
                purchases.map((pur) => (
                  <tr key={pur._id}>
                    <td className="fw-bold text-primary">{pur.purchaseNumber}</td>
                    <td>{formatDate(pur.createdAt)}</td>
                    <td className="fw-semibold">{pur.supplierName || pur.supplier?.name}</td>
                    <td className="text-center">{pur.items?.length || 0}</td>
                    <td className="text-end fw-bold">{formatCurrency(pur.total, user?.currency)}</td>
                    <td className="text-end">{formatCurrency(pur.paidAmount, user?.currency)}</td>
                    <td className="text-center">
                      <span className="badge bg-success-subtle text-success border border-success-subtle">
                        {pur.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-outline-primary btn-sm" onClick={() => setSelectedPurchase(pur)}>
                        <i className="bi bi-eye"></i> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchase Detail Modal */}
      {selectedPurchase && (
        <div className="modal fade show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-light border-bottom">
                <h5 className="modal-title fw-bold">Purchase Order #{selectedPurchase.purchaseNumber}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedPurchase(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row mb-3 small">
                  <div className="col-6">
                    <div><strong>Supplier:</strong> {selectedPurchase.supplierName || selectedPurchase.supplier?.name}</div>
                    <div><strong>Date:</strong> {formatDate(selectedPurchase.createdAt)}</div>
                  </div>
                  <div className="col-6 text-end">
                    <div><strong>Payment Method:</strong> {selectedPurchase.paymentMethod}</div>
                    <div><strong>Recorded By:</strong> {selectedPurchase.createdBy?.name || 'Staff'}</div>
                  </div>
                </div>

                <table className="table table-sm border small mb-3">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Cost Price</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPurchase.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end">{formatCurrency(item.purchasePrice)}</td>
                        <td className="text-end fw-bold">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="text-end fw-bold fs-6">
                  Total: {formatCurrency(selectedPurchase.total, user?.currency)}
                </div>
              </div>
              <div className="modal-footer bg-light border-top">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedPurchase(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
