import React, { useEffect, useState } from 'react';
import { userApi } from '../services/userApi';
import { useAuth } from '../context/AuthContext';

export const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Cashier',
    phone: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getUsers();
      setUsers(res.data || []);
    } catch (err) {
      setError('Failed to fetch user accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (u = null) => {
    if (u) {
      setEditingUser(u);
      setFormData({
        name: u.name,
        email: u.email,
        password: '',
        role: u.role,
        phone: u.phone || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'Cashier',
        phone: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingUser) {
        await userApi.updateUser(editingUser._id, formData);
        setSuccess('User updated successfully');
      } else {
        await userApi.createUser(formData);
        setSuccess('User created successfully');
      }
      setShowModal(false);
      loadUsers();
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser.id) {
      alert('You cannot delete your own logged-in admin account.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this user account?')) {
      try {
        await userApi.deleteUser(id);
        setSuccess('User deleted successfully');
        loadUsers();
      } catch (err) {
        setError(err.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">User & Role Management</h3>
          <p className="text-muted mb-0">Create staff accounts and enforce Role-Based Access Control (Admin, Manager, Cashier).</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => handleOpenModal()}>
          <i className="bi bi-person-plus-fill"></i> Add Staff User
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle m-0">
            <thead className="table-light">
              <tr>
                <th>User Name</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>System Role</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div> Loading user accounts...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No users found.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="fw-semibold text-dark">{u.name}</div>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone || '-'}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === 'Admin'
                            ? 'bg-danger-subtle text-danger border border-danger-subtle'
                            : u.role === 'Manager'
                            ? 'bg-warning-subtle text-dark border border-warning-subtle'
                            : 'bg-info-subtle text-info border border-info-subtle'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-success-subtle text-success border border-success-subtle">
                        {u.status || 'Active'}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => handleOpenModal(u)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(u._id)}
                          disabled={u._id === currentUser.id}
                        >
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
                  {editingUser ? 'Edit User' : 'Create Staff Account'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      {editingUser ? 'Password (Leave blank to keep unchanged)' : 'Password *'}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingUser}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold small">Role *</label>
                      <select
                        className="form-select"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="Admin">Admin (Full Access)</option>
                        <option value="Manager">Manager (Reports, Inv, Sales)</option>
                        <option value="Cashier">Cashier (POS & Sales only)</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold small">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light border-top">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Save User
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
