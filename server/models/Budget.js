import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'default_user' },
    category: { type: String, required: true },
    monthlyLimit: { type: Number, required: true },
    alertThreshold: { type: Number, default: 80 }
  },
  { timestamps: true }
);

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);
