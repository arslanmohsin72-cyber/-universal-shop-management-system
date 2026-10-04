# Universal Shop Management System — Technical & Architectural Documentation

> **Document Scope**: 2-Page Comprehensive System Review & Layered Architecture Specification  
> **Target Audience**: Software Architects, Senior Developers, Security Auditors, Product Managers  
> **System Version**: 1.0.0 (Production-Grade POS & ERP)

---

## 1. System Review & Business Domain Overview

### 1.1 Executive Summary
The **Universal Shop Management System** is a enterprise-ready Point of Sale (POS) and Enterprise Resource Planning (ERP) platform designed to support any retail or wholesale business vertical (Mobile Shops, Groceries, Pharmacies, Apparel, Electronics, Hardware). Built using Node.js, Express, React 18, and MongoDB, the application enforces **Multi-Tenant Data Isolation** and strict **Role-Based Access Control (RBAC)** across all modules.

### 1.2 Core Business Modules
* **High-Speed POS Terminal**: Instant SKU/Barcode scanner lookup, responsive cart calculation, auto tax/discount, multi-payment tender (Cash, Card, Bank, Credit), and receipt generation.
* **Inventory & Stock Management**: Real-time automated stock updates on sales/purchases/returns, manual stock adjustments (Stock In, Stock Out, Reconciliation), low stock threshold alerts, and audited stock movement logs.
* **Credit (Udhaar) & Payable Tracking**: Customer credit balances with configurable credit limits; Supplier accounts payable with purchase history and partial/full settlement tracking.
* **Returns & Refunds Workflow**: Automated stock restoration on sales returns and stock deduction on purchase returns with linked invoice balance adjustments.
* **Financial Accounting & Profit Intelligence**: Real-time Net Profit & Loss statement calculation ($\text{Net Profit} = \text{Revenue} - \text{COGS} - \text{Operating Expenses}$), Operating Expense tracking (Rent, Utilities, Salaries), and inventory cost/retail valuation.
* **Multi-Tenant Organization Management**: Custom shop configurations including local currency (`PKR`), tax identification numbers (NTN), custom receipt headers/footers, and independent data partitioning.

---

## 2. Layered Architecture (Role & Layer Specification)

The system adheres strictly to a **7-Tier Layered Architecture (SDA N-Tier Architecture)**. Direct communication occurs exclusively between adjacent layers; cross-layer calls (e.g., Controllers executing database queries or UI interacting directly with Models) are strictly prohibited.

```
+-----------------------------------------------------------------------------+
| 1. PRESENTATION LAYER (React 18 + Vite + Bootstrap 5 + Context API)         |
+-----------------------------------------------------------------------------+
                                       │ (HTTPS / JSON API Requests)
                                       ▼
+-----------------------------------------------------------------------------+
| 2. FRONTEND API SERVICE LAYER (client/src/services/*)                       |
+-----------------------------------------------------------------------------+
                                       │ (Axios HTTP Client with Bearer JWT)
                                       ▼
+-----------------------------------------------------------------------------+
| 3. ROUTE & MIDDLEWARE LAYER (server/src/routes/* & server/src/middleware/*) |
+-----------------------------------------------------------------------------+
                                       │ (Sanitized Express Request)
                                       ▼
+-----------------------------------------------------------------------------+
| 4. CONTROLLER LAYER (server/src/controllers/*)                             |
+-----------------------------------------------------------------------------+
                                       │ (Clean Parameters & Context)
                                       ▼
+-----------------------------------------------------------------------------+
| 5. BUSINESS LOGIC / SERVICE LAYER (server/src/services/*)                  |
+-----------------------------------------------------------------------------+
                                       │ (Data Retrieval & Mutation Calls)
                                       ▼
+-----------------------------------------------------------------------------+
| 6. DATA ACCESS / REPOSITORY LAYER (server/src/repositories/*)              |
+-----------------------------------------------------------------------------+
                                       │ (Mongoose Query Operations)
                                       ▼
+-----------------------------------------------------------------------------+
| 7. PERSISTENCE & SCHEMA LAYER (server/src/models/* -> MongoDB)              |
+-----------------------------------------------------------------------------+
```

### 2.1 Detailed Layer Responsibilities

#### Layer 1: Presentation Layer (`client/src/pages/`, `components/`)
* **Responsibility**: Pure visual rendering, user interactions, form validation, state management (React Context API), and client-side access control.
* **Key Components**: `POSPage.jsx`, `ProductsPage.jsx`, `InventoryPage.jsx`, `ReportsPage.jsx`, `CustomersPage.jsx`.

#### Layer 2: Frontend API Service Layer (`client/src/services/`)
* **Responsibility**: Abstracts HTTP endpoints into reusable JavaScript functions. Handles JWT header injection via Axios interceptors and global error handling.
* **Key Modules**: `api.js` (Axios Base Instance), `salesApi.js`, `productApi.js`, `customerApi.js`, `reportApi.js`.

#### Layer 3: Route & Middleware Layer (`server/src/routes/`, `middleware/`)
* **Responsibility**: Maps API endpoints to controller actions and enforces security gates prior to execution.
* **Security Middleware**:
  * `authMiddleware.js`: Extracts Bearer token, verifies JWT signature, attaches decoded user object (`req.user`) containing `userId`, `role`, and `shopId`.
  * `roleMiddleware.js`: Enforces role-based permissions (`Admin`, `Manager`, `Cashier`).
  * `errorMiddleware.js`: Centralized exception handler returning structured JSON error signatures.

#### Layer 4: Controller Layer (`server/src/controllers/`)
* **Responsibility**: HTTP Request/Response handling. Parses parameters from `req.body`, `req.params`, and `req.query`, passes data to the Service layer, and sends HTTP status codes with JSON payloads. *Contains zero business logic or database queries.*

#### Layer 5: Business Logic / Service Layer (`server/src/services/`)
* **Responsibility**: Core brain of the system. Enforces domain rules, validation, mathematical calculations, profit margins, stock availability checks, transaction integrity, and orchestration across multiple repositories.
* **Key Modules**: `saleService.js`, `purchaseService.js`, `inventoryService.js`, `returnService.js`, `reportService.js`, `authService.js`.

#### Layer 6: Data Access / Repository Layer (`server/src/repositories/`)
* **Responsibility**: Data abstraction layer wrapping database queries. All queries automatically filter by `shopId` to guarantee tenant isolation.
* **Key Repositories**: `productRepository.js`, `saleRepository.js`, `customerRepository.js`, `inventoryRepository.js`, `supplierRepository.js`.

#### Layer 7: Persistence & Schema Layer (`server/src/models/`)
* **Responsibility**: Mongoose schema definitions enforcing field types, default values, validations, and database indexes.

---

## 3. End-to-End Execution Flow: POS Sale Transaction

To illustrate the layered interaction, consider a Cashier completing a sale on the POS screen:

```text
[Cashier Clicks "Complete Sale"]
  │
  ├─> 1. Presentation Layer (POSPage.jsx)
  │      Collects cart items, selected customer, discount, tax, payment method.
  │      Calls `salesApi.processSale(salePayload)`.
  │
  ├─> 2. Frontend API Service (salesApi.js)
  │      Sends HTTP POST /api/sales with `Authorization: Bearer <JWT>`.
  │
  ├─> 3. Route & Middleware Layer (saleRoutes.js -> authMiddleware.js)
  │      Verifies JWT signature. Extracts `shopId` & `userId`. Hands request to `saleController.processSale`.
  │
  ├─> 4. Controller Layer (saleController.js)
  │      Extracts body & tenant metadata: `saleService.processSale(req.user.shopId, req.user.id, req.body)`.
  │
  ├─> 5. Service Layer (saleService.js)
  │      - Validates non-empty cart and item quantities against `productRepository`.
  │      - Computes line items, subtotal, tax, discount, total, COGS, and Net Sale Profit.
  │      - Generates unique invoice number (`INV-XXXXXX`).
  │      - Deducts product stock via `productRepository.updateStock()`.
  │      - Logs stock movement via `inventoryRepository.createLog()`.
  │      - If PaymentMethod === 'Credit', updates customer balance via `customerRepository.updateBalance()`.
  │      - Saves sale document via `saleRepository.create()`.
  │
  ├─> 6. Repository Layer (saleRepository.js, productRepository.js)
  │      Executes MongoDB atomic queries: `Sale.create()`, `Product.bulkWrite()`.
  │
  ├─> 7. Database Layer (MongoDB)
  │      Persists document and returns result up through the stack to update UI state.
```

---

## 4. Role-Based Access Control (RBAC) Matrix

Security is enforced at both UI routing and API Middleware levels. Tampering with client-side code cannot bypass server-side role middleware.

| Module / Action | Admin | Manager | Cashier | Backend Enforced Route Middleware |
|---|:---:|:---:|:---:|---|
| **POS Terminal & Checkout** | ✅ | ✅ | ✅ | `authMiddleware` |
| **View Sales History** | ✅ | ✅ | ✅ | `authMiddleware` |
| **Process Sales Returns** | ✅ | ✅ | ✅ | `authMiddleware` |
| **Product & Category CRUD** | ✅ | ✅ | ❌ | `checkRole(['Admin', 'Manager'])` |
| **Inventory Adjustments & Logs** | ✅ | ✅ | ❌ | `checkRole(['Admin', 'Manager'])` |
| **Purchases & Supplier Payables** | ✅ | ✅ | ❌ | `checkRole(['Admin', 'Manager'])` |
| **Operating Expenses Management** | ✅ | ✅ | ❌ | `checkRole(['Admin', 'Manager'])` |
| **Financial & Profit/Loss Reports**| ✅ | ✅ | ❌ | `checkRole(['Admin', 'Manager'])` |
| **User & Staff Management** | ✅ | ❌ | ❌ | `checkRole(['Admin'])` |
| **Shop Settings & Taxes** | ✅ | ❌ | ❌ | `checkRole(['Admin'])` |

---

## 5. Security, Database Design & Operational Architecture

### 5.1 Security Architecture & Anti-Tamper Protection
1. **Zero Client-Side Trust**: All financial math (COGS, discounts, net profit, tax computations) is re-calculated on the backend service layer. Client-submitted prices or totals are ignored.
2. **Multi-Tenant Partitioning**: Every repository function injects `{ shop: shopId }` into queries. Users cannot inspect or mutate data belonging to another shop, even by guessing IDs.
3. **Authentication & Password Hardening**: Passwords are hashed using `bcryptjs` (salt rounds: 10). JWT tokens carry standard expiry (24h) and secret signature validation.
4. **No dynamic query injection**: Mongoose object casting prevents NoSQL injection via parameterized object queries.

### 5.2 Database Entity Summary (`UniversalShopManagementDB`)
* **`shops`**: Tenant profile (`shopName`, `shopType`, `currency`, `taxNumber`, `lowStockThreshold`).
* **`users`**: Auth credentials (`email`, `password`, `role`, `shop`).
* **`products`**: Item master (`sku`, `barcode`, `purchasePrice`, `sellingPrice`, `stockQuantity`, `shop`).
* **`sales`**: Invoices (`invoiceNumber`, `items`, `subtotal`, `tax`, `discount`, `total`, `profit`, `paymentMethod`, `shop`).
* **`purchases`**: Inbound stock orders (`purchaseNumber`, `supplier`, `items`, `total`, `paidAmount`, `dueAmount`, `shop`).
* **`returns`**: Sales/purchase return logs (`returnNumber`, `type`, `items`, `totalAmount`, `refundMethod`, `shop`).
* **`customers`**: Client ledger (`name`, `currentBalance`, `creditLimit`, `shop`).
* **`suppliers`**: Vendor ledger (`name`, `currentBalance`, `shop`).
* **`expenses`**: Shop overhead (`title`, `category`, `amount`, `date`, `shop`).
* **`inventories`**: Audit trail (`product`, `type`, `quantity`, `previousStock`, `newStock`, `referenceId`, `shop`).

### 5.3 High Availability & Embedded Fallback
The server features an automated database connection strategy:
* **Production/Local Mongo**: Connects to `MONGODB_URI` environment variable.
* **Standalone Fallback**: If local MongoDB is unavailable, the backend automatically boots an in-memory database (`mongodb-memory-server`), ensuring instant out-of-the-box execution without external dependencies.
* **Deployment Target**: Production hosted on Firebase Functions & Firebase Hosting.
