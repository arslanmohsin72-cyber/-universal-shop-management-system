import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column min-w-0">
        <Navbar />
        <main className="p-4 flex-grow-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
