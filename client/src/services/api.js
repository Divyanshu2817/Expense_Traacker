// In production (Render), VITE_API_URL is set to the backend Render URL.
// In local dev, Vite proxies /api → http://localhost:5000 via vite.config.js.
const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

/**
 * Bug 2 fix: Send JWT in Authorization header instead of the spoofable x-user-id header.
 * Token is stored in localStorage after login/register.
 */
const getHeaders = () => {
  const token = localStorage.getItem('aurafinance_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth — public endpoints (no token needed)
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  },

  async register(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return await res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    return await res.json();
  },

  // Summary & Dashboard
  async getSummary() {
    const res = await fetch(`${API_BASE}/analytics/summary`, { headers: getHeaders() });
    return await res.json();
  },

  // Transactions
  async getTransactions(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/transactions?${query}`, { headers: getHeaders() });
    return await res.json();
  },

  async createTransaction(data) {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteTransaction(id) {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await res.json();
  },

  // Budgets
  async getBudgets() {
    const res = await fetch(`${API_BASE}/budgets`, { headers: getHeaders() });
    return await res.json();
  },

  async saveBudget(data) {
    const res = await fetch(`${API_BASE}/budgets`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteBudget(id) {
    const res = await fetch(`${API_BASE}/budgets/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await res.json();
  },

  // Financial Health & AI Coach
  async getHealthScore() {
    const res = await fetch(`${API_BASE}/analytics/health`, { headers: getHeaders() });
    return await res.json();
  },

  // Subscription Radar
  async getSubscriptions() {
    const res = await fetch(`${API_BASE}/analytics/subscriptions`, { headers: getHeaders() });
    return await res.json();
  },

  // Goals
  async getGoals() {
    const res = await fetch(`${API_BASE}/goals`, { headers: getHeaders() });
    return await res.json();
  },

  async createGoal(data) {
    const res = await fetch(`${API_BASE}/goals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateGoalProgress(id, currentAmount) {
    const res = await fetch(`${API_BASE}/goals/${id}/progress`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ currentAmount })
    });
    return await res.json();
  },

  async deleteGoal(id) {
    const res = await fetch(`${API_BASE}/goals/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await res.json();
  },

  // Seed Reset
  async resetSeed() {
    const res = await fetch(`${API_BASE}/analytics/reset`, {
      method: 'POST',
      headers: getHeaders()
    });
    return await res.json();
  },

  /**
   * Silent ping — call this on app load so Render's free-tier backend
   * wakes up before the user needs to authenticate.
   */
  async keepAlive() {
    try {
      await fetch(`${API_BASE}/health`, { method: 'GET' });
    } catch (_) {
      // Ignore — backend might be starting up
    }
  }
};
