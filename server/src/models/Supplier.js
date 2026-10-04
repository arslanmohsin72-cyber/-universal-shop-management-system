import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    address: { type: String, default: '' },
    openingBalance: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 }, // Positive = Shop owes supplier (Payable)
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true }
);

export default mongoose.model('Supplier', supplierSchema);
