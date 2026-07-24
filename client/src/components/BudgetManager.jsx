import React, { useState } from 'react';
import { Wallet, AlertTriangle, CheckCircle, Plus, Trash2 } from 'lucide-react';

export function BudgetManager({ budgets, summaryData, onSaveBudget, onDeleteBudget }) {
  const [category, setCategory] = useState('Food & Groceries');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('80');

  const { categoryBreakdown = {} } = summaryData || {};

  const handleSave = (e) => {
    e.preventDefault();
    if (!monthlyLimit) return;
    onSaveBudget({ category, monthlyLimit: parseFloat(monthlyLimit), alertThreshold: parseInt(alertThreshold) });
    setMonthlyLimit('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
      {/* Create / Edit Budget Form */}
      <div className="glass-card">
        <div className="section-title">
          <h2>Set Category Budget</h2>
        </div>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Category</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {['Housing', 'Food & Groceries', 'Subscriptions', 'Dining Out', 'Utilities', 'Transportation', 'Fitness & Health', 'Entertainment', 'Shopping', 'General'].map((cat) => (
                <option key={cat} value={cat} style={{ background: '#0f172a' }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Monthly Spending Cap (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 15000"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Alert Warning Threshold ({alertThreshold}%)</label>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              className="sim-slider"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <Plus size={16} /> Save Budget Goal
          </button>
        </form>
      </div>

      {/* Budget Progress List */}
      <div className="glass-card" style={{ gridColumn: 'span 2' }}>
        <div className="section-title">
          <h2>Budget Target Progress</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {budgets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No budgets established yet. Create your first cap on the left!
            </div>
          ) : (
            budgets.map((b) => {
              const spent = categoryBreakdown[b.category] || 0;
              const limit = b.monthlyLimit || 1;
              const pct = Math.min(100, Math.round((spent / limit) * 100));
              const isOver = spent > limit;
              const isWarning = pct >= (b.alertThreshold || 80) && !isOver;

              let statusColor = '#10b981';
              if (isOver) statusColor = '#f43f5e';
              else if (isWarning) statusColor = '#f59e0b';

              return (
                <div
                  key={b._id || b.id}
                  style={{
                    background: 'rgba(2, 6, 23, 0.5)',
                    border: `1px solid ${isOver ? 'rgba(244,63,94,0.4)' : 'var(--border-glass)'}`,
                    borderRadius: '16px',
                    padding: '16px 20px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>{b.category}</span>
                      {isOver && (
                        <span className="badge badge-expense" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={12} /> Over Limit
                        </span>
                      )}
                      {isWarning && (
                        <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
                          Warning ({pct}%)
                        </span>
                      )}
                      {!isOver && !isWarning && (
                        <span className="badge badge-income" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={12} /> Healthy
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: 700, color: statusColor }}>
                        ₹{spent.toLocaleString('en-IN', { minimumFractionDigits: 2 })} / ₹{limit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <button className="btn-danger" onClick={() => onDeleteBudget(b._id || b.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: statusColor,
                        boxShadow: `0 0 10px ${statusColor}`,
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
