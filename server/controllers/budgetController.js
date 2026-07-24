import Budget from '../models/Budget.js';
import { isMongoConnected } from '../config/db.js';
import { memoryStore } from '../utils/store.js';

export const getBudgets = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'u1';
    if (isMongoConnected) {
      const budgets = await Budget.find({ userId });
      return res.json({ success: true, data: budgets });
    }
    const userBudgets = memoryStore.budgets.filter(b => !b.userId || b.userId === userId);
    return res.json({ success: true, data: userBudgets });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const saveBudget = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'u1';
    const { category, monthlyLimit, alertThreshold } = req.body;
    if (!category || !monthlyLimit) {
      return res.status(400).json({ success: false, error: 'Category and monthly limit are required.' });
    }

    if (isMongoConnected) {
      const updated = await Budget.findOneAndUpdate(
        { userId, category },
        { monthlyLimit: Number(monthlyLimit), alertThreshold: Number(alertThreshold || 80) },
        { upsert: true, new: true }
      );
      return res.json({ success: true, data: updated });
    }

    const idx = memoryStore.budgets.findIndex(b => (b.userId === userId || !b.userId) && b.category === category);
    if (idx !== -1) {
      memoryStore.budgets[idx] = {
        ...memoryStore.budgets[idx],
        monthlyLimit: Number(monthlyLimit),
        alertThreshold: Number(alertThreshold || 80)
      };
    } else {
      memoryStore.budgets.push({
        id: 'b' + Date.now(),
        userId,
        category,
        monthlyLimit: Number(monthlyLimit),
        alertThreshold: Number(alertThreshold || 80)
      });
    }
    memoryStore.saveToFile();
    return res.json({ success: true, data: memoryStore.budgets.filter(b => !b.userId || b.userId === userId) });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Budget.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Budget removed' });
    }
    memoryStore.budgets = memoryStore.budgets.filter(b => b.id !== id && b._id !== id);
    memoryStore.saveToFile();
    return res.json({ success: true, message: 'Budget removed' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
