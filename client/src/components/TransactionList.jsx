import React, { useState } from 'react';
import { Search, Filter, Trash2, Tag, Calendar, ArrowUpDown } from 'lucide-react';

export function TransactionList({ transactions, onDeleteTransaction, onOpenAddModal }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const categories = ['All', ...new Set(transactions.map((t) => t.category))];

  const filtered = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())));
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesType = selectedType === 'All' || t.type?.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesCat && matchesType;
  });

  return (
    <div className="glass-card">
      <div className="section-title">
        <h2>Transaction History ({filtered.length})</h2>
        <button className="btn-primary" onClick={onOpenAddModal}>
          + Add Entry
        </button>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search description or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {categories.filter((c) => c !== 'All').map((cat) => (
            <option key={cat} value={cat} style={{ background: '#0f172a' }}>
              {cat}
            </option>
          ))}
        </select>

        <select className="form-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="income">Income Only</option>
          <option value="expense">Expense Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th>Type</th>
              <th>Tags</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No matching transactions found.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t._id || t.id}>
                  <td style={{ fontWeight: 600 }}>
                    {t.description}
                    {t.isRecurring && (
                      <span
                        style={{
                          marginLeft: '8px',
                          fontSize: '0.7rem',
                          background: 'rgba(99, 102, 241, 0.2)',
                          color: '#818cf8',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        Recurring
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="tag-chip" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc' }}>
                      {t.category}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{t.date}</td>
                  <td>
                    <span className={`badge ${t.type?.toLowerCase() === 'income' ? 'badge-income' : 'badge-expense'}`}>
                      {t.type?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {t.tags && t.tags.length > 0 ? (
                      t.tags.map((tag, idx) => (
                        <span key={idx} className="tag-chip">
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                    )}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      fontWeight: 700,
                      color: t.type?.toLowerCase() === 'income' ? '#10b981' : '#f8fafc',
                    }}
                  >
                    {t.type?.toLowerCase() === 'income' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn-danger"
                      onClick={() => onDeleteTransaction(t._id || t.id)}
                      title="Delete record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
