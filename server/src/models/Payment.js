import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    paymentNumber: { type: String, required: true, unique: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    type: {
      type: String,
      enum: ['CustomerPayment', 'SupplierPayment', 'SalePayment', 'PurchasePayment', 'ExpensePayment'],
      required: true
    },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null },
    sale: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', default: null },
    purchase: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase', default: null },
    amount: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'Bank Transfer', 'Cheque', 'Other'],
      default: 'Cash'
    },
    note: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
