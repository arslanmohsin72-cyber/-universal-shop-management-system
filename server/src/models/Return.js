import mongoose from 'mongoose';

const returnItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true }
});

const returnSchema = new mongoose.Schema(
  {
    returnNumber: { type: String, required: true, unique: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    type: {
      type: String,
      enum: ['SaleReturn', 'PurchaseReturn'],
      required: true
    },
    originalInvoiceOrPurchaseNumber: { type: String, required: true },
    originalReferenceId: { type: mongoose.Schema.Types.ObjectId, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null },
    items: [returnItemSchema],
    totalAmount: { type: Number, required: true },
    refundMethod: {
      type: String,
      enum: ['Cash', 'Credit Adjustment', 'Bank Transfer'],
      default: 'Cash'
    },
    reason: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Return', returnSchema);
