import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true },
    barcode: { type: String, default: '', trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, default: '' },
    description: { type: String, default: '' },
    purchasePrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    wholesalePrice: { type: Number, default: 0, min: 0 },
    stockQuantity: { type: Number, default: 0 },
    minimumStock: { type: Number, default: 5 },
    unit: { type: String, default: 'pcs' },
    image: { type: String, default: '' },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true }
);

productSchema.index({ shop: 1, sku: 1 }, { unique: true });
productSchema.index({ shop: 1, name: 'text', barcode: 'text', sku: 'text' });

export default mongoose.model('Product', productSchema);
