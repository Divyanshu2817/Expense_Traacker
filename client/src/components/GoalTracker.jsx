import React, { useState } from 'react';
import { Target, Plus, CheckCircle, Trophy, Plane, ShieldCheck, Laptop, Sparkles, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function GoalTracker({ goals, onCreateGoal, onUpdateGoalProgress, onDeleteGoal }) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Savings');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title || !targetAmount || !targetDate) return;
    onCreateGoal({
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount || 0),
      targetDate,
      category,
    });
    setTitle('');
    setTargetAmount('');
    setCurrentAmount('');
    setTargetDate('');
  };

  const handleAddDeposit = (goal, depositAmt) => {
    const newTotal = (goal.currentAmount || 0) + depositAmt;
    onUpdateGoalProgress(goal._id || goal.id, newTotal);

    if (newTotal >= goal.targetAmount) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
      {/* Goal Creation Card */}
      <div className="glass-card">
        <div className="section-title">
          <h2>Create Savings Target</h2>
        </div>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Goal Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Ladakh Trip, Emergency Reserve"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Target Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="50000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Initial Deposit (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="5000"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Target Completion Date</label>
            <input
              type="date"
              className="form-input"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <Plus size={16} /> Establish Goal
          </button>
        </form>
      </div>

      {/* Goals Progress Meters */}
      <div className="glass-card" style={{ gridColumn: 'span 2' }}>
        <div className="section-title">
          <h2>Active Financial Milestones ({goals.length})</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {goals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No savings goals established yet. Start planning for your dream milestones on the left!
            </div>
          ) : (
            goals.map((g) => {
              const target = g.targetAmount || 1;
              const current = g.currentAmount || 0;
              const pct = Math.min(100, Math.round((current / target) * 100));
              const isAchieved = current >= target;

              return (
                <div
                  key={g._id || g.id}
                  style={{
                    background: 'rgba(2, 6, 23, 0.5)',
                    border: `1px solid ${isAchieved ? 'rgba(16,185,129,0.5)' : 'var(--border-glass)'}`,
                    borderRadius: '16px',
                    padding: '20px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          background: isAchieved ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)',
                          color: isAchieved ? '#10b981' : '#818cf8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isAchieved ? <Trophy size={20} /> : <Target size={20} />}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{g.title}</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Target Date: {g.targetDate}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleAddDeposit(g, 1000)}>
                        +₹1,000
                      </button>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleAddDeposit(g, 5000)}>
                        +₹5,000
                      </button>
                      <button className="btn-danger" onClick={() => onDeleteGoal(g._id || g.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Funded: <strong>₹{current.toLocaleString('en-IN')}</strong> of ₹{target.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontWeight: 700, color: isAchieved ? '#10b981' : '#818cf8' }}>
                      {pct}% Complete
                    </span>
                  </div>

                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: isAchieved ? '#10b981' : '#6366f1',
                        boxShadow: `0 0 12px ${isAchieved ? '#10b981' : '#6366f1'}`,
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
