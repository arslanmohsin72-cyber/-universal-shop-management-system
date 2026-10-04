import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true }
);

categorySchema.index({ shop: 1, name: 1 }, { unique: true });

export default mongoose.model('Category', categorySchema);
