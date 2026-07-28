import React from 'react';
import { Radar, AlertOctagon, IndianRupee, Calendar, Zap, ShieldAlert } from 'lucide-react';

export function SubscriptionRadar({ subData, onOpenAddModal }) {
  const { subscriptionCount = 0, monthlyTotal = 0, yearlyTotal = 0, potentialAnnualSavings = 0, subscriptions = [] } = subData || {};

  return (
    <div className="sub-radar-grid">
      {/* Overview Cards */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.1), rgba(15,23,42,0.8))', border: '1px solid rgba(244,63,94,0.3)' }}>
        <div className="kpi-header">
          <span className="kpi-title">Active Recurring Items</span>
          <Radar size={22} style={{ color: '#f43f5e' }} />
        </div>
        <div className="kpi-value" style={{ color: '#f43f5e' }}>
          {subscriptionCount} Subscriptions
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Tracked monthly auto-renewals & recurring services.
        </p>
      </div>

      <div className="glass-card">
        <div className="kpi-header">
          <span className="kpi-title">Monthly & Yearly Drain</span>
          <Calendar size={22} style={{ color: '#6366f1' }} />
        </div>
        <div className="kpi-value" style={{ color: '#fff' }}>
          ₹{monthlyTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ mo</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#818cf8', fontWeight: 600 }}>
          ₹{yearlyTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })} total annual commitment
        </p>
      </div>

      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(15,23,42,0.8))', border: '1px solid rgba(16,185,129,0.3)' }}>
        <div className="kpi-header">
          <span className="kpi-title">Audit Savings Opportunity</span>
          <Zap size={22} style={{ color: '#10b981' }} />
        </div>
        <div className="kpi-value" style={{ color: '#10b981' }}>
          +₹{potentialAnnualSavings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Estimated annual savings from auditing unused subscriptions.
        </p>
      </div>

      {/* Subscription List */}
      <div className="glass-card sub-list-panel">
        <div className="section-title">
          <h2>Detected Subscription Radar Log</h2>
          <button className="btn-secondary" onClick={onOpenAddModal}>
            + Tag New Subscription
          </button>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Subscription Service</th>
                <th>Category</th>
                <th>Monthly Charge</th>
                <th>Yearly Cumulative</th>
                <th>Leak Risk Flag</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No recurring subscriptions detected. Tag transactions as "Recurring" in the form to track leaks!
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td style={{ fontWeight: 700, fontSize: '0.95rem' }}>{sub.name}</td>
                    <td>
                      <span className="tag-chip">{sub.category}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#f43f5e' }}>₹{Number(sub.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>₹{sub.yearlyCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td>
                      {sub.isLeakRisk ? (
                        <span className="badge badge-expense" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldAlert size={12} /> High Cost Leak Risk (&gt;₹500/mo)
                        </span>
                      ) : (
                        <span className="badge badge-income" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          Standard Rate
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
