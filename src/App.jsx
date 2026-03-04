import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/AuthPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ExpenseSection from './components/ExpenseSection';
import WishlistSection from './components/WishlistSection';
import BudgetSection from './components/BudgetSection';
import Settings from './components/Settings';
import HelpCenter from './components/HelpCenter';
import { expenseAPI, wishlistAPI, budgetAPI, categoryBudgetAPI } from './utils/api';
import { getGreeting } from './utils/helpers';
import { Search, Bell, Plus, User, Loader2 } from 'lucide-react';

const AppContent = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [budget, setBudget] = useState({ income: 0, weeklyBudget: 0, monthlyBudget: 0 });
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const [exp, wl, bud, catBud] = await Promise.all([
          expenseAPI.getAll(),
          wishlistAPI.getAll(),
          budgetAPI.get(),
          categoryBudgetAPI.getAll(),
        ]);
        setExpenses(exp);
        setWishlist(wl);
        setBudget(bud);
        setCategoryBudgets(catBud);
      } catch (err) {
        console.error('Data fetch error:', err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  if (!isAuthenticated) return <AuthPage />;

  if (dataLoading) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '1rem',
      }}>
        <Loader2 size={32} style={{ color: 'var(--purple-400)', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading your data...</p>
      </div>
    );
  }

  const income = budget.income || 0;
  const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);
  const balance = income - totalExpenses;

  // CRUD wrappers
  const handleAddExpense = async (data) => {
    const created = await expenseAPI.create(data);
    setExpenses(prev => [created, ...prev]);
    return created;
  };
  const handleUpdateExpense = async (id, data) => {
    const updated = await expenseAPI.update(id, data);
    setExpenses(prev => prev.map(e => e.id === id ? updated : e));
    return updated;
  };
  const handleDeleteExpense = async (id) => {
    await expenseAPI.delete(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };
  const handleAddWishlistItem = async (data) => {
    const created = await wishlistAPI.create(data);
    setWishlist(prev => [created, ...prev]);
    return created;
  };
  const handleUpdateWishlistItem = async (id, data) => {
    const updated = await wishlistAPI.update(id, data);
    setWishlist(prev => prev.map(i => i.id === id ? updated : i));
    return updated;
  };
  const handleDeleteWishlistItem = async (id) => {
    await wishlistAPI.delete(id);
    setWishlist(prev => prev.filter(i => i.id !== id));
  };
  const handleUpdateBudget = async (data) => {
    const updated = await budgetAPI.update(data);
    setBudget(updated);
    return updated;
  };

  // Category budget CRUD
  const handleAddCategoryBudget = async (data) => {
    const created = await categoryBudgetAPI.create(data);
    setCategoryBudgets(prev => {
      const existing = prev.findIndex(c => c.category === created.category);
      if (existing >= 0) {
        return prev.map((c, i) => i === existing ? created : c);
      }
      return [...prev, created];
    });
    return created;
  };
  const handleUpdateCategoryBudget = async (id, data) => {
    const updated = await categoryBudgetAPI.update(id, data);
    setCategoryBudgets(prev => prev.map(c => c.id === id ? updated : c));
    return updated;
  };
  const handleDeleteCategoryBudget = async (id) => {
    await categoryBudgetAPI.delete(id);
    setCategoryBudgets(prev => prev.filter(c => c.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard expenses={expenses} income={income} wishlist={wishlist} onUpdateBudget={handleUpdateBudget} budget={budget} />;
      case 'expenses':
        return <ExpenseSection expenses={expenses} income={income} onAdd={handleAddExpense} onUpdate={handleUpdateExpense} onDelete={handleDeleteExpense} />;
      case 'wishlist':
        return <WishlistSection items={wishlist} balance={balance} onAdd={handleAddWishlistItem} onUpdate={handleUpdateWishlistItem} onDelete={handleDeleteWishlistItem} />;
      case 'budget':
        return (
          <BudgetSection
            expenses={expenses}
            budget={budget}
            onUpdateBudget={handleUpdateBudget}
            categoryBudgets={categoryBudgets}
            onAddCategoryBudget={handleAddCategoryBudget}
            onUpdateCategoryBudget={handleUpdateCategoryBudget}
            onDeleteCategoryBudget={handleDeleteCategoryBudget}
            onAddExpense={handleAddExpense}
          />
        );
      case 'settings':
        return <Settings />;
      case 'help':
        return <HelpCenter />;
      default:
        return <Dashboard expenses={expenses} income={income} wishlist={wishlist} onUpdateBudget={handleUpdateBudget} budget={budget} />;
    }
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={logout} />
      <div style={{ flex: 1, marginLeft: 'var(--sidebar-width)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{
          height: 'var(--header-height)', borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 2rem', background: 'rgba(10, 10, 15, 0.8)',
          backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 30,
        }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
              {getGreeting()}, <span className="text-gradient">{user?.name?.split(' ')[0] || 'User'}</span> 👋
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Track your expenses and transactions</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.04)' }}>
              🕐 {timeStr} | {dateStr} | IN
            </div>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input placeholder="Search expenses, transactions..." style={{
                width: 260, padding: '0.5rem 0.75rem 0.5rem 2rem',
                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                fontSize: '0.8125rem', fontFamily: 'inherit', outline: 'none',
              }} />
            </div>
            <button style={{ position: 'relative', padding: 8, background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', background: 'var(--purple-500)' }} />
            </button>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--purple-500), var(--blue))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: '2px solid var(--border-light)',
              fontSize: '0.75rem', fontWeight: 700,
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || <User size={18} />}
            </div>
          </div>
        </header>
        <main style={{ flex: 1, padding: '1.5rem 2rem 3rem', overflowY: 'auto' }}>
          {renderContent()}
        </main>
      </div>
      <button className="fab" title="Quick Add"><Plus size={24} /></button>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
