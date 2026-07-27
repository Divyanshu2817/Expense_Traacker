import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import { isMongoConnected } from '../config/db.js';
import { memoryStore } from '../utils/store.js';
import Goal from '../models/Goal.js';

const getRawData = async (req) => {
  const userId = req.userId;
  if (isMongoConnected) {
    const query = {
      $or: [
        { userId },
        { userId: 'u1' },
        { userId: 'default_user' },
        { userId: { $exists: false } }
      ]
    };
    const transactions = await Transaction.find(query).sort({ date: -1 });
    const budgets = await Budget.find(query);
    const goals = await Goal.find(query);
    return { transactions, budgets, goals };
  }
  const userT = memoryStore.transactions.filter(t => !t.userId || t.userId === userId || t.userId === 'u1' || t.userId === 'default_user');
  const userB = memoryStore.budgets.filter(b => !b.userId || b.userId === userId || b.userId === 'u1' || b.userId === 'default_user');
  const userG = memoryStore.goals ? memoryStore.goals.filter(g => !g.userId || g.userId === userId || g.userId === 'u1' || g.userId === 'default_user') : [];
  return { transactions: userT, budgets: userB, goals: userG };
};

export const getSummary = async (req, res) => {
  try {
    const { transactions, goals = [] } = await getRawData(req);

    let allTimeIncome = 0;
    let allTimeExpense = 0;
    let currentMonthIncome = 0;
    let currentMonthExpense = 0;
    const categoryTotals = {};
    
    // Determine the latest month in the dataset
    let latestMonthKey = '';
    transactions.forEach(t => {
      const dateObj = new Date(t.date);
      if (!isNaN(dateObj.getTime())) {
        const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
        if (monthKey > latestMonthKey) {
          latestMonthKey = monthKey;
        }
      }
    });
    if (!latestMonthKey) {
      const now = new Date();
      latestMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    transactions.forEach(t => {
      const amt = Number(t.amount) || 0;
      const tType = String(t.type || '').trim().toLowerCase();
      
      const dateObj = new Date(t.date);
      const isCurrentMonth = !isNaN(dateObj.getTime()) && 
                             `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}` === latestMonthKey;

      if (tType === 'income') {
        allTimeIncome += amt;
        if (isCurrentMonth) currentMonthIncome += amt;
      } else if (tType === 'expense') {
        allTimeExpense += amt;
        if (isCurrentMonth) currentMonthExpense += amt;
        if (t.category) {
          categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amt;
        }
      }
    });

    const totalGoalsFunded = goals.reduce((acc, goal) => acc + (Number(goal.currentAmount) || 0), 0);
    const allTimeNetBalance = allTimeIncome - allTimeExpense;
    
    // Past months' money left is everything that is NOT current month
    const pastMonthsSavings = allTimeNetBalance - (currentMonthIncome - currentMonthExpense);
    
    // Deduct funded goals from past savings
    const remainingPastSavings = pastMonthsSavings - totalGoalsFunded;
    
    let savings = 0;
    let currentMonthMoneyLeft = currentMonthIncome - currentMonthExpense;
    
    if (remainingPastSavings < 0) {
      // Goal funding exceeded past savings, dip into current month's money left
      savings = 0;
      currentMonthMoneyLeft += remainingPastSavings; 
    } else {
      savings = remainingPastSavings;
    }

    const totalIncome = currentMonthIncome;
    const totalExpense = currentMonthExpense;
    const netBalance = currentMonthMoneyLeft;

    // Monthly breakdown data for Chart.js
    const monthlyMap = {};
    transactions.forEach(t => {
      const dateObj = new Date(t.date);
      if (isNaN(dateObj.getTime())) return;
      const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { income: 0, expense: 0 };
      }
      const tType = String(t.type || '').trim().toLowerCase();
      if (tType === 'income') {
        monthlyMap[monthKey].income += Number(t.amount);
      } else if (tType === 'expense') {
        monthlyMap[monthKey].expense += Number(t.amount);
      }
    });

    const sortedMonths = Object.keys(monthlyMap).sort();
    const chartLabels = sortedMonths.map(m => {
      const [year, month] = m.split('-');
      const d = new Date(Number(year), Number(month) - 1, 1);
      return d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    });

    const incomeTrend = sortedMonths.map(m => monthlyMap[m].income);
    const expenseTrend = sortedMonths.map(m => monthlyMap[m].expense);

    return res.json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        netBalance,
        savings,
        transactionCount: transactions.length
      },
      categoryBreakdown: categoryTotals,
      chartData: {
        labels: chartLabels.length > 0 ? chartLabels : ['Jul 26'],
        income: incomeTrend.length > 0 ? incomeTrend : [totalIncome],
        expense: expenseTrend.length > 0 ? expenseTrend : [totalExpense]
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getFinancialHealth = async (req, res) => {
  try {
    const { transactions, budgets } = await getRawData(req);

    let totalIncome = 0;
    let totalExpense = 0;
    let recurringExpense = 0;
    const categorySpent = {};

    transactions.forEach(t => {
      const amt = Number(t.amount) || 0;
      const tType = String(t.type || '').trim().toLowerCase();
      if (tType === 'income') {
        totalIncome += amt;
      } else if (tType === 'expense') {
        totalExpense += amt;
        if (t.category) {
          categorySpent[t.category] = (categorySpent[t.category] || 0) + amt;
        }
        if (t.isRecurring || String(t.category).toLowerCase() === 'subscriptions') {
          recurringExpense += amt;
        }
      }
    });

    const savingsRatio = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    let savingsScore = 0;
    if (savingsRatio >= 30) savingsScore = 35;
    else if (savingsRatio >= 20) savingsScore = 30;
    else if (savingsRatio >= 10) savingsScore = 20;
    else if (savingsRatio > 0) savingsScore = 10;

    let budgetScore = 35;
    let exceededBudgets = [];
    budgets.forEach(b => {
      const spent = categorySpent[b.category] || 0;
      if (spent > b.monthlyLimit) {
        budgetScore -= 10;
        exceededBudgets.push(b.category);
      }
    });
    budgetScore = Math.max(0, budgetScore);

    const subRatio = totalIncome > 0 ? (recurringExpense / totalIncome) * 100 : 0;
    let subScore = 15;
    if (subRatio > 40) subScore = 5;
    else if (subRatio > 25) subScore = 10;

    const diningOut = categorySpent['Dining Out'] || 0;
    const diningRatio = totalExpense > 0 ? (diningOut / totalExpense) * 100 : 0;
    let discretionaryScore = 15;
    if (diningRatio > 20) discretionaryScore = 5;
    else if (diningRatio > 10) discretionaryScore = 10;

    const totalHealthScore = Math.min(100, Math.max(0, Math.round(savingsScore + budgetScore + subScore + discretionaryScore)));

    let tier = 'Needs Focus';
    let badgeColor = '#ef4444';
    if (totalHealthScore >= 85) { tier = 'Financial Platinum'; badgeColor = '#10b981'; }
    else if (totalHealthScore >= 70) { tier = 'Financial Gold'; badgeColor = '#3b82f6'; }
    else if (totalHealthScore >= 50) { tier = 'Financial Silver'; badgeColor = '#f59e0b'; }

    const insights = [];
    if (savingsRatio < 20) {
      insights.push({
        type: 'warning',
        title: 'Increase Savings Reserve',
        text: `Your current savings rate is ${savingsRatio.toFixed(1)}%. Financial experts recommend saving at least 20% of net income.`
      });
    } else {
      insights.push({
        type: 'success',
        title: 'Strong Savings Velocity',
        text: `Awesome! You are saving ${savingsRatio.toFixed(1)}% of your income. Keep investing the surplus.`
      });
    }

    if (exceededBudgets.length > 0) {
      insights.push({
        type: 'danger',
        title: 'Over-Budget Categories Detected',
        text: `You have exceeded limits in: ${exceededBudgets.join(', ')}. Review these entry logs.`
      });
    }

    if (recurringExpense > 0) {
      insights.push({
        type: 'info',
        title: 'Subscription Radar Alert',
        text: `You have ₹${recurringExpense.toFixed(2)} in monthly recurring obligations (₹${(recurringExpense * 12).toFixed(2)}/yr).`
      });
    }

    return res.json({
      success: true,
      healthScore: totalHealthScore,
      tier,
      badgeColor,
      breakdown: {
        savingsScore,
        budgetScore,
        subScore,
        discretionaryScore
      },
      metrics: {
        savingsRatio: Number(savingsRatio.toFixed(1)),
        recurringExpense,
        diningOut,
        exceededBudgetsCount: exceededBudgets.length
      },
      insights
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getSubscriptionRadar = async (req, res) => {
  try {
    const { transactions } = await getRawData(req);
    const recurring = transactions.filter(t => {
      const tType = String(t.type || '').trim().toLowerCase();
      return tType === 'expense' && (t.isRecurring || String(t.category).toLowerCase() === 'subscriptions');
    });

    const monthlyTotal = recurring.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const yearlyTotal = monthlyTotal * 12;

    const items = recurring.map(t => ({
      id: t._id || t.id,
      name: t.description,
      amount: t.amount,
      category: t.category,
      date: t.date,
      yearlyCost: Number((t.amount * 12).toFixed(2)),
      isLeakRisk: t.amount > 500
    }));

    return res.json({
      success: true,
      subscriptionCount: items.length,
      monthlyTotal: Number(monthlyTotal.toFixed(2)),
      yearlyTotal: Number(yearlyTotal.toFixed(2)),
      potentialAnnualSavings: Number((yearlyTotal * 0.25).toFixed(2)),
      subscriptions: items
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const resetSeedData = async (req, res) => {
  try {
    const userId = req.userId;
    memoryStore.resetSeed(userId);
    return res.json({ success: true, message: 'Sample dataset re-initialized successfully!' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
