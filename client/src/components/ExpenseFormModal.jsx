import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const EXPENSE_CATEGORIES = [
  'Food & Groceries',
  'Housing',
  'Subscriptions',
  'Dining Out',
  'Utilities',
  'Transportation',
  'Fitness & Health',
  'Entertainment',
  'Shopping',
  'General'
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Bonus',
  'Allowance',
  'Rental Income',
  'Other Income'
];

export function ExpenseFormModal({ isOpen, onClose, onSubmit }) {
  const [type, setType] = useState('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Groceries');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [tags, setTags] = useState('');

  if (!isOpen) return null;

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory('Salary');
    } else {
      setCategory('Food & Groceries');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    // For Income, if description is empty, default it to category name
    const finalDescription = type === 'income' 
      ? (description.trim() || `${category} Income`)
      : description.trim();

    onSubmit({
      description: finalDescription,
      amount: parseFloat(amount),
      type,
      category,
      date,
      isRecurring: type === 'income' ? false : isRecurring,
      tags: type === 'income' ? [] : tags.split(',').map((t) => t.trim()).filter(Boolean)
    });

    setDescription('');
    setAmount('');
    setIsRecurring(false);
    setTags('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.4rem' }}>
            {type === 'income' ? 'Add Income' : 'Create Expense'}
          </h2>
          <button className="btn-secondary" style={{ padding: '6px' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Type Toggle */}
          <div className="form-group">
            <label>Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                className="nav-tab-btn"
                style={{
                  justifyContent: 'center',
                  background: type === 'expense' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: type === 'expense' ? '#f43f5e' : 'var(--text-secondary)',
                  border: type === 'expense' ? '1px solid rgba(244,63,94,0.4)' : 'none',
                }}
                onClick={() => handleTypeChange('expense')}
              >
                Expense
              </button>
              <button
                type="button"
                className="nav-tab-btn"
                style={{
                  justifyContent: 'center',
                  background: type === 'income' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: type === 'income' ? '#10b981' : 'var(--text-secondary)',
                  border: type === 'income' ? '1px solid rgba(16,185,129,0.4)' : 'none',
                }}
                onClick={() => handleTypeChange('income')}
              >
                Income
              </button>
            </div>
          </div>

          {/* If Expense, show Description input */}
          {type === 'expense' && (
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Groceries, Netflix Subscription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          )}

          {/* Amount & Category */}
          <div className="form-grid-2">
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {(type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                  <option key={cat} value={cat} style={{ background: '#0f172a' }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="form-group">
            <label>Transaction Date</label>
            <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          {/* If Expense, show Tags and Recurring */}
          {type === 'expense' && (
            <>
              <div className="form-group">
                <label>Tags (Comma Separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Work, Fixed, Travel"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#6366f1' }}
                />
                <label htmlFor="recurring" style={{ margin: 0, cursor: 'pointer' }}>
                  Recurring Monthly Charge (Subscription)
                </label>
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={16} /> {type === 'income' ? 'Save Income' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
