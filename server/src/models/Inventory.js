import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    type: {
      type: String,
      enum: ['Stock In', 'Stock Out', 'Adjustment', 'Sale', 'Purchase', 'Sale Return', 'Purchase Return'],
      required: true
    },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    referenceId: { type: String, default: '' },
    reason: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model('Inventory', inventorySchema);
