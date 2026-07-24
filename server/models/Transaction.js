import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'default_user' },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    isRecurring: { type: Boolean, default: false },
    tags: [{ type: String }],
    paymentMethod: { type: String, default: 'Card' }
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
