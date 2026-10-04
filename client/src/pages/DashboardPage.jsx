import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../services/dashboardApi';
import { StatCard } from '../components/StatCard';
import { formatCurrency } from '../utils/formatters';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.getSummary();
      setSummary(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <div className="text-muted mt-2">Loading dashboard metrics...</div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger shadow-sm">{error}</div>;
  }

  // Prepare chart data
  const chartLabels = summary?.salesTrend?.map((item) => item._id) || [];
  const chartDataValues = summary?.salesTrend?.map((item) => item.totalAmount) || [];

  const chartData = {
    labels: chartLabels.length > 0 ? chartLabels : ['Today'],
    datasets: [
      {
        label: 'Sales Revenue (PKR)',
        data: chartDataValues.length > 0 ? chartDataValues : [summary?.todaySales || 0],
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.1)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Welcome back, {user?.name}!</h3>
          <p className="text-muted mb-0">Overview of {user?.shopName} metrics for today.</p>
        </div>
        <Link to="/pos" className="btn btn-primary px-4 py-2 fw-semibold d-flex align-items-center gap-2">
          <i className="bi bi-calculator fs-5"></i> Open POS Terminal
        </Link>
      </div>

      {/* Primary Metrics Grid */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <StatCard
            title="Today's Sales"
            value={formatCurrency(summary?.todaySales, user?.currency)}
            subtitle={`${summary?.todaySalesCount || 0} Orders Today`}
            icon="bi-currency-dollar"
            color="primary"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Today's Profit"
            value={formatCurrency(summary?.todayProfit, user?.currency)}
            subtitle="Net Sales Margin"
            icon="bi-graph-up-arrow"
            color="success"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Today's Expenses"
            value={formatCurrency(summary?.todayExpenses, user?.currency)}
            subtitle="Operational Costs"
            icon="bi-wallet2"
            color="warning"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Low Stock Alert"
            value={summary?.lowStockProducts || 0}
            subtitle="Products Reaching Threshold"
            icon="bi-exclamation-triangle"
            color="danger"
          />
        </div>
      </div>

      {/* Secondary Metrics & Credit / Payables */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <StatCard
            title="Total Products"
            value={summary?.totalProducts || 0}
            subtitle="Active Catalog Count"
            icon="bi-box-seam"
            color="info"
          />
        </div>
        <div className="col-md-4">
          <StatCard
            title="Customer Credit Due"
            value={formatCurrency(summary?.outstandingCustomerCredit, user?.currency)}
            subtitle="Receivable Balance"
            icon="bi-people"
            color="danger"
          />
        </div>
        <div className="col-md-4">
          <StatCard
            title="Supplier Payables"
            value={formatCurrency(summary?.supplierPayables, user?.currency)}
            subtitle="Outstanding Payables"
            icon="bi-truck"
            color="secondary"
          />
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
          <h5 className="fw-bold m-0"><i className="bi bi-activity text-primary me-2"></i> 7-Day Sales Trend</h5>
          <span className="badge bg-light text-muted border">Real Database Data</span>
        </div>
        <div className="card-body p-4" style={{ minHeight: '300px' }}>
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};
