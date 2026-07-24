import User from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
import { memoryStore } from '../utils/store.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields (Name, Email, Password).' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({ success: false, error: 'User with this email already exists.' });
      }
      const user = await User.create({ name, email: cleanEmail, password });
      return res.status(201).json({
        success: true,
        user: { id: user._id, name: user.name, email: user.email }
      });
    }

    const existingMem = memoryStore.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingMem) {
      return res.status(400).json({ success: false, error: 'User with this email already exists.' });
    }

    const newUser = { id: 'u_' + Date.now(), name, email: cleanEmail, password };
    memoryStore.users.push(newUser);
    memoryStore.saveToFile();

    return res.status(201).json({
      success: true,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please enter Email and Password.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }
      return res.json({
        success: true,
        user: { id: user._id, name: user.name, email: user.email }
      });
    }

    const userMem = memoryStore.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!userMem || userMem.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    return res.json({
      success: true,
      user: { id: userMem.id, name: userMem.name, email: userMem.email }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'u1';
    if (isMongoConnected) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      return res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
    }
    const userMem = memoryStore.users.find(u => u.id === userId || u._id === userId);
    if (!userMem) return res.status(404).json({ success: false, error: 'User not found' });
    return res.json({ success: true, user: { id: userMem.id, name: userMem.name, email: userMem.email } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
