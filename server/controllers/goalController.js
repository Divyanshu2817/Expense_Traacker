import Goal from '../models/Goal.js';
import { isMongoConnected } from '../config/db.js';
import { memoryStore } from '../utils/store.js';

export const getGoals = async (req, res) => {
  try {
    const userId = req.userId;
    if (isMongoConnected) {
      const goals = await Goal.find({ userId });
      return res.json({ success: true, data: goals });
    }
    const userGoals = memoryStore.goals.filter(g => !g.userId || g.userId === userId);
    return res.json({ success: true, data: userGoals });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createGoal = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, targetAmount, currentAmount, targetDate, category, icon } = req.body;
    if (!title || !targetAmount || !targetDate) {
      return res.status(400).json({ success: false, error: 'Title, target amount, and date are required.' });
    }
    const payload = {
      userId,
      title,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount || 0),
      targetDate,
      category: category || 'General',
      icon: icon || 'Target'
    };

    if (isMongoConnected) {
      const goal = await Goal.create(payload);
      return res.status(201).json({ success: true, data: goal });
    }

    const newGoal = { id: 'g' + Date.now(), ...payload };
    memoryStore.goals.push(newGoal);
    memoryStore.saveToFile();
    return res.status(201).json({ success: true, data: newGoal });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateGoalProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentAmount } = req.body;

    if (isMongoConnected) {
      // Bug 5 fix: check if goal was actually found before returning success
      const item = await Goal.findByIdAndUpdate(
        id,
        { currentAmount: Number(currentAmount) },
        { new: true }
      );
      if (!item) return res.status(404).json({ success: false, error: 'Goal not found' });
      return res.json({ success: true, data: item });
    }

    const idx = memoryStore.goals.findIndex(g => g.id === id || g._id === id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Goal not found' });
    memoryStore.goals[idx].currentAmount = Number(currentAmount);
    memoryStore.saveToFile();
    return res.json({ success: true, data: memoryStore.goals[idx] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      // Bug 4 fix: check if document existed before responding with success
      const item = await Goal.findByIdAndDelete(id);
      if (!item) return res.status(404).json({ success: false, error: 'Goal not found' });
      return res.json({ success: true, message: 'Goal removed' });
    }
    const before = memoryStore.goals.length;
    memoryStore.goals = memoryStore.goals.filter(g => g.id !== id && g._id !== id);
    if (memoryStore.goals.length === before) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }
    memoryStore.saveToFile();
    return res.json({ success: true, message: 'Goal removed' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
