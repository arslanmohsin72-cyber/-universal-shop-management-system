import React, { useState, useEffect, useRef } from 'react';
import { productApi } from '../services/productApi';
import { categoryApi } from '../services/categoryApi';
import { customerApi } from '../services/customerApi';
import { salesApi } from '../services/salesApi';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { PrintInvoiceModal } from '../components/PrintInvoiceModal';

export const POSPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [completedSale, setCompletedSale] = useState(null);

  const searchInputRef = useRef(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [catRes, custRes] = await Promise.all([
        categoryApi.getCategories(),
        customerApi.getCustomers({ limit: 100 })
      ]);
      setCategories(catRes.data || []);
      setCustomers(custRes.data?.customers || []);
    } catch (err) {
      setError('Failed to load POS data');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await productApi.getProducts({
        category: selectedCategory,
        search: searchQuery,
        limit: 50
      });
      setProducts(res.data?.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Barcode / SKU quick search & add
  const handleBarcodeSearch = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      try {
        const res = await productApi.searchByCode(searchQuery.trim());
        if (res.data) {
          addToCart(res.data);
          setSearchQuery('');
        }
      } catch (err) {
        // If not exact match, let regular search filter grid
      }
    }
  };

  const addToCart = (product) => {
    if (product.stockQuantity <= 0) {
      alert(`Product '${product.name}' is out of stock!`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          alert(`Cannot add more than available stock (${product.stockQuantity})`);
          return prev;
        }
        return prev.map((item) =>
          item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, price: product.sellingPrice }];
    });
  };

  const updateQuantity = (productId, newQty) => {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.product._id === productId) {
          if (qty > item.product.stockQuantity) {
            alert(`Stock limit reached (${item.product.stockQuantity} available)`);
            return { ...item, quantity: item.product.stockQuantity };
          }
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setTax(0);
    setPaidAmount(0);
    setSelectedCustomer('');
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const grandTotal = Math.max(0, subtotal - Number(discount || 0) + Number(tax || 0));

  // Auto set paid amount when total changes if payment method is not credit
  useEffect(() => {
    if (paymentMethod !== 'Credit') {
      setPaidAmount(grandTotal);
    } else {
      setPaidAmount(0);
    }
  }, [grandTotal, paymentMethod]);

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    if (paymentMethod === 'Credit' && !selectedCustomer) {
      alert('Please select a customer for Credit sale!');
      return;
    }

    try {
      setProcessing(true);
      setError('');

      const salePayload = {
        customerId: selectedCustomer || null,
        items: cart.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          sellingPrice: item.price
        })),
        discount: Number(discount),
        tax: Number(tax),
        paidAmount: Number(paidAmount),
        paymentMethod
      };

      const res = await salesApi.processSale(salePayload);
      setCompletedSale(res.data);
      clearCart();
      loadProducts(); // refresh stock numbers
    } catch (err) {
      setError(err.message || 'Failed to complete sale');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      {error && <div className="alert alert-danger shadow-sm mb-3">{error}</div>}

      <div className="row g-3">
        {/* Left Column: Product Selection Grid */}
        <div className="col-lg-7 d-flex flex-column">
          {/* Search & Barcode Header */}
          <div className="card border-0 shadow-sm mb-3 p-3 rounded-3">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                ref={searchInputRef}
                type="text"
                className="form-control border-start-0 ps-0 fs-6"
                placeholder="Search products by name, SKU, or scan Barcode... (Press Enter to scan)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleBarcodeSearch}
              />
            </div>

            {/* Category Filter Pills */}
            <div className="d-flex gap-2 overflow-auto pb-1">
              <button
                className={`btn btn-sm rounded-pill text-nowrap ${
                  selectedCategory === '' ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`btn btn-sm rounded-pill text-nowrap ${
                    selectedCategory === cat._id ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  onClick={() => setSelectedCategory(cat._id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="card border-0 shadow-sm p-3 rounded-3 flex-grow-1 overflow-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            {products.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary"></i>
                No products found matching your search.
              </div>
            ) : (
              <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-2">
                {products.map((prod) => (
                  <div key={prod._id} className="col">
                    <div
                      className={`card h-100 border p-2 rounded-3 text-start position-relative cursor-pointer hover-shadow transition ${
                        prod.stockQuantity <= 0 ? 'opacity-50 bg-light' : 'bg-white'
                      }`}
                      style={{ cursor: prod.stockQuantity > 0 ? 'pointer' : 'not-allowed' }}
                      onClick={() => prod.stockQuantity > 0 && addToCart(prod)}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="badge bg-light text-dark border small text-truncate" style={{ maxWidth: '80%' }}>
                          {prod.category?.name || 'Item'}
                        </span>
                        <span
                          className={`badge ${
                            prod.stockQuantity <= prod.minimumStock ? 'bg-danger' : 'bg-success-subtle text-success border border-success-subtle'
                          }`}
                        >
                          Stock: {prod.stockQuantity}
                        </span>
                      </div>

                      <h6 className="fw-bold text-dark mb-1 text-truncate" title={prod.name}>
                        {prod.name}
                      </h6>
                      <small className="text-muted d-block text-truncate mb-2" style={{ fontSize: '0.75rem' }}>
                        SKU: {prod.sku}
                      </small>

                      <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                        <span className="fw-bold text-primary">{formatCurrency(prod.sellingPrice, user?.currency)}</span>
                        <button
                          className="btn btn-primary btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                          style={{ width: '28px', height: '28px' }}
                          disabled={prod.stockQuantity <= 0}
                        >
                          <i className="bi bi-plus fs-5"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: POS Cart & Checkout */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 h-100 d-flex flex-column">
            {/* Cart Header */}
            <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
              <h5 className="fw-bold m-0">
                <i className="bi bi-cart3 me-2 text-primary"></i> Current Cart ({cart.length})
              </h5>
              {cart.length > 0 && (
                <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
                  <i className="bi bi-trash me-1"></i> Clear Cart
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="card-body p-3 overflow-auto flex-grow-1" style={{ maxHeight: '350px' }}>
              {cart.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-cart-x fs-1 d-block mb-2 text-secondary"></i>
                  Cart is empty. Select products from the left to start sale.
                </div>
              ) : (
                <table className="table table-hover align-middle small m-0">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th className="text-center" style={{ width: '110px' }}>Qty</th>
                      <th className="text-end">Total</th>
                      <th className="text-center" style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.product._id}>
                        <td>
                          <div className="fw-semibold text-truncate" style={{ maxWidth: '140px' }}>{item.product.name}</div>
                          <small className="text-muted">{formatCurrency(item.price)}</small>
                        </td>
                        <td>
                          <div className="input-group input-group-sm">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              className="form-control text-center p-0"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product._id, e.target.value)}
                              min="1"
                              max={item.product.stockQuantity}
                            />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="text-end fw-bold">{formatCurrency(item.price * item.quantity)}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-link text-danger p-0 border-0"
                            onClick={() => removeFromCart(item.product._id)}
                          >
                            <i className="bi bi-x-circle fs-6"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Cart Footer: Totals & Payment Section */}
            <div className="card-footer bg-light border-top p-3">
              {/* Customer Selector */}
              <div className="mb-3">
                <label className="form-label fw-semibold small text-muted mb-1">Customer Selection</label>
                <select
                  className="form-select form-select-sm"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <option value="">Walk-in Customer</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.phone || 'No Phone'}) {c.currentBalance > 0 ? `- Due: PKR ${c.currentBalance}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Discount & Tax inputs */}
              <div className="row g-2 mb-2 small">
                <div className="col-6">
                  <label className="form-label text-muted mb-1">Discount ({user?.currency})</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-muted mb-1">Tax ({user?.currency})</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={tax}
                    onChange={(e) => setTax(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              {/* Summary Totals */}
              <div className="border-top pt-2 mb-3">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal, user?.currency)}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold fs-5 text-dark">
                  <span>Grand Total:</span>
                  <span className="text-primary">{formatCurrency(grandTotal, user?.currency)}</span>
                </div>
              </div>

              {/* Payment Method Selector Buttons */}
              <label className="form-label fw-semibold small text-muted mb-1">Payment Method</label>
              <div className="btn-group w-100 mb-3" role="group">
                {['Cash', 'Card', 'Bank Transfer', 'Credit'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`btn btn-sm ${
                      paymentMethod === method ? 'btn-primary fw-bold' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {/* Paid Amount Field if not credit */}
              {paymentMethod !== 'Credit' && (
                <div className="mb-3">
                  <label className="form-label text-muted small mb-1">Amount Paid by Customer</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    min="0"
                  />
                </div>
              )}

              {/* Complete Sale CTA */}
              <button
                className="btn btn-success w-100 py-3 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2 shadow"
                disabled={cart.length === 0 || processing}
                onClick={handleCompleteSale}
              >
                {processing ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : (
                  <i className="bi bi-check-circle-fill fs-5"></i>
                )}
                COMPLETE SALE ({formatCurrency(grandTotal, user?.currency)})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {completedSale && (
        <PrintInvoiceModal sale={completedSale} shop={user} onClose={() => setCompletedSale(null)} />
      )}
    </div>
  );
};
