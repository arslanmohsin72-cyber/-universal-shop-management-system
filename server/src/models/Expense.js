import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Rent',
        'Electricity',
        'Internet',
        'Salary',
        'Transport',
        'Repair',
        'Marketing',
        'Office Supplies',
        'Other'
      ],
      default: 'Other'
    },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    description: { type: String, default: '' },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'Bank Transfer', 'Other'],
      default: 'Cash'
    },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model('Expense', expenseSchema);
