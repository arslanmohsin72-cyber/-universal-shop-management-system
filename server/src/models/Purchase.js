import mongoose from 'mongoose';

const purchaseItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  sku: { type: String, default: '' },
  purchasePrice: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  total: { type: Number, required: true }
});

const purchaseSchema = new mongoose.Schema(
  {
    purchaseNumber: { type: String, required: true, unique: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    supplierName: { type: String, default: '' },
    items: [purchaseItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    dueAmount: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'Bank Transfer', 'Credit'],
      default: 'Cash'
    },
    status: { type: String, enum: ['Completed', 'Returned', 'Partial Return'], default: 'Completed' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Purchase', purchaseSchema);
