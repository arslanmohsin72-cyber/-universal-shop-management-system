import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    address: { type: String, default: '' },
    openingBalance: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 }, // Positive = Customer owes shop (Credit/Udhaar)
    creditLimit: { type: Number, default: 50000 },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true }
);

export default mongoose.model('Customer', customerSchema);
