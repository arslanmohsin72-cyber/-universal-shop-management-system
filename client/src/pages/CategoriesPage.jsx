import React, { useEffect, useState } from 'react';
import { categoryApi } from '../services/categoryApi';
import { useAuth } from '../context/AuthContext';

export const CategoriesPage = () => {
  const { isManager } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCategories();
  }, [search]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getCategories({ search });
      setCategories(res.data || []);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setDescription(category.description || '');
    } else {
      setEditingCategory(null);
      setName('');
      setDescription('');
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingCategory) {
        await categoryApi.updateCategory(editingCategory._id, { name, description });
        setSuccess('Category updated successfully');
      } else {
        await categoryApi.createCategory({ name, description });
        setSuccess('Category created successfully');
      }
      setShowModal(false);
      loadCategories();
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryApi.deleteCategory(id);
        setSuccess('Category deleted successfully');
        loadCategories();
      } catch (err) {
        setError(err.message || 'Failed to delete category');
      }
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Categories</h3>
          <p className="text-muted mb-0">Organize your shop products into clean categories.</p>
        </div>
        {isManager && (
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => handleOpenModal()}>
            <i className="bi bi-plus-lg"></i> Add Category
          </button>
        )}
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm p-3 mb-4 rounded-3">
        <div className="input-group">
          <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
          <input
            type="text"
            className="form-control"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-3">
        {loading ? (
          <div className="col-12 text-center py-4">
            <div className="spinner-border spinner-border-sm text-primary"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-12 text-center py-4 text-muted">No categories created yet.</div>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="col">
              <div className="card border-0 shadow-sm h-100 rounded-3">
                <div className="card-body p-3 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold text-dark mb-0">{cat.name}</h5>
                    <span className="badge bg-success-subtle text-success border border-success-subtle">
                      Active
                    </span>
                  </div>
                  <p className="text-muted small flex-grow-1">{cat.description || 'No description provided.'}</p>
                  {isManager && (
                    <div className="border-top pt-2 d-flex justify-content-end gap-2">
                      <button className="btn btn-outline-primary btn-sm" onClick={() => handleOpenModal(cat)}>
                        <i className="bi bi-pencil me-1"></i> Edit
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(cat._id)}>
                        <i className="bi bi-trash me-1"></i> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal fade show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-light border-bottom">
                <h5 className="modal-title fw-bold">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Category Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light border-top">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Save Category
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
