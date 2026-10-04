# Universal Shop Management System — Layered Architecture Specification

## Overview

The **Universal Shop Management System (Full POS)** is architected using a strict **Layered Architecture (N-Tier Architecture)** to satisfy Software Design & Architecture (SDA) principles.

The architectural goal is complete separation of concerns:
- **Presentation Layer**: React UI components handle rendering, user input, and layout.
- **Frontend API Service Layer**: Centralized API functions wrap HTTP calls using Axios.
- **Route Layer**: Express routes map HTTP verbs and endpoints to controllers and apply authentication/authorization middleware.
- **Controller Layer**: Handles HTTP requests, extracts parameters, delegates to the service layer, and formats JSON responses.
- **Business Logic / Service Layer**: Contains all core business logic (sales calculations, discounts, profit, inventory stock validation, stock increment/decrement, returns processing, customer credit limits, supplier payables).
- **Data Access / Repository Layer**: Encapsulates database queries (find, create, update, delete, aggregate). No business logic or HTTP concepts exist here.
- **Model / Schema Layer**: Mongoose schemas enforcing data types, default values, and indexes.
- **Database**: MongoDB instance (local, in-memory, or cloud database).

---

## Detailed Request Flow (Create Sale Example)

When a cashier completes a sale on the POS screen, the request flows through every layer sequentially:

```text
1. USER ACTION
   Cashier clicks "COMPLETE SALE" on POSPage.jsx
       ↓
2. PRESENTATION LAYER (React)
   POSPage.jsx prepares cart payload and calls salesApi.processSale(saleData)
       ↓
3. FRONTEND API SERVICE (salesApi.js)
   Axios instance sends HTTP POST /api/sales with Bearer JWT token
       ↓
4. EXPRESS ROUTE (saleRoutes.js)
   router.post('/', authMiddleware, saleController.processSale)
   Validates JWT token and delegates to controller
       ↓
5. CONTROLLER LAYER (saleController.js)
   Extracts req.body, req.user.shopId, req.user.id and calls saleService.processSale(...)
   (No DB queries or business math exist in controller)
       ↓
6. BUSINESS LOGIC / SERVICE LAYER (saleService.js)
   - Validates cart is non-empty
   - Verifies sufficient stock for each item in productRepository
   - Calculates line item totals, subtotal, tax, discount, grand total
   - Calculates Cost of Goods Sold (COGS) and Net Sale Profit
   - Generates unique invoice number (e.g. INV-1718000000-456)
   - Decrements stock in productRepository
   - Creates stock log in inventoryRepository
   - Updates customer credit balance in customerRepository if paymentMethod === 'Credit'
   - Saves sale record via saleRepository
       ↓
7. DATA ACCESS / REPOSITORY LAYER (saleRepository.js, productRepository.js, etc.)
   Executes Mongoose operations: Sale.create(), Product.findOneAndUpdate(), etc.
       ↓
8. MODEL LAYER (Sale.js, Product.js, etc.)
   Enforces Mongoose Schema validation, indexes, and types.
       ↓
9. DATABASE (MongoDB)
   Persists documents in UniversalShopManagementDB database.
```

---

## Strict Rules & Enforcement

1. **Routes**: May ONLY define endpoints, attach middleware (`authMiddleware`, `checkRole`), and point to controllers.
2. **Controllers**: May ONLY read request data (`req.params`, `req.body`, `req.query`), call services, and return JSON (`res.status(...).json(...)`).
3. **Services**: MUST contain all calculations (totals, profit, stock changes, return validation, customer credit).
4. **Repositories**: MUST handle all database interactions filtered by multi-tenant `shopId`.
