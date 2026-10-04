import React, { useEffect, useState } from 'react';
import { salesApi } from '../services/salesApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import { PrintInvoiceModal } from '../components/PrintInvoiceModal';
import { useAuth } from '../context/AuthContext';

export const SalesPage = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => {
    loadSales();
  }, [search]);

  const loadSales = async () => {
    try {
      setLoading(true);
      const res = await salesApi.getSales({ search, limit: 100 });
      setSales(res.data?.sales || []);
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
          <h3 className="fw-bold mb-1">Sales History</h3>
          <p className="text-muted mb-0">View all completed sales, invoices, and reprint receipts.</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm p-3 mb-4 rounded-3">
        <div className="input-group">
          <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by invoice number or customer name..."
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
                <th>Invoice #</th>
                <th>Date & Time</th>
                <th>Customer</th>
                <th className="text-center">Items</th>
                <th className="text-end">Total</th>
                <th className="text-center">Payment</th>
                <th className="text-center">Cashier</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div> Loading sales history...
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">No sales invoices found.</td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale._id}>
                    <td className="fw-bold text-primary">{sale.invoiceNumber}</td>
                    <td>{formatDate(sale.createdAt)}</td>
                    <td>{sale.customerName || 'Walk-in'}</td>
                    <td className="text-center">{sale.items?.length || 0}</td>
                    <td className="text-end fw-bold">{formatCurrency(sale.total, user?.currency)}</td>
                    <td className="text-center">
                      <span className="badge bg-light text-dark border">
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="text-center"><small>{sale.cashier?.name}</small></td>
                    <td className="text-center">
                      <button className="btn btn-outline-primary btn-sm" onClick={() => setSelectedSale(sale)}>
                        <i className="bi bi-printer me-1"></i> Print / View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedSale && (
        <PrintInvoiceModal sale={selectedSale} shop={user} onClose={() => setSelectedSale(null)} />
      )}
    </div>
  );
};
