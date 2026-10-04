# Universal Shop Management System — Full POS

A complete, production-grade **Universal Shop Management System & POS** built using strict **Layered Architecture (SDA N-Tier Architecture)** with **React, Node.js, Express, MongoDB, and Firebase**.

Designed to support any retail or wholesale shop type out-of-the-box (Mobile Shop, Grocery Store, Pharmacy, Clothing Store, Electronics Shop, Cosmetics Shop, Bakery, Hardware Shop, etc.).

---

## 🌟 Key Features & Modules

- **Universal Multi-Tenant Support**: Supports custom shop configuration, currency (`PKR` default), address, tax NTN, receipt footers, and low stock threshold alerts.
- **Strict Layered Architecture**: Clear request flow (`React UI` -> `Frontend API Service` -> `Express Route` -> `Controller` -> `Service` -> `Repository` -> `Mongoose Model` -> `MongoDB`).
- **POS Terminal**: Dedicated high-speed POS screen with barcode scanner support, SKU search, category pills filter, cart management, subtotal/discount/tax calculation, customer selection, multi-payment options (Cash, Card, Bank, Credit), and instant printable receipt modal.
- **Product & Category CRUD**: SKU/Barcode search, category filter, low-stock filter, cost vs retail prices, minimum stock alerts, and supplier linkage.
- **Inventory Management**: Automated stock increment on purchases, stock reduction on sales, stock restoration on sales returns, manual stock adjustment (Stock In, Stock Out, Adjustment), and audited movement logs.
- **Customer Management & Credit (Udhaar)**: Track customer credit balances, credit limits, sales history, and record customer repayments.
- **Supplier Management & Payables**: Manage vendor accounts, outstanding payables, purchase order history, and record supplier payments.
- **Sales & Purchase Returns**: Full return workflows with item quantity validation, stock auto-adjustment, and credit/refund handling.
- **Operating Expense Tracking**: Categorize shop operational costs (Rent, Electricity, Internet, Salaries, Transport, Marketing).
- **Financial & Inventory Reports**: Audited Sales Report, Purchase Report, Inventory Valuation Report, and Net Profit & Loss Statement (`Net Profit = Sales Revenue - COGS - Expenses`) with date range filtering and print capabilities.
- **Dashboard Analytics**: Real-time stats (Today's Sales, Today's Profit, Expenses, Low Stock Alert Count, Outstanding Credit, Supplier Payables) and 7-day Sales Trend chart powered by Chart.js.
- **Role-Based Access Control (RBAC)**: Admin (Full Access), Manager (Inventory, Sales, Reports, Expenses, Purchases), Cashier (POS & Sales history only). Enforced on both frontend UI and backend API middleware.
- **Seamless Local Out-Of-The-Box Execution**: Tries `MONGODB_URI` environment variable, with automatic fallback to embedded `mongodb-memory-server` if local MongoDB is not running!

---

## 🏗️ Architecture

```text
React UI (client/src/pages/)
   ↓
Frontend API Services (client/src/services/)
   ↓
Express Routes (server/src/routes/)
   ↓
Controllers (server/src/controllers/)
   ↓
Business Logic Services (server/src/services/)
   ↓
Data Access Repositories (server/src/repositories/)
   ↓
Mongoose Models (server/src/models/)
   ↓
MongoDB Database
```

---

## 🔑 Default Demo Credentials

After running `npm run seed`, use any of the following accounts:

| Role | Email | Password | Allowed Access |
|---|---|---|---|
| **Admin** | `admin@mobilezone.pk` | `Admin@12345` | Full system access (Dashboard, POS, Products, Categories, Inventory, Sales, Purchases, Returns, Customers, Suppliers, Expenses, Payments, Reports, Users, Settings) |
| **Manager** | `manager@mobilezone.pk` | `Manager@12345` | Operational access (Dashboard, POS, Products, Categories, Inventory, Sales, Purchases, Returns, Customers, Suppliers, Expenses, Payments, Reports) |
| **Cashier** | `cashier@mobilezone.pk` | `Cashier@12345` | Terminal access (Dashboard, POS, Products, Categories, Sales history, Sales Returns, Customers) |

*Note: Demo passwords are provided for evaluation purposes.*

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation

1. Install server and client dependencies:
```bash
npm run install:all
```

2. Seed the database with Mobile Shop sample data (Mobile Zone Lahore):
```bash
npm run seed
```

3. Run automated backend business logic tests:
```bash
npm run test
```

4. Start both server and client concurrently:
   - Server: `npm run server` (runs on `http://localhost:5000`)
   - Client: `npm run client` (runs on `http://localhost:3000`)

---

## 🚀 Production Firebase Deployment

- **Live Firebase Hosting URL**: [https://universal-shop-pos-app.web.app](https://universal-shop-pos-app.web.app)
- **Firebase Project Console**: [https://console.firebase.google.com/project/universal-shop-pos-app/overview](https://console.firebase.google.com/project/universal-shop-pos-app/overview)

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Bootstrap 5, Bootstrap Icons, Axios, React Router 6, Chart.js / React-Chartjs-2
- **Backend**: Node.js, Express.js (ES Modules `import/export`), JWT, bcryptjs, Helmet, CORS
- **Database**: MongoDB, Mongoose, mongodb-memory-server
- **Deployment**: Firebase Hosting & Firebase Functions
