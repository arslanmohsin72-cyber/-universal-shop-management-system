import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true, trim: true },
    shopType: {
      type: String,
      required: true,
      enum: [
        'Mobile Shop',
        'Grocery Store',
        'Pharmacy',
        'Clothing Store',
        'Electronics Shop',
        'Cosmetics Shop',
        'Stationery Shop',
        'Bakery',
        'Hardware Shop',
        'Other'
      ],
      default: 'Mobile Shop'
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: 'Lahore' },
    country: { type: String, default: 'Pakistan' },
    currency: { type: String, default: 'PKR' },
    taxNumber: { type: String, default: '' },
    logo: { type: String, default: '' },
    receiptFooter: { type: String, default: 'Thank you for your business!' },
    lowStockThreshold: { type: Number, default: 5 },
    allowNegativeStock: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Shop', shopSchema);
