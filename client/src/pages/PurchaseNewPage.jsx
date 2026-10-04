import React, { useEffect, useState } from 'react';
import { purchaseApi } from '../services/purchaseApi';
import { supplierApi } from '../services/supplierApi';
import { productApi } from '../services/productApi';
import { formatCurrency } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PurchaseNewPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [supplierId, setSupplierId] = useState('');
  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [supRes, prodRes] = await Promise.all([
        supplierApi.getSuppliers({ limit: 100 }),
        productApi.getProducts({ limit: 200 })
      ]);
      setSuppliers(supRes.data?.suppliers || []);
      setProducts(prodRes.data?.products || []);
    } catch (err) {
      setError('Failed to load purchase options');
    }
  };

  const handleAddItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) => (i.productId === product._id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { productId: product._id, name: product.name, purchasePrice: product.purchasePrice, quantity: 1 }];
    });
  };

  const updateItem = (productId, field, value) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, [field]: Number(value) } : i))
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const subtotal = items.reduce((acc, i) => acc + i.purchasePrice * i.quantity, 0);
  const grandTotal = Math.max(0, subtotal - Number(discount || 0) + Number(tax || 0));

  useEffect(() => {
    if (paymentMethod !== 'Credit') {
      setPaidAmount(grandTotal);
    } else {
      setPaidAmount(0);
    }
  }, [grandTotal, paymentMethod]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supplierId) {
      alert('Please select a supplier');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await purchaseApi.createPurchase({
        supplierId,
        items,
        discount: Number(discount),
        tax: Number(tax),
        paidAmount: Number(paidAmount),
        paymentMethod
      });
      navigate('/purchases');
    } catch (err) {
      setError(err.message || 'Failed to complete purchase order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Create Purchase Order</h3>
          <p className="text-muted mb-0">Record incoming stock and automatically increment product inventory.</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/purchases')}>
          Back to Purchases
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        {/* Item Selector Grid */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-3 rounded-3 h-100">
            <h5 className="fw-bold mb-3">Select Products to Purchase</h5>
            <div className="overflow-auto" style={{ maxHeight: '500px' }}>
              <div className="list-group">
                {products.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    onClick={() => handleAddItem(p)}
                  >
                    <div>
                      <div className="fw-semibold">{p.name}</div>
                      <small className="text-muted">SKU: {p.sku} | Stock: {p.stockQuantity}</small>
                    </div>
                    <span className="badge bg-primary rounded-pill">
                      Cost: {formatCurrency(p.purchasePrice, user?.currency)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Order Summary Form */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 rounded-3">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Supplier *</label>
                <select
                  className="form-select"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  required
                >
                  <option value="">Select Supplier...</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.company})
                    </option>
                  ))}
                </select>
              </div>

              {/* Items List */}
              <label className="form-label fw-semibold">Order Items ({items.length})</label>
              <div className="table-responsive border rounded mb-3" style={{ maxHeight: '250px' }}>
                <table className="table table-sm align-middle m-0">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th style={{ width: '90px' }}>Cost</th>
                      <th style={{ width: '80px' }}>Qty</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-3 text-muted">No items added yet.</td>
                      </tr>
                    ) : (
                      items.map((i) => (
                        <tr key={i.productId}>
                          <td><small className="fw-semibold">{i.name}</small></td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm p-1"
                              value={i.purchasePrice}
                              onChange={(e) => updateItem(i.productId, 'purchasePrice', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm p-1"
                              value={i.quantity}
                              onChange={(e) => updateItem(i.productId, 'quantity', e.target.value)}
                              min="1"
                            />
                          </td>
                          <td className="fw-bold">{formatCurrency(i.purchasePrice * i.quantity)}</td>
                          <td>
                            <button className="btn btn-link text-danger p-0 border-0" onClick={() => removeItem(i.productId)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary Inputs */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small">Discount ({user?.currency})</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small">Tax ({user?.currency})</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={tax}
                    onChange={(e) => setTax(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between fw-bold fs-5 mb-3 border-top pt-2">
                <span>Grand Total:</span>
                <span className="text-primary">{formatCurrency(grandTotal, user?.currency)}</span>
              </div>

              <div className="row g-2 mb-4">
                <div className="col-6">
                  <label className="form-label small">Payment Method</label>
                  <select
                    className="form-select form-select-sm"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit">Credit (Pay Later)</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small">Amount Paid</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 py-2 fw-bold"
                disabled={submitting || items.length === 0}
              >
                {submitting ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check-circle me-2"></i>}
                Submit Purchase Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
