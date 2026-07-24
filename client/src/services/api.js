const API_BASE = '/api';

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem('aurafinance_user') || 'null');
  return {
    'Content-Type': 'application/json',
    'x-user-id': user ? user.id : 'u1'
  };
};

export const api = {
  // Auth
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
  }
};
