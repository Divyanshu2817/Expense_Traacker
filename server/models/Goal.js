import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'default_user' },
    title: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    targetDate: { type: String, required: true },
    category: { type: String, default: 'General' },
    icon: { type: String, default: 'Target' }
  },
  { timestamps: true }
);

export default mongoose.models.Goal || mongoose.model('Goal', GoalSchema);
