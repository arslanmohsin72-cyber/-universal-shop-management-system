import React, { useEffect, useState } from 'react';
import { expenseApi } from '../services/expenseApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export const ExpensesPage = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Other',
    amount: '',
    paymentMethod: 'Cash',
    description: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadExpenses();
  }, [search, selectedCategory]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const res = await expenseApi.getExpenses({
        search,
        category: selectedCategory,
        limit: 100
      });
      setExpenses(res.data?.expenses || []);
    } catch (err) {
      setError('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        title: expense.title,
        category: expense.category,
        amount: expense.amount,
        paymentMethod: expense.paymentMethod,
        description: expense.description || ''
      });
    } else {
      setEditingExpense(null);
      setFormData({
        title: '',
        category: 'Rent',
        amount: '',
        paymentMethod: 'Cash',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingExpense) {
        await expenseApi.updateExpense(editingExpense._id, formData);
        setSuccess('Expense updated successfully');
      } else {
        await expenseApi.createExpense(formData);
        setSuccess('Expense added successfully');
      }
      setShowModal(false);
      loadExpenses();
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense entry?')) {
      try {
        await expenseApi.deleteExpense(id);
        setSuccess('Expense deleted successfully');
        loadExpenses();
      } catch (err) {
        setError(err.message || 'Failed to delete expense');
      }
    }
  };

  const totalExpenseAmount = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Expense Management</h3>
          <p className="text-muted mb-0">Record shop operating costs (Rent, Electricity, Salaries, Internet).</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2 fw-semibold" onClick={() => handleOpenModal()}>
          <i className="bi bi-plus-lg"></i> Record Expense
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 rounded-3 border-start border-4 border-warning">
            <span className="text-muted small fw-semibold text-uppercase">Total Filtered Expenses</span>
            <h4 className="fw-bold text-dark my-1">{formatCurrency(totalExpenseAmount, user?.currency)}</h4>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm p-3 mb-4 rounded-3">
        <div className="row g-2">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search expense title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Expense Categories</option>
              {['Rent', 'Electricity', 'Internet', 'Salary', 'Transport', 'Repair', 'Marketing', 'Office Supplies', 'Other'].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle m-0">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th className="text-end">Amount</th>
                <th>Description</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div> Loading expenses...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">No expenses recorded.</td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp._id}>
                    <td className="fw-semibold text-dark">{exp.title}</td>
                    <td>
                      <span className="badge bg-warning-subtle text-dark border border-warning-subtle">
                        {exp.category}
                      </span>
                    </td>
                    <td>{formatDate(exp.date)}</td>
                    <td><small>{exp.paymentMethod}</small></td>
                    <td className="text-end fw-bold text-danger">{formatCurrency(exp.amount, user?.currency)}</td>
                    <td><small className="text-muted">{exp.description || '-'}</small></td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => handleOpenModal(exp)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(exp._id)}>
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

      {showModal && (
        <div className="modal fade show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-light border-bottom">
                <h5 className="modal-title fw-bold">
                  {editingExpense ? 'Edit Expense' : 'Record Expense'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Expense Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold small">Category *</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {['Rent', 'Electricity', 'Internet', 'Salary', 'Transport', 'Repair', 'Marketing', 'Office Supplies', 'Other'].map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold small">Amount ({user?.currency}) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Payment Method</label>
                    <select
                      className="form-select"
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Description / Notes</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light border-top">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Save Expense
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
