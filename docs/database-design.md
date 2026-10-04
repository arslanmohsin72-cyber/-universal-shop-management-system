# Universal Shop Management System — Database Design Specification

## Overview

The database is built on **MongoDB** using **Mongoose** ORM (`UniversalShopManagementDB`).
Multi-tenancy is enforced at the document level via `shopId` (`ObjectId` reference to `Shop`).

---

## Entity Relationship Diagram & Collections Summary

```text
User ─────────> Shop <───────── Category
  │               │                 │
  │               │                 ▼
  │               ├───────────> Product <────────── Supplier
  │               │                 │
  │               ├───────────> Inventory
  │               │                 │
  ▼               ├───────────> Customer
Sale ─────────────┴───────────> Purchase
  │                                 │
  ▼                                 ▼
Return <───────────────────────── Return
```

---

## Detailed Collections & Field Schema

### 1. `shops`
- `shopName` (String, Required)
- `shopType` (String, Required: Mobile Shop, Grocery Store, Pharmacy, Clothing Store, Electronics Shop, etc.)
- `owner` (ObjectId → User)
- `phone`, `email`, `address`, `city`, `country`, `currency` (Default: PKR)
- `taxNumber` (NTN string)
- `receiptFooter` (String)
- `lowStockThreshold` (Number, Default: 5)
- `allowNegativeStock` (Boolean, Default: false)

### 2. `users`
- `name` (String, Required)
- `email` (String, Unique, Required)
- `password` (String, Hashed with bcrypt)
- `role` (String, Enum: Admin, Manager, Cashier)
- `shop` (ObjectId → Shop, Required)
- `phone`, `status` (Active / Inactive)

### 3. `categories`
- `name` (String, Required)
- `description` (String)
- `shop` (ObjectId → Shop, Required)
- *Compound Index*: `{ shop: 1, name: 1 }` (Unique per shop)

### 4. `products`
- `name`, `sku` (Unique per shop), `barcode`
- `category` (ObjectId → Category)
- `brand`, `description`
- `purchasePrice` (Number, Cost price)
- `sellingPrice` (Number, Retail price)
- `wholesalePrice` (Number)
- `stockQuantity` (Number)
- `minimumStock` (Number)
- `unit` (pcs, kg, box, etc.)
- `supplier` (ObjectId → Supplier)
- `shop` (ObjectId → Shop)

### 5. `inventories` (Stock Movement Logs)
- `product` (ObjectId → Product)
- `shop` (ObjectId → Shop)
- `type` (Enum: Stock In, Stock Out, Adjustment, Sale, Purchase, Sale Return, Purchase Return)
- `quantity`, `previousStock`, `newStock`
- `referenceId`, `reason`
- `createdBy` (ObjectId → User)

### 6. `customers`
- `name`, `phone`, `email`, `address`
- `openingBalance`, `currentBalance` (Positive = Customer owes shop credit / udhaar)
- `creditLimit` (Number)
- `shop` (ObjectId → Shop)

### 7. `suppliers`
- `name`, `company`, `phone`, `email`, `address`
- `openingBalance`, `currentBalance` (Positive = Shop owes supplier payable)
- `shop` (ObjectId → Shop)

### 8. `sales`
- `invoiceNumber` (Unique string)
- `shop` (ObjectId → Shop)
- `customer` (ObjectId → Customer)
- `items`: `[{ product, name, sku, purchasePrice, sellingPrice, quantity, total }]`
- `subtotal`, `discount`, `tax`, `total`
- `paidAmount`, `dueAmount`
- `profit` (Net margin = Total - COGS)
- `paymentMethod` (Cash, Card, Bank Transfer, Credit, Multiple)
- `cashier` (ObjectId → User)

### 9. `purchases`
- `purchaseNumber` (Unique string)
- `shop` (ObjectId → Shop)
- `supplier` (ObjectId → Supplier)
- `items`: `[{ product, name, sku, purchasePrice, quantity, total }]`
- `subtotal`, `discount`, `tax`, `total`
- `paidAmount`, `dueAmount`
- `createdBy` (ObjectId → User)

### 10. `expenses`
- `title`, `category` (Rent, Electricity, Internet, Salary, Transport, Repair, Marketing, Office Supplies, Other)
- `amount`, `date`, `paymentMethod`, `description`
- `shop` (ObjectId → Shop)

### 11. `payments`
- `paymentNumber` (Unique string)
- `shop` (ObjectId → Shop)
- `type` (CustomerPayment, SupplierPayment, SalePayment, PurchasePayment)
- `customer`, `supplier`, `amount`, `paymentMethod`, `note`

### 12. `returns`
- `returnNumber` (Unique string)
- `shop` (ObjectId → Shop)
- `type` (SaleReturn, PurchaseReturn)
- `originalInvoiceOrPurchaseNumber`
- `customer`, `supplier`
- `items`: `[{ product, name, quantity, unitPrice, total }]`
- `totalAmount`, `refundMethod`, `reason`
