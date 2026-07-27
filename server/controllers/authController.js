import User from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
import { memoryStore } from '../utils/store.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'aurafinance_dev_secret_change_in_production';
const SALT_ROUNDS = 10;

const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields (Name, Email, Password).' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    if (isMongoConnected) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({ success: false, error: 'User with this email already exists.' });
      }
      const user = await User.create({ name, email: cleanEmail, password: hashedPassword });
      const token = signToken(user._id.toString());
      return res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });
    }

    // Fallback: in-memory store
    const existingMem = memoryStore.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingMem) {
      return res.status(400).json({ success: false, error: 'User with this email already exists.' });
    }

    const newUser = { id: 'u_' + Date.now(), name, email: cleanEmail, password: hashedPassword };
    memoryStore.users.push(newUser);
    memoryStore.saveToFile();

    const token = signToken(newUser.id);
    return res.status(201).json({
      success: true,
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please enter Email and Password.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }
      const token = signToken(user._id.toString());
      return res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });
    }

    // Fallback: in-memory store
    const userMem = memoryStore.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!userMem) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }
    const isMatch = await bcrypt.compare(password, userMem.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = signToken(userMem.id);
    return res.json({
      success: true,
      token,
      user: { id: userMem.id, name: userMem.name, email: userMem.email }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/auth/me  (protected)
export const getMe = async (req, res) => {
  try {
    const userId = req.userId; // Set by protect middleware
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
