import React, { useEffect, useState } from 'react';
import { productApi } from '../services/productApi';
import { categoryApi } from '../services/categoryApi';
import { supplierApi } from '../services/supplierApi';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export const ProductsPage = () => {
  const { user, isManager } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: '',
    brand: '',
    purchasePrice: '',
    sellingPrice: '',
    wholesalePrice: '',
    stockQuantity: '',
    minimumStock: 5,
    unit: 'pcs',
    supplier: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCategoriesAndSuppliers();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [search, selectedCategory, lowStockFilter]);

  const loadCategoriesAndSuppliers = async () => {
    try {
      const [catRes, supRes] = await Promise.all([
        categoryApi.getCategories(),
        supplierApi.getSuppliers({ limit: 100 })
      ]);
      setCategories(catRes.data || []);
      setSuppliers(supRes.data?.suppliers || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await productApi.getProducts({
        search,
        category: selectedCategory,
        lowStock: lowStockFilter,
        limit: 100
      });
      setProducts(res.data?.products || []);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku,
        barcode: product.barcode || '',
        category: product.category?._id || product.category || '',
        brand: product.brand || '',
        purchasePrice: product.purchasePrice,
        sellingPrice: product.sellingPrice,
        wholesalePrice: product.wholesalePrice || '',
        stockQuantity: product.stockQuantity,
        minimumStock: product.minimumStock || 5,
        unit: product.unit || 'pcs',
        supplier: product.supplier?._id || product.supplier || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        sku: `SKU-${Date.now().toString().slice(-6)}`,
        barcode: '',
        category: categories[0]?._id || '',
        brand: '',
        purchasePrice: '',
        sellingPrice: '',
        wholesalePrice: '',
        stockQuantity: 0,
        minimumStock: 5,
        unit: 'pcs',
        supplier: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingProduct) {
        await productApi.updateProduct(editingProduct._id, formData);
        setSuccess('Product updated successfully');
      } else {
        await productApi.createProduct(formData);
        setSuccess('Product created successfully');
      }
      setShowModal(false);
      loadProducts();
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productApi.deleteProduct(id);
        setSuccess('Product deleted successfully');
        loadProducts();
      } catch (err) {
        setError(err.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Product Management</h3>
          <p className="text-muted mb-0">View, search, and manage store product inventory.</p>
        </div>
        {isManager && (
          <button className="btn btn-primary d-flex align-items-center gap-2 fw-semibold" onClick={() => handleOpenModal()}>
            <i className="bi bi-plus-lg"></i> Add New Product
          </button>
        )}
      </div>

      {success && <div className="alert alert-success alert-dismissible fade show">{success}</div>}
      {error && <div className="alert alert-danger alert-dismissible fade show">{error}</div>}

      {/* Filter Toolbar */}
      <div className="card border-0 shadow-sm p-3 mb-4 rounded-3">
        <div className="row g-2 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, SKU, barcode..."
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
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <div className="form-check form-switch pt-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="lowStockToggle"
                checked={lowStockFilter}
                onChange={(e) => setLowStockFilter(e.target.checked)}
              />
              <label className="form-check-label fw-semibold text-muted" htmlFor="lowStockToggle">
                Low Stock Only
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle m-0">
            <thead className="table-light">
              <tr>
                <th>Product Name</th>
                <th>SKU / Barcode</th>
                <th>Category</th>
                <th className="text-end">Cost Price</th>
                <th className="text-end">Selling Price</th>
                <th className="text-center">Stock</th>
                {isManager && <th className="text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div> Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <div className="fw-semibold text-dark">{prod.name}</div>
                      {prod.brand && <small className="text-muted">{prod.brand}</small>}
                    </td>
                    <td>
                      <div className="fw-mono small">{prod.sku}</div>
                      {prod.barcode && <small className="text-muted">{prod.barcode}</small>}
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {prod.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="text-end">{formatCurrency(prod.purchasePrice, user?.currency)}</td>
                    <td className="text-end fw-semibold text-primary">{formatCurrency(prod.sellingPrice, user?.currency)}</td>
                    <td className="text-center">
                      <span
                        className={`badge px-3 py-1 ${
                          prod.stockQuantity <= prod.minimumStock
                            ? 'bg-danger-subtle text-danger border border-danger-subtle'
                            : 'bg-success-subtle text-success border border-success-subtle'
                        }`}
                      >
                        {prod.stockQuantity} {prod.unit}
                      </span>
                    </td>
                    {isManager && (
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary" onClick={() => handleOpenModal(prod)} title="Edit">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-outline-danger" onClick={() => handleDelete(prod._id)} title="Delete">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {showModal && (
        <div className="modal fade show d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-light border-bottom">
                <h5 className="modal-title fw-bold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label fw-semibold small">Product Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Category *</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">SKU *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Barcode</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.barcode}
                        onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Brand</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Purchase Cost Price *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.purchasePrice}
                        onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                        required
                        min="0"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Selling Price *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.sellingPrice}
                        onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                        required
                        min="0"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Wholesale Price</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.wholesalePrice}
                        onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                        min="0"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Initial Stock Qty</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                        disabled={!!editingProduct}
                        min="0"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Minimum Alert Threshold</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.minimumStock}
                        onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                        min="0"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Supplier</label>
                      <select
                        className="form-select"
                        value={formData.supplier}
                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      >
                        <option value="">Select Supplier</option>
                        {suppliers.map((s) => (
                          <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light border-top">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Save Product
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
