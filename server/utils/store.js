import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data_fallback.json');

const INITIAL_USERS = [
  { id: 'u1', name: 'Demo User', email: 'demo@aurafinance.com', password: 'password123' }
];

const INITIAL_TRANSACTIONS = [
  { id: '1', userId: 'u1', description: 'Tech Corp Salary', amount: 200000, type: 'income', category: 'Salary', date: '2026-07-01', isRecurring: true, tags: ['Work', 'Payroll'] },
  { id: '2', userId: 'u1', description: 'Freelance UI/UX Design', amount: 45000, type: 'income', category: 'Freelance', date: '2026-07-12', isRecurring: false, tags: ['Client', 'SideHustle'] },
  { id: '3', userId: 'u1', description: 'Apartment Rent', amount: 35000, type: 'expense', category: 'Housing', date: '2026-07-02', isRecurring: true, tags: ['Rent', 'Fixed'] },
  { id: '4', userId: 'u1', description: 'Organic Grocery Supermarket', amount: 8450, type: 'expense', category: 'Food & Groceries', date: '2026-07-05', isRecurring: false, tags: ['Essential'] },
  { id: '5', userId: 'u1', description: 'Netflix 4K Ultra Subscription', amount: 649, type: 'expense', category: 'Subscriptions', date: '2026-07-07', isRecurring: true, tags: ['Entertainment'] },
  { id: '6', userId: 'u1', description: 'Spotify Duo Premium', amount: 149, type: 'expense', category: 'Subscriptions', date: '2026-07-10', isRecurring: true, tags: ['Music'] },
  { id: '7', userId: 'u1', description: 'Electricity & Wi-Fi Internet', amount: 4200, type: 'expense', category: 'Utilities', date: '2026-07-08', isRecurring: true, tags: ['Bills'] },
  { id: '8', userId: 'u1', description: 'Fine Dining & Restaurant', amount: 3850, type: 'expense', category: 'Dining Out', date: '2026-07-14', isRecurring: false, tags: ['Leisure'] },
  { id: '9', userId: 'u1', description: 'ChatGPT Plus & Claude Pro', amount: 3300, type: 'expense', category: 'Subscriptions', date: '2026-07-15', isRecurring: true, tags: ['AI', 'Work'] },
  { id: '10', userId: 'u1', description: 'Gym Membership', amount: 2500, type: 'expense', category: 'Fitness & Health', date: '2026-07-16', isRecurring: true, tags: ['Health'] },
  { id: '11', userId: 'u1', description: 'Cab Rides & Auto Fare', amount: 1450, type: 'expense', category: 'Transportation', date: '2026-07-18', isRecurring: false, tags: ['Travel'] },
  { id: '12', userId: 'u1', description: 'Mutual Fund Dividend Payout', amount: 12500, type: 'income', category: 'Investments', date: '2026-07-20', isRecurring: true, tags: ['Passive'] }
];

const INITIAL_BUDGETS = [
  { id: 'b1', userId: 'u1', category: 'Housing', monthlyLimit: 40000, alertThreshold: 90 },
  { id: 'b2', userId: 'u1', category: 'Food & Groceries', monthlyLimit: 15000, alertThreshold: 80 },
  { id: 'b3', userId: 'u1', category: 'Subscriptions', monthlyLimit: 5000, alertThreshold: 85 },
  { id: 'b4', userId: 'u1', category: 'Dining Out', monthlyLimit: 10000, alertThreshold: 75 },
  { id: 'b5', userId: 'u1', category: 'Utilities', monthlyLimit: 6000, alertThreshold: 90 },
  { id: 'b6', userId: 'u1', category: 'Transportation', monthlyLimit: 5000, alertThreshold: 80 }
];

const INITIAL_GOALS = [
  { id: 'g1', userId: 'u1', title: 'Ladakh Bike Trip Fund', targetAmount: 75000, currentAmount: 48500, targetDate: '2026-11-15', category: 'Travel', icon: 'Plane' },
  { id: 'g2', userId: 'u1', title: 'Emergency Reserve (6 Months)', targetAmount: 300000, currentAmount: 215000, targetDate: '2026-12-31', category: 'Savings', icon: 'ShieldCheck' },
  { id: 'g3', userId: 'u1', title: 'M3 MacBook Pro Upgrade', targetAmount: 180000, currentAmount: 125000, targetDate: '2026-09-30', category: 'Gadgets', icon: 'Laptop' }
];

class MemoryStore {
  constructor() {
    this.users = [...INITIAL_USERS];
    this.transactions = [...INITIAL_TRANSACTIONS];
    this.budgets = [...INITIAL_BUDGETS];
    this.goals = [...INITIAL_GOALS];
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users) this.users = parsed.users;
        if (parsed.transactions) this.transactions = parsed.transactions;
        if (parsed.budgets) this.budgets = parsed.budgets;
        if (parsed.goals) this.goals = parsed.goals;
      } else {
        this.saveToFile();
      }
    } catch (e) {
      console.warn('Fallback store load warning:', e.message);
    }
  }

  saveToFile() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify({
        users: this.users,
        transactions: this.transactions,
        budgets: this.budgets,
        goals: this.goals
      }, null, 2));
    } catch (e) {
      console.error('Fallback store save error:', e.message);
    }
  }

  resetSeed(userId = 'u1') {
    this.users = [...INITIAL_USERS];
    this.transactions = [...INITIAL_TRANSACTIONS.map(t => ({ ...t, userId }))];
    this.budgets = [...INITIAL_BUDGETS.map(b => ({ ...b, userId }))];
    this.goals = [...INITIAL_GOALS.map(g => ({ ...g, userId }))];
    this.saveToFile();
  }
}

export const memoryStore = new MemoryStore();
