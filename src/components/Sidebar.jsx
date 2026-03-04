import React from 'react';
import {
  LayoutDashboard, Receipt, Heart, PieChart, Wallet, Target,
  Settings, LogOut, HelpCircle, TrendingUp, Zap, BarChart3
} from 'lucide-react';

const navGroups = [
  {
    label: 'General',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'expenses', label: 'All Expenses', icon: Receipt },
      { id: 'wishlist', label: 'Wishlist', icon: Heart },
      { id: 'budget', label: 'Budget Planner', icon: PieChart },
    ],
  },
  {
    label: 'Tools',
    items: [
      { id: 'income', label: 'Income', icon: Wallet },
      { id: 'goals', label: 'Goals', icon: Target },
    ],
  },
  {
    label: 'Other',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'help', label: 'Help Center', icon: HelpCircle },
    ],
  },
];

const Sidebar = ({ activeTab, setActiveTab, user, onLogout }) => {
  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-subtle)',
      padding: '1.5rem 1rem',
      zIndex: 40,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0 0.75rem', marginBottom: '2rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, var(--purple-600), var(--purple-400))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(168,85,247,0.3)',
        }}>
          <TrendingUp size={20} color="white" />
        </div>
        <span style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          <span style={{ color: 'var(--purple-400)' }}>Grow</span>
          <span style={{ color: 'var(--text-primary)' }}>Wise</span>
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1 }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: '1.5rem' }}>
            <p style={{
              fontSize: '0.625rem', fontWeight: 600, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              padding: '0 0.75rem', marginBottom: '0.5rem',
            }}>
              {group.label}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.625rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: 'none', cursor: 'pointer',
                      background: isActive ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
                      color: isActive ? 'var(--purple-400)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.8125rem',
                      fontFamily: 'inherit',
                      transition: 'var(--transition)',
                      width: '100%',
                      textAlign: 'left',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    {isActive && (
                      <div style={{
                        position: 'absolute', left: -4, top: '50%', transform: 'translateY(-50%)',
                        width: 3, height: 20, borderRadius: 999,
                        background: 'var(--purple-500)',
                      }} />
                    )}
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Upgrade Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.1))',
        border: '1px solid var(--border-purple)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Zap size={16} color="var(--purple-400)" />
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Upgrade to PRO
          </span>
        </div>
        <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Unlock advanced analytics, AI insights & unlimited goals.
        </p>
      </div>

      {/* User Info + Logout */}
      {user && (
        <div style={{ padding: '0.75rem', marginBottom: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)' }}>
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</p>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{user.email}</p>
        </div>
      )}
      <button
        onClick={onLogout}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.625rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          border: 'none', cursor: 'pointer',
          background: 'transparent',
          color: 'var(--text-muted)',
          fontSize: '0.8125rem', fontFamily: 'inherit', width: '100%',
        }}
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
