import React, { useEffect, useState } from 'react';
import { paymentApi } from '../services/paymentApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export const PaymentsPage = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    loadPayments();
  }, [filterType]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await paymentApi.getPayments({ type: filterType, limit: 100 });
      setPayments(res.data?.payments || []);
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
          <h3 className="fw-bold mb-1">Payment Transactions</h3>
          <p className="text-muted mb-0">Audited log of customer credit repayments & supplier payable transactions.</p>
        </div>
        <select className="form-select w-auto" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Payment Types</option>
          <option value="CustomerPayment">Customer Payments (Receivables)</option>
          <option value="SupplierPayment">Supplier Payments (Payables)</option>
        </select>
      </div>

      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle m-0">
            <thead className="table-light">
              <tr>
                <th>Payment #</th>
                <th>Type</th>
                <th>Date & Time</th>
                <th>Customer / Supplier</th>
                <th className="text-end">Amount</th>
                <th>Method</th>
                <th>Note</th>
                <th>Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div> Loading payments...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">No payment transactions recorded.</td>
                </tr>
              ) : (
                payments.map((pay) => (
                  <tr key={pay._id}>
                    <td className="fw-bold text-primary">{pay.paymentNumber}</td>
                    <td>
                      <span
                        className={`badge ${
                          pay.type === 'CustomerPayment'
                            ? 'bg-success-subtle text-success border border-success-subtle'
                            : 'bg-primary-subtle text-primary border border-primary-subtle'
                        }`}
                      >
                        {pay.type === 'CustomerPayment' ? 'Customer Repayment' : 'Supplier Payment'}
                      </span>
                    </td>
                    <td>{formatDate(pay.createdAt)}</td>
                    <td className="fw-semibold">
                      {pay.customer?.name || pay.supplier?.name || '-'}
                    </td>
                    <td className="text-end fw-bold">{formatCurrency(pay.amount, user?.currency)}</td>
                    <td><small>{pay.paymentMethod}</small></td>
                    <td><small className="text-muted">{pay.note || '-'}</small></td>
                    <td><small>{pay.createdBy?.name}</small></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
