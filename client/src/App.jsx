import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { VisualCharts } from './components/VisualCharts';
import { BudgetManager } from './components/BudgetManager';
import { FinancialCoach } from './components/FinancialCoach';
import { SubscriptionRadar } from './components/SubscriptionRadar';
import { GoalTracker } from './components/GoalTracker';
import { ExpenseFormModal } from './components/ExpenseFormModal';
import { AuthModal } from './components/AuthModal';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // User State
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('aurafinance_user') || 'null');
  });

  // App Data States
  const [summaryData, setSummaryData] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [healthData, setHealthData] = useState({});
  const [subData, setSubData] = useState({});
  const [goals, setGoals] = useState([]);

  // Fetch all app state from API
  const loadAppData = async () => {
    setLoading(true); // Bug 6 fix: always set loading at start of fetch
    try {
      const [sumRes, txRes, bRes, hRes, sRes, gRes] = await Promise.all([
        api.getSummary(),
        api.getTransactions(),
        api.getBudgets(),
        api.getHealthScore(),
        api.getSubscriptions(),
        api.getGoals()
      ]);

      if (sumRes.success) setSummaryData(sumRes);
      if (txRes.success) setTransactions(txRes.data);
      if (bRes.success) setBudgets(bRes.data);
      if (hRes.success) setHealthData(hRes);
      if (sRes.success) setSubData(sRes);
      if (gRes.success) setGoals(gRes.data);
    } catch (e) {
      console.error('Error fetching financial dataset:', e);
    } finally {
      setLoading(false);
    }
  };

  // Ping backend on mount to wake it up (Render free-tier cold-start fix)
  useEffect(() => {
    api.keepAlive();
  }, []);

  useEffect(() => {
    loadAppData();
  }, [user]);

  // Auth Handlers
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    // loading state is handled by loadAppData() triggered via useEffect([user])
  };

  const handleLogout = () => {
    localStorage.removeItem('aurafinance_user');
    localStorage.removeItem('aurafinance_token'); // Bug 2 fix: clear JWT on logout
    setUser(null);
  };

  // Action Handlers
  const handleCreateTransaction = async (data) => {
    await api.createTransaction(data);
    loadAppData();
  };

  const handleDeleteTransaction = async (id) => {
    await api.deleteTransaction(id);
    loadAppData();
  };

  const handleSaveBudget = async (data) => {
    await api.saveBudget(data);
    loadAppData();
  };

  const handleDeleteBudget = async (id) => {
    await api.deleteBudget(id);
    loadAppData();
  };

  const handleCreateGoal = async (data) => {
    await api.createGoal(data);
    loadAppData();
  };

  const handleUpdateGoalProgress = async (id, currentAmount) => {
    await api.updateGoalProgress(id, currentAmount);
    loadAppData();
  };

  const handleDeleteGoal = async (id) => {
    await api.deleteGoal(id);
    loadAppData();
  };

  const handleResetData = async () => {
    if (window.confirm('Reset app data to default sample transactions?')) {
      await api.resetSeed();
      loadAppData();
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onResetData={handleResetData}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>💎</div>
          <p>Syncing AuraFinance Workspace Intelligence...</p>
        </div>
      ) : (
        <main>
          {activeTab === 'dashboard' && (
            <Dashboard
              summaryData={summaryData}
              transactions={transactions}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {activeTab === 'analytics' && <VisualCharts summaryData={summaryData} mode="all" />}

          {activeTab === 'budgets' && (
            <BudgetManager
              budgets={budgets}
              summaryData={summaryData}
              onSaveBudget={handleSaveBudget}
              onDeleteBudget={handleDeleteBudget}
            />
          )}

          {activeTab === 'coach' && <FinancialCoach healthData={healthData} summaryData={summaryData.summary} />}

          {activeTab === 'subscriptions' && (
            <SubscriptionRadar subData={subData} onOpenAddModal={() => setIsAddModalOpen(true)} />
          )}

          {activeTab === 'goals' && (
            <GoalTracker
              goals={goals}
              onCreateGoal={handleCreateGoal}
              onUpdateGoalProgress={handleUpdateGoalProgress}
              onDeleteGoal={handleDeleteGoal}
            />
          )}
        </main>
      )}

      <ExpenseFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateTransaction}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
