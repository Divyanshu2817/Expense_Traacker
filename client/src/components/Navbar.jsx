import React, { useEffect, useState } from 'react';
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
  LogOut,
} from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'analytics', label: 'Charts & Analytics', icon: PieChart },
  { id: 'budgets', label: 'Budgets', icon: Wallet },
  { id: 'coach', label: 'Financial Coach', icon: BrainCircuit, badge: 'AI' },
  { id: 'subscriptions', label: 'Subscription Radar', icon: Radar, badge: 'Leak' },
  { id: 'goals', label: 'Savings Goals', icon: Target },
];

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onResetData,
  user,
  onOpenAuth,
  onLogout,
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  return (
    <>
      <style>{`
        .af-navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 12px 24px;
          background: linear-gradient(180deg, rgba(9, 12, 20, 0.92) 0%, rgba(9, 12, 20, 0.82) 100%);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          border-bottom: 1px solid rgba(212, 175, 55, 0.14);
          transition: box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .af-navbar.scrolled {
          box-shadow: 0 8px 30px -12px rgba(0, 0, 0, 0.6);
          border-bottom-color: rgba(212, 175, 55, 0.28);
        }

        .af-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          user-select: none;
        }
        .af-brand-mark {
          position: relative;
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: linear-gradient(135deg, #1a2030 0%, #0c0f18 100%);
          border: 1px solid rgba(212, 175, 55, 0.35);
          color: #d4af37;
        }
        .af-brand-mark::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 13px;
          padding: 1px;
          background: conic-gradient(from 0deg, #d4af37, transparent 30%, transparent 70%, #22d3b0);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: af-spin 6s linear infinite;
          opacity: 0.85;
        }
        @keyframes af-spin {
          to { transform: rotate(360deg); }
        }
        .af-brand-text {
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          background: linear-gradient(90deg, #f3e7c9 0%, #d4af37 55%, #f3e7c9 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .af-brand-sub {
          display: block;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #6b7280;
          margin-top: -2px;
        }

        .af-tabs {
          display: flex;
          align-items: center;
          gap: 4px;
          overflow-x: auto;
          scrollbar-width: none;
          flex: 1;
        }
        .af-tabs::-webkit-scrollbar { display: none; }

        .af-tab {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          white-space: nowrap;
          padding: 8px 14px;
          border-radius: 10px;
          border: 1px solid transparent;
          background: transparent;
          color: #9aa1b0;
          font-size: 0.84rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.18s ease, background 0.18s ease, border-color 0.18s ease, transform 0.15s ease;
        }
        .af-tab:hover {
          color: #e8eaf0;
          background: rgba(255, 255, 255, 0.045);
        }
        .af-tab:active { transform: translateY(1px); }
        .af-tab.active {
          color: #0b0f18;
          background: linear-gradient(90deg, #d4af37 0%, #e8c766 100%);
          border-color: rgba(212, 175, 55, 0.6);
          box-shadow: 0 4px 16px -4px rgba(212, 175, 55, 0.55);
        }
        .af-tab.active svg { color: #0b0f18; }

        .af-badge {
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 2px 6px;
          border-radius: 6px;
          line-height: 1.4;
        }
        .af-badge-ai {
          background: rgba(139, 124, 246, 0.18);
          color: #b6a9ff;
          border: 1px solid rgba(139, 124, 246, 0.4);
        }
        .af-tab.active .af-badge-ai {
          background: rgba(11, 15, 24, 0.15);
          color: #0b0f18;
          border-color: rgba(11, 15, 24, 0.25);
        }
        .af-badge-leak {
          background: rgba(244, 63, 94, 0.16);
          color: #ff9fb0;
          border: 1px solid rgba(244, 63, 94, 0.4);
          animation: af-pulse 2.2s ease-in-out infinite;
        }
        .af-tab.active .af-badge-leak {
          background: rgba(11, 15, 24, 0.15);
          color: #0b0f18;
          border-color: rgba(11, 15, 24, 0.25);
          animation: none;
        }
        @keyframes af-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }

        .af-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .af-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px 6px 6px;
          border-radius: 999px;
          background: rgba(34, 211, 176, 0.1);
          border: 1px solid rgba(34, 211, 176, 0.3);
          color: #a8f0de;
          font-size: 0.82rem;
          font-weight: 600;
        }
        .af-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 0.66rem;
          font-weight: 800;
          background: linear-gradient(135deg, #22d3b0, #0e8f77);
          color: #04231c;
        }

        .af-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          color: #b7bcc8;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .af-icon-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .af-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 10px;
          border: 1px solid rgba(212, 175, 55, 0.35);
          background: rgba(212, 175, 55, 0.06);
          color: #e8c766;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .af-btn-outline:hover {
          background: rgba(212, 175, 55, 0.14);
          border-color: rgba(212, 175, 55, 0.55);
        }

        .af-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(90deg, #22d3b0 0%, #16a690 100%);
          color: #05221c;
          font-size: 0.86rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 18px -6px rgba(34, 211, 176, 0.55);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .af-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 22px -6px rgba(34, 211, 176, 0.7);
        }
        .af-btn-primary:active { transform: translateY(0); }

        @media (max-width: 860px) {
          .af-brand-sub { display: none; }
          .af-tab span:not(.af-badge) { display: none; }
          .af-btn-primary span, .af-btn-outline span { display: none; }
        }
      `}</style>

      <header className={`af-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="af-brand">
          <div className="af-brand-mark">
            <Wallet size={18} />
          </div>
          <div>
            <span className="af-brand-text">AuraFinance</span>
            <span className="af-brand-sub">Money, clarified</span>
          </div>
        </div>

        <nav className="af-tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`af-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`af-badge ${tab.badge === 'AI' ? 'af-badge-ai' : 'af-badge-leak'}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="af-actions">
          {user ? (
            <>
              <span className="af-chip">
                <span className="af-avatar">
                  {initials || <UserCheck size={12} />}
                </span>
                {user.name}
              </span>
              <button className="af-icon-btn" title="Logout" onClick={onLogout}>
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <button className="af-btn-outline" onClick={onOpenAuth}>
              <LogIn size={16} />
              <span>Login / Register</span>
            </button>
          )}

          <button className="af-icon-btn" title="Reset sample dataset" onClick={onResetData}>
            <RotateCcw size={16} />
          </button>

          <button className="af-btn-primary" onClick={onOpenAddModal}>
            <PlusCircle size={18} />
            <span>New Entry</span>
          </button>
        </div>
      </header>
    </>
  );
}