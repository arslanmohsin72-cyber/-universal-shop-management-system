import React, { useEffect, useState } from 'react';
import { supplierApi } from '../services/supplierApi';
import { paymentApi } from '../services/paymentApi';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export const SuppliersPage = () => {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supForm, setSupForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    address: '',
    openingBalance: 0
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSupplierForPayment, setSelectedSupplierForPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentNote, setPaymentNote] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSuppliers();
  }, [search]);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const res = await supplierApi.getSuppliers({ search, limit: 100 });
      setSuppliers(res.data?.suppliers || []);
    } catch (err) {
      setError('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSupplierModal = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setSupForm({
        name: supplier.name,
        company: supplier.company || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || '',
        openingBalance: supplier.openingBalance || 0
      });
    } else {
      setEditingSupplier(null);
      setSupForm({
        name: '',
        company: '',
        phone: '',
        email: '',
        address: '',
        openingBalance: 0
      });
    }
    setShowSupplierModal(true);
  };

  const handleSupplierSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingSupplier) {
        await supplierApi.updateSupplier(editingSupplier._id, supForm);
        setSuccess('Supplier updated successfully');
      } else {
        await supplierApi.createSupplier(supForm);
        setSuccess('Supplier created successfully');
      }
      setShowSupplierModal(false);
      loadSuppliers();
    } catch (err) {
      setError(err.message || 'Failed to save supplier');
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await supplierApi.deleteSupplier(id);
        setSuccess('Supplier deleted successfully');
        loadSuppliers();
      } catch (err) {
        setError(err.message || 'Failed to delete supplier');
      }
    }
  };

  const handleOpenPaymentModal = (supplier) => {
    setSelectedSupplierForPayment(supplier);
    setPaymentAmount(supplier.currentBalance > 0 ? supplier.currentBalance : '');
    setPaymentMethod('Cash');
    setPaymentNote('');
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await paymentApi.recordSupplierPayment({
        supplierId: selectedSupplierForPayment._id,
        amount: Number(paymentAmount),
        paymentMethod,
        note: paymentNote
      });
      setSuccess(`Payment of ${formatCurrency(paymentAmount)} recorded for ${selectedSupplierForPayment.name}`);
      setShowPaymentModal(false);
      loadSuppliers();
    } catch (err) {
      setError(err.message || 'Failed to record supplier payment');
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Supplier Management</h3>
          <p className="text-muted mb-0">Manage wholesale vendors, payables & track stock purchases.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => handleOpenSupplierModal()}>
          <i className="bi bi-truck"></i> Add New Supplier
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm p-3 mb-4 rounded-3">
        <div className="input-group">
          <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
          <input
            type="text"
            className="form-control"
            placeholder="Search suppliers by name, company, phone..."
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
                <th>Supplier & Company</th>
                <th>Phone</th>
                <th>Email / Address</th>
                <th className="text-end">Outstanding Payable</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div> Loading suppliers...
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No suppliers found.</td>
                </tr>
              ) : (
                suppliers.map((sup) => (
                  <tr key={sup._id}>
                    <td>
                      <div className="fw-semibold text-dark">{sup.name}</div>
                      {sup.company && <small className="text-muted">{sup.company}</small>}
                    </td>
                    <td>{sup.phone || '-'}</td>
                    <td>
                      <div className="small text-dark">{sup.email || '-'}</div>
                      <small className="text-muted">{sup.address}</small>
                    </td>
                    <td className="text-end">
                      <span
                        className={`badge px-3 py-1 ${
                          sup.currentBalance > 0
                            ? 'bg-warning-subtle text-dark border border-warning-subtle fs-6'
                            : 'bg-success-subtle text-success border border-success-subtle'
                        }`}
                      >
                        {formatCurrency(sup.currentBalance, user?.currency)}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        {sup.currentBalance > 0 && (
                          <button
                            className="btn btn-success"
                            onClick={() => handleOpenPaymentModal(sup)}
                            title="Pay Supplier"
                          >
                            <i className="bi bi-wallet2 me-1"></i> Pay
                          </button>
                        )}
                        <button className="btn btn-outline-primary" onClick={() => handleOpenSupplierModal(sup)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleDeleteSupplier(sup._id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supplier Form Modal */}
      {showSupplierModal && (
        <div className="modal fade show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-light border-bottom">
                <h5 className="modal-title fw-bold">
                  {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowSupplierModal(false)}></button>
              </div>
              <form onSubmit={handleSupplierSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Supplier Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={supForm.name}
                      onChange={(e) => setSupForm({ ...supForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Company / Firm Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={supForm.company}
                      onChange={(e) => setSupForm({ ...supForm, company: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold small">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={supForm.phone}
                        onChange={(e) => setSupForm({ ...supForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold small">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={supForm.email}
                        onChange={(e) => setSupForm({ ...supForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={supForm.address}
                      onChange={(e) => setSupForm({ ...supForm, address: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Opening Payable Balance</label>
                    <input
                      type="number"
                      className="form-control"
                      value={supForm.openingBalance}
                      onChange={(e) => setSupForm({ ...supForm, openingBalance: e.target.value })}
                      disabled={!!editingSupplier}
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light border-top">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowSupplierModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Save Supplier
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Record Supplier Payment Modal */}
      {showPaymentModal && (
        <div className="modal fade show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-wallet2 me-2"></i> Pay Supplier
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPaymentModal(false)}></button>
              </div>
              <form onSubmit={handlePaymentSubmit}>
                <div className="modal-body p-4">
                  <div className="alert alert-light border mb-3">
                    <div><strong>Supplier:</strong> {selectedSupplierForPayment?.name} ({selectedSupplierForPayment?.company})</div>
                    <div><strong>Current Outstanding Payable:</strong> <span className="text-danger fw-bold">{formatCurrency(selectedSupplierForPayment?.currentBalance, user?.currency)}</span></div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Payment Amount ({user?.currency}) *</label>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      required
                      min="1"
                      max={selectedSupplierForPayment?.currentBalance}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Payment Method *</label>
                    <select
                      className="form-select"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Payment Note</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Paid stock purchase installment"
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light border-top">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success px-4 fw-bold">
                    Record Payment
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
