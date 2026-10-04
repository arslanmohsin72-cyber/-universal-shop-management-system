import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    }
  };

  const fillDemo = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    try {
      await login(demoEmail, demoPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Demo login failed');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="card-header bg-primary text-white p-4 text-center border-0">
          <div className="bg-white text-primary rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
            <i className="bi bi-shop fs-2"></i>
          </div>
          <h4 className="fw-bold mb-1">Universal Shop POS</h4>
          <p className="text-white-50 small mb-0">Layered Architecture POS & ERP System</p>
        </div>

        <div className="card-body p-4">
          {error && <div className="alert alert-danger py-2 small">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold small text-muted">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="admin@mobilezone.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small text-muted">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold mb-3" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-box-arrow-in-right me-2"></i>}
              Sign In
            </button>
          </form>

          {/* One-Click Demo Logins */}
          <div className="border-top pt-3 text-center">
            <span className="text-muted small d-block mb-2 fw-semibold">Quick Demo Login</span>
            <div className="d-flex gap-2 justify-content-center">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm rounded-pill px-3"
                onClick={() => fillDemo('admin@mobilezone.pk', 'Admin@12345')}
              >
                Admin
              </button>
              <button
                type="button"
                className="btn btn-outline-success btn-sm rounded-pill px-3"
                onClick={() => fillDemo('manager@mobilezone.pk', 'Manager@12345')}
              >
                Manager
              </button>
              <button
                type="button"
                className="btn btn-outline-info btn-sm rounded-pill px-3"
                onClick={() => fillDemo('cashier@mobilezone.pk', 'Cashier@12345')}
              >
                Cashier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
