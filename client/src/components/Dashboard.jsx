import React from 'react';
import { TrendingUp, TrendingDown, IndianRupee, PiggyBank, ArrowUpRight, ArrowDownRight, ShieldCheck, Zap } from 'lucide-react';
import { VisualCharts } from './VisualCharts';

export function Dashboard({ summaryData, transactions, onOpenAddModal, setActiveTab }) {
  const { totalIncome = 0, totalExpense = 0, netBalance = 0, savings = 0 } = summaryData?.summary || {};

  return (
    <div>
      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="glass-card kpi-card" style={{ '--card-glow': '#10b981' }}>
          <div className="kpi-header">
            <span className="kpi-title">Total Monthly Income</span>
            <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <TrendingUp size={22} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#10b981' }}>
            ₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="kpi-subtext" style={{ color: '#10b981' }}>
            <ArrowUpRight size={14} /> +12.4% from last month
          </div>
        </div>

        <div className="glass-card kpi-card" style={{ '--card-glow': '#f43f5e' }}>
          <div className="kpi-header">
            <span className="kpi-title">Total Expenses</span>
            <div className="kpi-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
              <TrendingDown size={22} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#f43f5e' }}>
            ₹{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="kpi-subtext" style={{ color: '#f43f5e' }}>
            <ArrowDownRight size={14} /> Controlled velocity
          </div>
        </div>

        <div className="glass-card kpi-card" style={{ '--card-glow': '#6366f1' }}>
          <div className="kpi-header">
            <span className="kpi-title">Money Left</span>
            <div className="kpi-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
              <IndianRupee size={22} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: netBalance >= 0 ? '#f8fafc' : '#f43f5e' }}>
            ₹{netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="kpi-subtext">
            <ShieldCheck size={14} /> Available to spend
          </div>
        </div>

        <div className="glass-card kpi-card" style={{ '--card-glow': '#8b5cf6' }}>
          <div className="kpi-header">
            <span className="kpi-title">Savings</span>
            <div className="kpi-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
              <PiggyBank size={22} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#8b5cf6' }}>
            ₹{savings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="kpi-subtext" style={{ color: savings > 0 ? '#10b981' : '#f59e0b' }}>
            <Zap size={14} /> {savings > 0 ? 'Surplus saved!' : 'No savings yet'}
          </div>
        </div>
      </div>

      {/* Visual Analytics Quick View */}
      <div className="charts-quick-grid">
        <div className="glass-card">
          <div className="section-title">
            <h2>Cash Flow Trend</h2>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setActiveTab('analytics')}>
              Full Charts
            </button>
          </div>
          <VisualCharts summaryData={summaryData} mode="trend" />
        </div>

        <div className="glass-card">
          <div className="section-title">
            <h2>Category Distribution</h2>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setActiveTab('analytics')}>
              Breakdown
            </button>
          </div>
          <VisualCharts summaryData={summaryData} mode="category" />
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-card">
        <div className="section-title">
          <h2>Recent Activity Log</h2>
          <button className="btn-secondary" onClick={() => setActiveTab('transactions')}>
            View All Log Entries
          </button>
        </div>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((t) => (
                <tr key={t._id || t.id}>
                  <td style={{ fontWeight: 600 }}>{t.description}</td>
                  <td>
                    <span className="tag-chip">{t.category}</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{t.date}</td>
                  <td>
                    <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                      {t.type.toUpperCase()}
                    </span>
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      fontWeight: 700,
                      color: t.type === 'income' ? '#10b981' : '#f8fafc',
                    }}
                  >
                    {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
