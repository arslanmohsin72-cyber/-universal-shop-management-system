import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar navbar-expand navbar-light bg-white border-bottom sticky-top px-4 py-2 shadow-sm">
      <div className="container-fluid p-0">
        <span className="navbar-text fw-semibold text-dark">
          <i className="bi bi-geo-alt text-primary me-1"></i> {user?.shopName} ({user?.currency || 'PKR'})
        </span>

        <div className="d-flex align-items-center gap-3 ms-auto">
          <Link to="/pos" className="btn btn-primary btn-sm d-flex align-items-center gap-2 fw-semibold px-3">
            <i className="bi bi-cart-plus fs-6"></i> Open POS
          </Link>

          <div className="vr h-50 my-auto"></div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-secondary-subtle text-dark border px-2 py-1">
              <i className="bi bi-person-badge text-muted me-1"></i> {user?.role}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
