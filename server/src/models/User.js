import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Cashier'],
      default: 'Cashier'
    },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    phone: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
