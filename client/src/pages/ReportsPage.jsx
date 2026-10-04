import React, { useEffect, useState } from 'react';
import { reportApi } from '../services/reportApi';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export const ReportsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('sales');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [salesReport, setSalesReport] = useState(null);
  const [purchaseReport, setPurchaseReport] = useState(null);
  const [inventoryReport, setInventoryReport] = useState(null);
  const [profitLossReport, setProfitLossReport] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, [activeTab, startDate, endDate]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      if (activeTab === 'sales') {
        const res = await reportApi.getSalesReport(params);
        setSalesReport(res.data);
      } else if (activeTab === 'purchases') {
        const res = await reportApi.getPurchaseReport(params);
        setPurchaseReport(res.data);
      } else if (activeTab === 'inventory') {
        const res = await reportApi.getInventoryReport();
        setInventoryReport(res.data);
      } else if (activeTab === 'profit') {
        const res = await reportApi.getProfitLossReport(params);
        setProfitLossReport(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 no-print">
        <div>
          <h3 className="fw-bold mb-1">Financial & Inventory Reports</h3>
          <p className="text-muted mb-0">Audited store reports, sales analytics, and Profit & Loss calculations.</p>
        </div>
        <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={handlePrint}>
          <i className="bi bi-printer"></i> Print Report
        </button>
      </div>

      {/* Date Filter & Tab Bar */}
      <div className="card border-0 shadow-sm p-3 mb-4 rounded-3 no-print">
        <div className="row g-2 align-items-center">
          <div className="col-md-6">
            <div className="btn-group w-100" role="group">
              <button
                className={`btn ${activeTab === 'sales' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('sales')}
              >
                Sales Report
              </button>
              <button
                className={`btn ${activeTab === 'purchases' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('purchases')}
              >
                Purchase Report
              </button>
              <button
                className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('inventory')}
              >
                Inventory Value
              </button>
              <button
                className={`btn ${activeTab === 'profit' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('profit')}
              >
                Profit & Loss
              </button>
            </div>
          </div>

          <div className="col-md-3">
            <input
              type="date"
              className="form-control form-control-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control form-control-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
          <div className="text-muted mt-2">Generating report...</div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-3 shadow-sm border" id="printableReport">
          {/* Sales Report View */}
          {activeTab === 'sales' && salesReport && (
            <div>
              <h4 className="fw-bold mb-3 border-bottom pb-2">Sales Analytics Report</h4>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="p-3 bg-primary-subtle text-primary rounded-3 border border-primary-subtle">
                    <span className="small text-uppercase">Total Sales Revenue</span>
                    <h3 className="fw-bold my-1">{formatCurrency(salesReport.totalSales, user?.currency)}</h3>
                    <small>{salesReport.totalCount} Total Invoices</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 bg-success-subtle text-success rounded-3 border border-success-subtle">
                    <span className="small text-uppercase">Gross Profit From Sales</span>
                    <h3 className="fw-bold my-1">{formatCurrency(salesReport.totalProfit, user?.currency)}</h3>
                    <small>Sales Revenue minus COGS</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 bg-warning-subtle text-dark rounded-3 border border-warning-subtle">
                    <span className="small text-uppercase">Total Discounts Given</span>
                    <h3 className="fw-bold my-1">{formatCurrency(salesReport.totalDiscount, user?.currency)}</h3>
                    <small>Promotions & Discounts</small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Purchase Report View */}
          {activeTab === 'purchases' && purchaseReport && (
            <div>
              <h4 className="fw-bold mb-3 border-bottom pb-2">Stock Purchase Report</h4>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="p-3 bg-info-subtle text-dark rounded-3 border border-info-subtle">
                    <span className="small text-uppercase">Total Purchase Value</span>
                    <h3 className="fw-bold my-1">{formatCurrency(purchaseReport.totalPurchases, user?.currency)}</h3>
                    <small>{purchaseReport.totalCount} Purchase Orders</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 bg-success-subtle text-success rounded-3 border border-success-subtle">
                    <span className="small text-uppercase">Amount Paid</span>
                    <h3 className="fw-bold my-1">{formatCurrency(purchaseReport.totalPaid, user?.currency)}</h3>
                    <small>Completed Payments</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 bg-danger-subtle text-danger rounded-3 border border-danger-subtle">
                    <span className="small text-uppercase">Amount Remaining Due</span>
                    <h3 className="fw-bold my-1">{formatCurrency(purchaseReport.totalDue, user?.currency)}</h3>
                    <small>Supplier Payables</small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Value Report View */}
          {activeTab === 'inventory' && inventoryReport && (
            <div>
              <h4 className="fw-bold mb-3 border-bottom pb-2">Inventory Valuation Report</h4>
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="p-3 bg-light rounded-3 border">
                    <span className="small text-uppercase text-muted">Total Active Catalog Products</span>
                    <h3 className="fw-bold my-1">{inventoryReport.totalProducts}</h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 bg-danger-subtle text-danger rounded-3 border border-danger-subtle">
                    <span className="small text-uppercase">Low Stock Alert Count</span>
                    <h3 className="fw-bold my-1">{inventoryReport.lowStockCount}</h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 bg-primary-subtle text-primary rounded-3 border border-primary-subtle">
                    <span className="small text-uppercase">Total Purchase Valuation</span>
                    <h3 className="fw-bold my-1">{formatCurrency(inventoryReport.totalPurchaseValue, user?.currency)}</h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 bg-success-subtle text-success rounded-3 border border-success-subtle">
                    <span className="small text-uppercase">Total Retail Valuation</span>
                    <h3 className="fw-bold my-1">{formatCurrency(inventoryReport.totalSellingValue, user?.currency)}</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profit & Loss Report View */}
          {activeTab === 'profit' && profitLossReport && (
            <div>
              <h4 className="fw-bold mb-3 border-bottom pb-2">Net Profit & Loss Statement</h4>
              <div className="table-responsive">
                <table className="table table-bordered align-middle fs-6">
                  <tbody>
                    <tr className="table-light">
                      <td className="fw-semibold">Gross Sales Revenue</td>
                      <td className="text-end fw-bold text-primary">{formatCurrency(profitLossReport.grossSales, user?.currency)}</td>
                    </tr>
                    <tr>
                      <td className="ps-4 text-muted">(-) Cost of Goods Sold (COGS)</td>
                      <td className="text-end text-muted">-{formatCurrency(profitLossReport.cogs, user?.currency)}</td>
                    </tr>
                    <tr className="table-success fw-bold">
                      <td>(=) Gross Profit from Sales</td>
                      <td className="text-end">{formatCurrency(profitLossReport.grossProfitFromSales, user?.currency)}</td>
                    </tr>
                    <tr>
                      <td className="ps-4 text-danger">(-) Total Operating Expenses (Rent, Bills, Salaries)</td>
                      <td className="text-end text-danger">-{formatCurrency(profitLossReport.totalExpenses, user?.currency)}</td>
                    </tr>
                    <tr className="table-primary fw-bold fs-5">
                      <td>(=) NET PROFIT</td>
                      <td className="text-end">{formatCurrency(profitLossReport.netProfit, user?.currency)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
