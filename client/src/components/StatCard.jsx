import React from 'react';

export const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => {
  return (
    <div className={`card border-0 shadow-sm rounded-3 h-100 border-start border-4 border-${color}`}>
      <div className="card-body p-3">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="text-muted small fw-semibold text-uppercase tracking-wider">{title}</span>
            <h4 className="fw-bold my-1 text-dark">{value}</h4>
            {subtitle && <small className="text-muted">{subtitle}</small>}
          </div>
          <div className={`bg-${color}-subtle text-${color} p-3 rounded-circle d-flex align-items-center justify-content-center`}>
            <i className={`bi ${icon} fs-4`}></i>
          </div>
        </div>
      </div>
    </div>
  );
};
