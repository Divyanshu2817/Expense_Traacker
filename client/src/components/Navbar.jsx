import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Wallet, 
  BrainCircuit, 
  Radar, 
  Target, 
  PlusCircle, 
  RotateCcw,
  UserCheck,
  LogIn,
  LogOut
} from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, onOpenAddModal, onResetData, user, onOpenAuth, onLogout }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'analytics', label: 'Charts & Analytics', icon: PieChart },
    { id: 'budgets', label: 'Budgets', icon: Wallet },
    { id: 'coach', label: 'Financial Coach', icon: BrainCircuit, badge: 'AI' },
    { id: 'subscriptions', label: 'Subscription Radar', icon: Radar, badge: 'Leak' },
    { id: 'goals', label: 'Savings Goals', icon: Target },
  ];

  return (
    <header className="navbar">
      <div className="brand-logo">
        <div className="brand-icon">
          <Wallet size={22} />
        </div>
        <span>AuraFinance</span>
      </div>

      <nav className="nav-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={17} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  style={{
                    background: tab.badge === 'AI' ? '#8b5cf6' : '#f43f5e',
                    color: '#fff',
                    fontSize: '0.65rem',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    fontWeight: 700,
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <UserCheck size={15} /> {user.name}
            </span>
            <button className="btn-secondary" style={{ padding: '8px' }} title="Logout" onClick={onLogout}>
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button className="btn-secondary" onClick={onOpenAuth}>
            <LogIn size={16} />
            <span>Login / Register</span>
          </button>
        )}

        <button className="btn-secondary" title="Reset sample dataset" onClick={onResetData}>
          <RotateCcw size={16} />
        </button>
        
        <button className="btn-primary" onClick={onOpenAddModal}>
          <PlusCircle size={18} />
          <span>New Entry</span>
        </button>
      </div>
    </header>
  );
}
