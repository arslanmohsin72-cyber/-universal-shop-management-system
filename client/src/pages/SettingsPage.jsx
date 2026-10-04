import React, { useEffect, useState } from 'react';
import { shopApi } from '../services/shopApi';
import { useAuth } from '../context/AuthContext';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    shopName: '',
    shopType: 'Mobile Shop',
    phone: '',
    email: '',
    address: '',
    city: 'Lahore',
    country: 'Pakistan',
    currency: 'PKR',
    taxNumber: '',
    receiptFooter: 'Thank you for your business!',
    lowStockThreshold: 5,
    allowNegativeStock: false
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadShopSettings();
  }, []);

  const loadShopSettings = async () => {
    try {
      setLoading(true);
      const res = await shopApi.getSettings();
      if (res.data) {
        setFormData({
          shopName: res.data.shopName || '',
          shopType: res.data.shopType || 'Mobile Shop',
          phone: res.data.phone || '',
          email: res.data.email || '',
          address: res.data.address || '',
          city: res.data.city || 'Lahore',
          country: res.data.country || 'Pakistan',
          currency: res.data.currency || 'PKR',
          taxNumber: res.data.taxNumber || '',
          receiptFooter: res.data.receiptFooter || 'Thank you for your business!',
          lowStockThreshold: res.data.lowStockThreshold || 5,
          allowNegativeStock: res.data.allowNegativeStock || false
        });
      }
    } catch (err) {
      setError('Failed to load shop settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await shopApi.updateSettings(formData);
      setSuccess('Shop settings updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update settings');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Shop Settings & Configuration</h3>
          <p className="text-muted mb-0">Customize shop profile, currency, receipt footer, and inventory rules.</p>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm p-4 rounded-3">
        <form onSubmit={handleSubmit}>
          <h5 className="fw-bold mb-3 border-bottom pb-2 text-primary">Basic Shop Details</h5>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Shop Name *</label>
              <input
                type="text"
                className="form-control"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold small">Universal Shop Type *</label>
              <select
                className="form-select"
                value={formData.shopType}
                onChange={(e) => setFormData({ ...formData, shopType: e.target.value })}
                required
              >
                {[
                  'Mobile Shop',
                  'Grocery Store',
                  'Pharmacy',
                  'Clothing Store',
                  'Electronics Shop',
                  'Cosmetics Shop',
                  'Stationery Shop',
                  'Bakery',
                  'Hardware Shop',
                  'Other'
                ].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold small">Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold small">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold small">Tax NTN Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.taxNumber}
                onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label fw-semibold small">Store Address</label>
              <input
                type="text"
                className="form-control"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <h5 className="fw-bold mb-3 border-bottom pb-2 text-primary">Localization & Receipt Options</h5>

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label fw-semibold small">City</label>
              <input
                type="text"
                className="form-control"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold small">Country</label>
              <input
                type="text"
                className="form-control"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold small">Currency Code</label>
              <input
                type="text"
                className="form-control"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label fw-semibold small">Print Receipt Footer Message</label>
              <input
                type="text"
                className="form-control"
                value={formData.receiptFooter}
                onChange={(e) => setFormData({ ...formData, receiptFooter: e.target.value })}
              />
            </div>
          </div>

          <h5 className="fw-bold mb-3 border-bottom pb-2 text-primary">Inventory Controls</h5>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Low Stock Alert Threshold</label>
              <input
                type="number"
                className="form-control"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                min="1"
              />
            </div>
            <div className="col-md-6 d-flex align-items-center">
              <div className="form-check form-switch pt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="allowNegativeStockSwitch"
                  checked={formData.allowNegativeStock}
                  onChange={(e) => setFormData({ ...formData, allowNegativeStock: e.target.checked })}
                />
                <label className="form-check-label fw-semibold" htmlFor="allowNegativeStockSwitch">
                  Allow Negative Stock Sales (Default: Disabled)
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary px-5 py-2 fw-bold">
            <i className="bi bi-save me-2"></i> Save Shop Settings
          </button>
        </form>
      </div>
    </div>
  );
};
