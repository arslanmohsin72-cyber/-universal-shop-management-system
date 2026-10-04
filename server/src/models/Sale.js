import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  sku: { type: String, default: '' },
  purchasePrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  total: { type: Number, required: true }
});

const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
    customerName: { type: String, default: 'Walk-in Customer' },
    items: [saleItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    dueAmount: { type: Number, default: 0 },
    profit: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'Bank Transfer', 'Credit', 'Multiple'],
      default: 'Cash'
    },
    status: { type: String, enum: ['Completed', 'Returned', 'Partial Return'], default: 'Completed' },
    cashier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Sale', saleSchema);
