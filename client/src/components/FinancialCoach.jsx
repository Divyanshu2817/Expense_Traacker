import React, { useState } from 'react';
import { BrainCircuit, Award, Sliders, AlertCircle, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';

export function FinancialCoach({ healthData, summaryData }) {
  const [diningCut, setDiningCut] = useState(20);
  const [subCut, setSubCut] = useState(15);

  const { healthScore = 75, tier = 'Financial Gold', badgeColor = '#3b82f6', breakdown = {}, metrics = {}, insights = [] } = healthData || {};
  const { totalIncome = 0, totalExpense = 0 } = summaryData || {};

  const diningOutSpent = metrics.diningOut || 0;
  const recurringSpent = metrics.recurringExpense || 0;

  const diningSaved = (diningOutSpent * (diningCut / 100));
  const subSaved = (recurringSpent * (subCut / 100));
  const totalMonthlySavingsSim = diningSaved + subSaved;
  const totalYearlySavingsSim = totalMonthlySavingsSim * 12;

  const newExpenseSim = Math.max(0, totalExpense - totalMonthlySavingsSim);
  const newSavingsRatioSim = totalIncome > 0 ? Math.min(100, (((totalIncome - newExpenseSim) / totalIncome) * 100)) : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
      {/* 0-100 Score Card */}
      <div className="glass-card" style={{ textAlign: 'center' }}>
        <div className="section-title" style={{ justifyContent: 'center' }}>
          <h2>
            <BrainCircuit size={20} style={{ color: '#8b5cf6', verticalAlign: 'middle', marginRight: '6px' }} />
            AI Financial Health Score
          </h2>
        </div>

        <div className="score-circle" style={{ border: `4px solid ${badgeColor}`, boxShadow: `0 0 25px ${badgeColor}55` }}>
          <span style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'Outfit', color: '#fff' }}>
            {healthScore}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>out of 100</span>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: `${badgeColor}22`,
            color: badgeColor,
            border: `1px solid ${badgeColor}55`,
            padding: '6px 14px',
            borderRadius: '20px',
            fontWeight: 700,
            fontSize: '0.9rem',
            marginBottom: '20px',
          }}
        >
          <Award size={16} /> {tier}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', textAlign: 'left' }}>
          <div style={{ background: 'rgba(2,6,23,0.5)', padding: '12px', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Savings Weight</span>
            <div style={{ fontWeight: 700, color: '#10b981' }}>{breakdown.savingsScore || 0} / 35 pts</div>
          </div>
          <div style={{ background: 'rgba(2,6,23,0.5)', padding: '12px', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Budget Adherence</span>
            <div style={{ fontWeight: 700, color: '#3b82f6' }}>{breakdown.budgetScore || 0} / 35 pts</div>
          </div>
          <div style={{ background: 'rgba(2,6,23,0.5)', padding: '12px', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fixed Obligation Burden</span>
            <div style={{ fontWeight: 700, color: '#8b5cf6' }}>{breakdown.subScore || 0} / 15 pts</div>
          </div>
          <div style={{ background: 'rgba(2,6,23,0.5)', padding: '12px', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Discretionary Velocity</span>
            <div style={{ fontWeight: 700, color: '#f59e0b' }}>{breakdown.discretionaryScore || 0} / 15 pts</div>
          </div>
        </div>
      </div>

      {/* AI Smart Recommendations */}
      <div className="glass-card">
        <div className="section-title">
          <h2>Automated AI Coach Insights</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {insights.map((ins, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(2, 6, 23, 0.6)',
                borderLeft: `4px solid ${
                  ins.type === 'danger'
                    ? '#f43f5e'
                    : ins.type === 'warning'
                    ? '#f59e0b'
                    : ins.type === 'success'
                    ? '#10b981'
                    : '#6366f1'
                }`,
                padding: '14px 16px',
                borderRadius: '12px',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={15} style={{ color: '#8b5cf6' }} />
                {ins.title}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{ins.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What-If Scenario Planner */}
      <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
        <div className="section-title">
          <h2>
            <Sliders size={20} style={{ color: '#10b981', verticalAlign: 'middle', marginRight: '6px' }} />
            "What-If" Scenario Simulator
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div>
            <div className="form-group">
              <label>Reduce Dining Out Expenses by {diningCut}%</label>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                className="sim-slider"
                value={diningCut}
                onChange={(e) => setDiningCut(Number(e.target.value))}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Current Dining Out Spend: ₹{diningOutSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}/mo
              </span>
            </div>

            <div className="form-group">
              <label>Optimize / Trim Subscriptions by {subCut}%</label>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                className="sim-slider"
                value={subCut}
                onChange={(e) => setSubCut(Number(e.target.value))}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Current Subscription Spend: ₹{recurringSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}/mo
              </span>
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(99,102,241,0.1))',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase' }}>
              Projected Financial Impact
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '8px 0' }}>
              +₹{totalMonthlySavingsSim.toLocaleString('en-IN', { minimumFractionDigits: 2 })} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ month</span>
            </div>
            <div style={{ fontSize: '1.1rem', color: '#818cf8', fontWeight: 700, marginBottom: '10px' }}>
              +₹{totalYearlySavingsSim.toLocaleString('en-IN', { minimumFractionDigits: 2 })} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>annual liquidity gain</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Boosting your monthly savings rate from {metrics.savingsRatio || 0}% to <strong>{newSavingsRatioSim.toFixed(1)}%</strong>!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
