import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { user, logout, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-2 ${
      isActive ? 'bg-primary text-white active fw-semibold' : 'text-dark hover-bg-light'
    }`;

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-white border-end vh-100 position-sticky top-0 shadow-sm" style={{ width: '250px', zIndex: 1000 }}>
      {/* Brand Header */}
      <div className="d-flex align-items-center gap-2 pb-3 mb-3 border-bottom px-2">
        <div className="bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
          <i className="bi bi-shop fs-4"></i>
        </div>
        <div>
          <h6 className="fw-bold m-0 text-dark">{user?.shopName || 'Shop System'}</h6>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill small" style={{ fontSize: '0.7rem' }}>
            {user?.shopType || 'Universal POS'}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <ul className="nav nav-pills flex-column mb-auto gap-1 overflow-auto">
        <li className="nav-item">
          <NavLink to="/dashboard" className={navItemClass}>
            <i className="bi bi-speedometer2"></i> Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/pos" className={navItemClass}>
            <i className="bi bi-calculator"></i> POS Terminal
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/products" className={navItemClass}>
            <i className="bi bi-box-seam"></i> Products
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/categories" className={navItemClass}>
            <i className="bi bi-tags"></i> Categories
          </NavLink>
        </li>

        {isManager && (
          <li className="nav-item">
            <NavLink to="/inventory" className={navItemClass}>
              <i className="bi bi-boxes"></i> Inventory Logs
            </NavLink>
          </li>
        )}

        <li className="nav-item">
          <NavLink to="/sales" className={navItemClass}>
            <i className="bi bi-receipt"></i> Sales History
          </NavLink>
        </li>

        {isManager && (
          <li className="nav-item">
            <NavLink to="/purchases" className={navItemClass}>
              <i className="bi bi-cart-check"></i> Purchases
            </NavLink>
          </li>
        )}

        <li className="nav-item">
          <NavLink to="/returns" className={navItemClass}>
            <i className="bi bi-arrow-return-left"></i> Returns
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/customers" className={navItemClass}>
            <i className="bi bi-people"></i> Customers
          </NavLink>
        </li>

        {isManager && (
          <li className="nav-item">
            <NavLink to="/suppliers" className={navItemClass}>
              <i className="bi bi-truck"></i> Suppliers
            </NavLink>
          </li>
        )}

        {isManager && (
          <li className="nav-item">
            <NavLink to="/expenses" className={navItemClass}>
              <i className="bi bi-wallet2"></i> Expenses
            </NavLink>
          </li>
        )}

        <li className="nav-item">
          <NavLink to="/payments" className={navItemClass}>
            <i className="bi bi-currency-dollar"></i> Payments
          </NavLink>
        </li>

        {isManager && (
          <li className="nav-item">
            <NavLink to="/reports" className={navItemClass}>
              <i className="bi bi-bar-chart-line"></i> Reports
            </NavLink>
          </li>
        )}

        {isAdmin && (
          <>
            <li className="border-top my-2"></li>
            <li className="nav-item">
              <NavLink to="/users" className={navItemClass}>
                <i className="bi bi-person-gear"></i> User Management
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/settings" className={navItemClass}>
                <i className="bi bi-gear"></i> Shop Settings
              </NavLink>
            </li>
          </>
        )}
      </ul>

      {/* User Footer */}
      <div className="border-top pt-3 mt-2 px-2 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2 overflow-hidden">
          <div className="bg-secondary-subtle rounded-circle p-2 d-flex align-items-center justify-content-center text-secondary fw-bold" style={{ width: '36px', height: '36px' }}>
            {user?.name?.[0] || 'U'}
          </div>
          <div className="text-truncate">
            <div className="fw-semibold text-dark text-truncate small">{user?.name}</div>
            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{user?.role}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm p-1 px-2 ms-1" title="Logout">
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};
