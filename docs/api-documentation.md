# Universal Shop Management System — API Documentation

## Base URL
`/api`

Authentication headers required for protected endpoints:
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication APIs (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register-shop` | Public | Register new shop and admin account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/auth/me` | Authenticated | Get current logged-in user profile |

---

## 2. Products APIs (`/api/products`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Authenticated | Query products (supports `search`, `category`, `lowStock`, `page`, `limit`) |
| `GET` | `/api/products/search-code` | Authenticated | Quick search by exact Barcode or SKU for POS scanners |
| `GET` | `/api/products/:id` | Authenticated | Get product by ID |
| `POST` | `/api/products` | Admin, Manager | Create new product |
| `PUT` | `/api/products/:id` | Admin, Manager | Update existing product |
| `DELETE` | `/api/products/:id` | Admin, Manager | Delete product |

---

## 3. Categories APIs (`/api/categories`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/categories` | Authenticated | List all shop categories |
| `POST` | `/api/categories` | Admin, Manager | Create category |
| `PUT` | `/api/categories/:id` | Admin, Manager | Update category |
| `DELETE` | `/api/categories/:id` | Admin, Manager | Delete category |

---

## 4. Sales & POS APIs (`/api/sales`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/sales` | Authenticated | Process POS sale, reduce inventory, calculate profit & due credit |
| `GET` | `/api/sales` | Authenticated | List sales history with filters |
| `GET` | `/api/sales/:id` | Authenticated | Get sale details by ID |
| `GET` | `/api/sales/invoice/:invoiceNumber` | Authenticated | Get sale details by Invoice Number |

---

## 5. Purchases APIs (`/api/purchases`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/purchases` | Admin, Manager | Complete purchase order & increment inventory |
| `GET` | `/api/purchases` | Admin, Manager | List purchase order history |
| `GET` | `/api/purchases/:id` | Admin, Manager | Get purchase order by ID |

---

## 6. Inventory APIs (`/api/inventory`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/inventory/adjust` | Admin, Manager | Manual stock adjustment (Stock In, Stock Out, Adjustment) |
| `GET` | `/api/inventory/logs` | Admin, Manager | View stock movement history logs |

---

## 7. Returns APIs (`/api/returns`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/returns/sale` | Authenticated | Process sale return & restore stock |
| `POST` | `/api/returns/purchase` | Authenticated | Process purchase return & deduct stock |
| `GET` | `/api/returns` | Authenticated | List return logs |

---

## 8. Customers APIs (`/api/customers`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/customers` | Authenticated | List customers & current credit due balances |
| `POST` | `/api/customers` | Authenticated | Add customer |
| `PUT` | `/api/customers/:id` | Authenticated | Update customer |
| `DELETE` | `/api/customers/:id` | Authenticated | Delete customer |

---

## 9. Suppliers APIs (`/api/suppliers`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/suppliers` | Admin, Manager | List suppliers & payable balances |
| `POST` | `/api/suppliers` | Admin, Manager | Add supplier |
| `PUT` | `/api/suppliers/:id` | Admin, Manager | Update supplier |
| `DELETE` | `/api/suppliers/:id` | Admin, Manager | Delete supplier |

---

## 10. Expenses APIs (`/api/expenses`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/expenses` | Admin, Manager | List operating expenses |
| `POST` | `/api/expenses` | Admin, Manager | Add expense |
| `PUT` | `/api/expenses/:id` | Admin, Manager | Update expense |
| `DELETE` | `/api/expenses/:id` | Admin, Manager | Delete expense |

---

## 11. Payments APIs (`/api/payments`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/payments/customer` | Authenticated | Record customer credit repayment |
| `POST` | `/api/payments/supplier` | Admin, Manager | Record supplier payable payment |
| `GET` | `/api/payments` | Authenticated | List payment transaction logs |

---

## 12. Reports APIs (`/api/reports`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/reports/sales` | Admin, Manager | Sales revenue & margin report |
| `GET` | `/api/reports/purchases` | Admin, Manager | Stock purchase report |
| `GET` | `/api/reports/inventory` | Admin, Manager | Inventory retail & cost valuation report |
| `GET` | `/api/reports/profit-loss` | Admin, Manager | Net Profit & Loss statement |

---

## 13. Dashboard APIs (`/api/dashboard`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/summary` | Authenticated | Today's sales, profit, expenses, low stock count, 7-day trend |
