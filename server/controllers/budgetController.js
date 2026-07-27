import Budget from '../models/Budget.js';
import { isMongoConnected } from '../config/db.js';
import { memoryStore } from '../utils/store.js';

export const getBudgets = async (req, res) => {
  try {
    const userId = req.userId;
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
    const userId = req.userId;
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
      // Bug 4 fix: check if document existed before responding with success
      const item = await Budget.findByIdAndDelete(id);
      if (!item) return res.status(404).json({ success: false, error: 'Budget not found' });
      return res.json({ success: true, message: 'Budget removed' });
    }
    const before = memoryStore.budgets.length;
    memoryStore.budgets = memoryStore.budgets.filter(b => b.id !== id && b._id !== id);
    if (memoryStore.budgets.length === before) {
      return res.status(404).json({ success: false, error: 'Budget not found' });
    }
    memoryStore.saveToFile();
    return res.json({ success: true, message: 'Budget removed' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
