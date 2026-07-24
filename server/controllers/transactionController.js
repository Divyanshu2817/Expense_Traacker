import Transaction from '../models/Transaction.js';
import { isMongoConnected } from '../config/db.js';
import { memoryStore } from '../utils/store.js';

export const getTransactions = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'u1';
    const { category, type, search, startDate, endDate } = req.query;

    if (isMongoConnected) {
      let query = {
        $or: [
          { userId },
          { userId: 'u1' },
          { userId: 'default_user' },
          { userId: { $exists: false } }
        ]
      };
      if (category && category !== 'All') query.category = category;
      if (type && type !== 'All') query.type = type.toLowerCase();
      if (search) query.description = { $regex: search, $options: 'i' };
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = startDate;
        if (endDate) query.date.$lte = endDate;
      }
      const transactions = await Transaction.find(query).sort({ date: -1 });
      return res.json({ success: true, count: transactions.length, data: transactions });
    }

    let items = memoryStore.transactions.filter(t => !t.userId || t.userId === userId || t.userId === 'u1' || t.userId === 'default_user');
    if (category && category !== 'All') items = items.filter(t => t.category === category);
    if (type && type !== 'All') items = items.filter(t => t.type?.toLowerCase() === type.toLowerCase());
    if (search) items = items.filter(t => t.description.toLowerCase().includes(search.toLowerCase()));
    if (startDate) items = items.filter(t => t.date >= startDate);
    if (endDate) items = items.filter(t => t.date <= endDate);

    items.sort((a, b) => new Date(b.date) - new Date(a.date));
    return res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'u1';
    const { description, amount, type, category, date, isRecurring, tags, paymentMethod } = req.body;
    if (amount === undefined || amount === null || !type || !category || !date) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields.' });
    }

    const payload = {
      userId,
      description: description ? String(description).trim() : `${category} Transaction`,
      amount: Number(amount),
      type: String(type).trim().toLowerCase(),
      category,
      date,
      isRecurring: Boolean(isRecurring),
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      paymentMethod: paymentMethod || 'Card'
    };

    if (isMongoConnected) {
      const item = await Transaction.create(payload);
      return res.status(201).json({ success: true, data: item });
    }

    const newItem = { id: Date.now().toString(), ...payload };
    memoryStore.transactions.unshift(newItem);
    memoryStore.saveToFile();
    return res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.type) {
      req.body.type = String(req.body.type).trim().toLowerCase();
    }
    if (isMongoConnected) {
      const item = await Transaction.findByIdAndUpdate(id, req.body, { new: true });
      if (!item) return res.status(404).json({ success: false, error: 'Transaction not found' });
      return res.json({ success: true, data: item });
    }

    const idx = memoryStore.transactions.findIndex(t => t.id === id || t._id === id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Transaction not found' });
    memoryStore.transactions[idx] = { ...memoryStore.transactions[idx], ...req.body };
    memoryStore.saveToFile();
    return res.json({ success: true, data: memoryStore.transactions[idx] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const item = await Transaction.findByIdAndDelete(id);
      if (!item) return res.status(404).json({ success: false, error: 'Transaction not found' });
      return res.json({ success: true, message: 'Transaction removed' });
    }

    const idx = memoryStore.transactions.findIndex(t => t.id === id || t._id === id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Transaction not found' });
    memoryStore.transactions.splice(idx, 1);
    memoryStore.saveToFile();
    return res.json({ success: true, message: 'Transaction removed' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
