import React, { useEffect, useState } from 'react';
import { customerApi } from '../services/customerApi';
import { paymentApi } from '../services/paymentApi';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export const CustomersPage = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [custForm, setCustForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    openingBalance: 0,
    creditLimit: 50000
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCustomerForPayment, setSelectedCustomerForPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentNote, setPaymentNote] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await customerApi.getCustomers({ search, limit: 100 });
      setCustomers(res.data?.customers || []);
    } catch (err) {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCustomerModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setCustForm({
        name: customer.name,
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        openingBalance: customer.openingBalance || 0,
        creditLimit: customer.creditLimit || 50000
      });
    } else {
      setEditingCustomer(null);
      setCustForm({
        name: '',
        phone: '',
        email: '',
        address: '',
        openingBalance: 0,
        creditLimit: 50000
      });
    }
    setShowCustomerModal(true);
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingCustomer) {
        await customerApi.updateCustomer(editingCustomer._id, custForm);
        setSuccess('Customer updated successfully');
      } else {
        await customerApi.createCustomer(custForm);
        setSuccess('Customer created successfully');
      }
      setShowCustomerModal(false);
      loadCustomers();
    } catch (err) {
      setError(err.message || 'Failed to save customer');
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerApi.deleteCustomer(id);
        setSuccess('Customer deleted successfully');
        loadCustomers();
      } catch (err) {
        setError(err.message || 'Failed to delete customer');
      }
    }
  };

  const handleOpenPaymentModal = (customer) => {
    setSelectedCustomerForPayment(customer);
    setPaymentAmount(customer.currentBalance > 0 ? customer.currentBalance : '');
    setPaymentMethod('Cash');
    setPaymentNote('');
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await paymentApi.recordCustomerPayment({
        customerId: selectedCustomerForPayment._id,
        amount: Number(paymentAmount),
        paymentMethod,
        note: paymentNote
      });
      setSuccess(`Payment of ${formatCurrency(paymentAmount)} recorded for ${selectedCustomerForPayment.name}`);
      setShowPaymentModal(false);
      loadCustomers();
    } catch (err) {
      setError(err.message || 'Failed to record payment');
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Customer Management</h3>
          <p className="text-muted mb-0">Manage customer records, credit balances & receive payments.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => handleOpenCustomerModal()}>
          <i className="bi bi-person-plus"></i> Add New Customer
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
            placeholder="Search customers by name, phone, email..."
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
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Email / Address</th>
                <th className="text-end">Credit Limit</th>
                <th className="text-end">Current Credit Due</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div> Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No customers found.</td>
                </tr>
              ) : (
                customers.map((cust) => (
                  <tr key={cust._id}>
                    <td>
                      <div className="fw-semibold text-dark">{cust.name}</div>
                    </td>
                    <td>{cust.phone || '-'}</td>
                    <td>
                      <div className="small text-dark">{cust.email || '-'}</div>
                      <small className="text-muted">{cust.address}</small>
                    </td>
                    <td className="text-end">{formatCurrency(cust.creditLimit, user?.currency)}</td>
                    <td className="text-end">
                      <span
                        className={`badge px-3 py-1 ${
                          cust.currentBalance > 0
                            ? 'bg-danger-subtle text-danger border border-danger-subtle fs-6'
                            : 'bg-success-subtle text-success border border-success-subtle'
                        }`}
                      >
                        {formatCurrency(cust.currentBalance, user?.currency)}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        {cust.currentBalance > 0 && (
                          <button
                            className="btn btn-success"
                            onClick={() => handleOpenPaymentModal(cust)}
                            title="Receive Payment"
                          >
                            <i className="bi bi-cash-coin me-1"></i> Pay
                          </button>
                        )}
                        <button className="btn btn-outline-primary" onClick={() => handleOpenCustomerModal(cust)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleDeleteCustomer(cust._id)}>
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

      {/* Customer Form Modal */}
      {showCustomerModal && (
        <div className="modal fade show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-light border-bottom">
                <h5 className="modal-title fw-bold">
                  {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowCustomerModal(false)}></button>
              </div>
              <form onSubmit={handleCustomerSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Customer Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={custForm.name}
                      onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold small">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={custForm.phone}
                        onChange={(e) => setCustForm({ ...custForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold small">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={custForm.email}
                        onChange={(e) => setCustForm({ ...custForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={custForm.address}
                      onChange={(e) => setCustForm({ ...custForm, address: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold small">Opening Credit Balance</label>
                      <input
                        type="number"
                        className="form-control"
                        value={custForm.openingBalance}
                        onChange={(e) => setCustForm({ ...custForm, openingBalance: e.target.value })}
                        disabled={!!editingCustomer}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold small">Credit Limit ({user?.currency})</label>
                      <input
                        type="number"
                        className="form-control"
                        value={custForm.creditLimit}
                        onChange={(e) => setCustForm({ ...custForm, creditLimit: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light border-top">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCustomerModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Save Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="modal fade show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-cash-coin me-2"></i> Receive Customer Payment
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPaymentModal(false)}></button>
              </div>
              <form onSubmit={handlePaymentSubmit}>
                <div className="modal-body p-4">
                  <div className="alert alert-light border mb-3">
                    <div><strong>Customer:</strong> {selectedCustomerForPayment?.name}</div>
                    <div><strong>Current Outstanding Due:</strong> <span className="text-danger fw-bold">{formatCurrency(selectedCustomerForPayment?.currentBalance, user?.currency)}</span></div>
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
                      max={selectedCustomerForPayment?.currentBalance}
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
                      placeholder="e.g. Received partial cash repayment"
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
