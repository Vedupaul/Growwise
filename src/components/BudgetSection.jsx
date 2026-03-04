import React, { useState } from 'react';
import Card from './Card';
import { TrendLineChart } from './Charts';
import { AlertTriangle, TrendingUp, TrendingDown, Settings, Plus, Trash2, Edit2, Check, X, IndianRupee } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const COLORS = ['#f97316', '#3b82f6', '#a855f7', '#22c55e', '#ec4899', '#14b8a6', '#eab308', '#8b5cf6', '#ef4444', '#06b6d4'];

const BudgetSection = ({ expenses, budget, onUpdateBudget, categoryBudgets, onAddCategoryBudget, onUpdateCategoryBudget, onDeleteCategoryBudget, onAddExpense }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localBudget, setLocalBudget] = useState({
        weeklyBudget: budget.weeklyBudget || 0,
        monthlyBudget: budget.monthlyBudget || 0,
        income: budget.income || 0,
    });
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCat, setNewCat] = useState({ category: '', limit: '', color: COLORS[0] });
    const [editingCatId, setEditingCatId] = useState(null);
    const [editCatLimit, setEditCatLimit] = useState('');
    const [saving, setSaving] = useState(false);
    const [loggingCatId, setLoggingCatId] = useState(null);
    const [logForm, setLogForm] = useState({ title: '', amount: '' });
    const [logSaving, setLogSaving] = useState(false);

    const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);
    const monthlyBudget = localBudget.monthlyBudget || 1; // avoid NaN
    const monthlyPercent = localBudget.monthlyBudget > 0 ? Math.min((totalSpent / localBudget.monthlyBudget) * 100, 100) : 0;
    const weeklySpent = Math.round(totalSpent / 4);
    const weeklyBudget = localBudget.weeklyBudget || 1;
    const weeklyPercent = localBudget.weeklyBudget > 0 ? Math.min((weeklySpent / localBudget.weeklyBudget) * 100, 100) : 0;

    const getProgressColor = (pct) => {
        if (pct >= 100) return 'progress-red';
        if (pct >= 80) return 'progress-amber';
        return 'progress-purple';
    };

    const handleSaveBudget = async () => {
        try {
            await onUpdateBudget(localBudget);
            setIsEditing(false);
        } catch (err) { console.error(err); }
    };

    // Compute actual spending per category from expenses
    const categorySpending = expenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
    }, {});

    const handleAddCategory = async () => {
        if (!newCat.category) return;
        setSaving(true);
        try {
            await onAddCategoryBudget({
                category: newCat.category,
                limit: parseFloat(newCat.limit) || 0,
                color: newCat.color,
            });
            setNewCat({ category: '', limit: '', color: COLORS[(categoryBudgets.length + 1) % COLORS.length] });
            setShowAddCategory(false);
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const handleUpdateCatLimit = async (cat) => {
        try {
            await onUpdateCategoryBudget(cat.id, { limit: parseFloat(editCatLimit) || 0 });
            setEditingCatId(null);
        } catch (err) { console.error(err); }
    };

    const handleDeleteCat = async (id) => {
        try { await onDeleteCategoryBudget(id); } catch (err) { console.error(err); }
    };

    const handleLogExpense = async (category) => {
        if (!logForm.title || !logForm.amount) return;
        setLogSaving(true);
        try {
            await onAddExpense({
                title: logForm.title,
                amount: parseFloat(logForm.amount),
                category,
                status: 'Paid',
                dueDate: new Date().toISOString().split('T')[0],
            });
            setLogForm({ title: '', amount: '' });
            setLoggingCatId(null);
        } catch (err) { console.error(err); }
        finally { setLogSaving(false); }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Budget Planner</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: 4 }}>Set limits and track your spending against budget</p>
                </div>
                <button className="btn-secondary" onClick={() => isEditing ? handleSaveBudget() : setIsEditing(true)}>
                    <Settings size={16} /> {isEditing ? 'Save' : 'Edit Limits'}
                </button>
            </div>

            {isEditing && (
                <Card>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Monthly Income (₹)</label>
                            <input className="input-field" type="number" value={localBudget.income}
                                onChange={(e) => setLocalBudget({ ...localBudget, income: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Monthly Budget (₹)</label>
                            <input className="input-field" type="number" value={localBudget.monthlyBudget}
                                onChange={(e) => setLocalBudget({ ...localBudget, monthlyBudget: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Weekly Budget (₹)</label>
                            <input className="input-field" type="number" value={localBudget.weeklyBudget}
                                onChange={(e) => setLocalBudget({ ...localBudget, weeklyBudget: parseInt(e.target.value) || 0 })} />
                        </div>
                    </div>
                </Card>
            )}

            {/* Monthly + Weekly Budget cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <Card title="Monthly Budget" subtitle={localBudget.monthlyBudget > 0 ? 'March 2026' : 'Set a budget to start tracking'}>
                    <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{formatCurrency(totalSpent)}</h2>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                    {localBudget.monthlyBudget > 0 ? `of ${formatCurrency(localBudget.monthlyBudget)} budget` : 'No budget set – click Edit Limits'}
                                </p>
                            </div>
                            {localBudget.monthlyBudget > 0 && (
                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: monthlyPercent >= 80 ? 'var(--red)' : 'var(--purple-400)' }}>{Math.round(monthlyPercent)}%</span>
                            )}
                        </div>
                        {localBudget.monthlyBudget > 0 && (
                            <>
                                <div className="progress-track" style={{ height: 10 }}>
                                    <div className={`progress-fill ${getProgressColor(monthlyPercent)}`} style={{ width: `${monthlyPercent}%` }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                    <div>
                                        <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Remaining</p>
                                        <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--green)', marginTop: 4 }}>{formatCurrency(Math.max(0, localBudget.monthlyBudget - totalSpent))}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Average</p>
                                        <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: 4 }}>{formatCurrency(Math.round(totalSpent / 30))}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    {monthlyPercent >= 80 && localBudget.monthlyBudget > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: monthlyPercent >= 100 ? 'var(--red-bg)' : 'var(--amber-bg)', color: monthlyPercent >= 100 ? 'var(--red)' : 'var(--amber)', fontSize: '0.75rem', fontWeight: 600 }}>
                            <AlertTriangle size={16} />
                            {monthlyPercent >= 100 ? 'Budget exceeded!' : 'Warning: 80% budget reached'}
                        </div>
                    )}
                </Card>

                <Card title="Weekly Budget" subtitle={localBudget.weeklyBudget > 0 ? 'This Week' : 'Set a weekly budget to track'}>
                    <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{formatCurrency(weeklySpent)}</h2>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                    {localBudget.weeklyBudget > 0 ? `of ${formatCurrency(localBudget.weeklyBudget)} budget` : 'No budget set'}
                                </p>
                            </div>
                            {localBudget.weeklyBudget > 0 && (
                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: weeklyPercent >= 80 ? 'var(--red)' : 'var(--purple-400)' }}>{Math.round(weeklyPercent)}%</span>
                            )}
                        </div>
                        {localBudget.weeklyBudget > 0 && (
                            <>
                                <div className="progress-track" style={{ height: 10 }}>
                                    <div className={`progress-fill ${getProgressColor(weeklyPercent)}`} style={{ width: `${weeklyPercent}%` }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                    <div>
                                        <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Remaining</p>
                                        <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--green)', marginTop: 4 }}>{formatCurrency(Math.max(0, localBudget.weeklyBudget - weeklySpent))}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Projected</p>
                                        <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: 4 }}>{formatCurrency(weeklySpent * 7)}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Card>
            </div>

            {/* Comparison cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TrendingDown size={20} style={{ color: 'var(--green)' }} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>Total Spent</p>
                            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{formatCurrency(totalSpent)}</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: localBudget.income > totalSpent ? 'var(--green-bg)' : 'var(--red-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TrendingUp size={20} style={{ color: localBudget.income > totalSpent ? 'var(--green)' : 'var(--red)' }} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>Net Savings</p>
                            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: localBudget.income > totalSpent ? 'var(--green)' : 'var(--red)', marginTop: 2 }}>
                                {formatCurrency(localBudget.income - totalSpent)}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Category Limits — fully dynamic */}
            <Card title="Category Limits"
                subtitle="Create custom categories and set spending limits"
                action={
                    <button className="btn-primary" style={{ fontSize: '0.75rem' }} onClick={() => setShowAddCategory(true)}>
                        <Plus size={14} /> Add Category
                    </button>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {categoryBudgets.length === 0 && !showAddCategory && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', textAlign: 'center', padding: '2rem 0' }}>
                            No category budgets set. Click "Add Category" to create one.
                        </p>
                    )}
                    {categoryBudgets.map((cat) => {
                        const spent = categorySpending[cat.category] || 0;
                        const pct = cat.limit > 0 ? Math.round((spent / cat.limit) * 100) : 0;
                        return (
                            <div key={cat.id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color }} />
                                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{cat.category}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {editingCatId === cat.id ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹</span>
                                                <input className="input-field" type="number" value={editCatLimit}
                                                    onChange={(e) => setEditCatLimit(e.target.value)}
                                                    style={{ width: 100, fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                    autoFocus
                                                />
                                                <button className="btn-ghost" style={{ padding: 2, color: 'var(--green)' }} onClick={() => handleUpdateCatLimit(cat)}><Check size={12} /></button>
                                                <button className="btn-ghost" style={{ padding: 2, color: 'var(--red)' }} onClick={() => setEditingCatId(null)}><X size={12} /></button>
                                            </div>
                                        ) : (
                                            <>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {formatCurrency(spent)} / {cat.limit > 0 ? formatCurrency(cat.limit) : 'No limit'} {cat.limit > 0 ? `(${pct}%)` : ''}
                                                </span>
                                                <button className="btn-ghost" title="Log expense" style={{ padding: 4, color: 'var(--green)' }} onClick={() => { setLoggingCatId(loggingCatId === cat.id ? null : cat.id); setLogForm({ title: '', amount: '' }); }}><IndianRupee size={12} /><Plus size={10} style={{ marginLeft: -4 }} /></button>
                                                <button className="btn-ghost" title="Edit limit" style={{ padding: 4 }} onClick={() => { setEditingCatId(cat.id); setEditCatLimit(cat.limit.toString()); }}><Edit2 size={12} /></button>
                                                <button className="btn-ghost" title="Delete" style={{ padding: 4, color: 'var(--red)' }} onClick={() => handleDeleteCat(cat.id)}><Trash2 size={12} /></button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {cat.limit > 0 && (
                                    <div className="progress-track">
                                        <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, background: cat.color }} />
                                    </div>
                                )}
                                {loggingCatId === cat.id && (
                                    <div style={{
                                        marginTop: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                                    }}>
                                        <p style={{ fontSize: '0.6875rem', color: 'var(--purple-400)', fontWeight: 600, marginBottom: '0.5rem' }}>Log expense to "{cat.category}"</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px auto', gap: '0.5rem', alignItems: 'center' }}>
                                            <input className="input-field" placeholder="What did you spend on?" value={logForm.title}
                                                onChange={(e) => setLogForm({ ...logForm, title: e.target.value })}
                                                style={{ fontSize: '0.75rem', padding: '0.375rem 0.625rem' }} autoFocus />
                                            <input className="input-field" type="number" placeholder="₹ Amount" value={logForm.amount}
                                                onChange={(e) => setLogForm({ ...logForm, amount: e.target.value })}
                                                style={{ fontSize: '0.75rem', padding: '0.375rem 0.625rem' }} />
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                <button className="btn-primary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.6875rem' }}
                                                    onClick={() => handleLogExpense(cat.category)} disabled={logSaving}>
                                                    {logSaving ? '...' : 'Add'}
                                                </button>
                                                <button className="btn-ghost" style={{ padding: '0.375rem' }} onClick={() => setLoggingCatId(null)}>
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Add category form */}
                    {showAddCategory && (
                        <div style={{
                            padding: '1rem', borderRadius: 'var(--radius-md)',
                            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 4 }}>Category Name</label>
                                    <input className="input-field" placeholder="e.g. Food & Dining" value={newCat.category}
                                        onChange={(e) => setNewCat({ ...newCat, category: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 4 }}>Budget Limit (₹)</label>
                                    <input className="input-field" type="number" placeholder="0" value={newCat.limit}
                                        onChange={(e) => setNewCat({ ...newCat, limit: e.target.value })} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                                    <input type="color" value={newCat.color} onChange={(e) => setNewCat({ ...newCat, color: e.target.value })}
                                        style={{ width: 32, height: 32, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddCategory(false)}>Cancel</button>
                                <button className="btn-primary" style={{ flex: 1 }} onClick={handleAddCategory} disabled={saving}>
                                    {saving ? 'Saving...' : 'Add Category'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Trend */}
            <Card title="Budget Trend" subtitle="Monthly spending pattern over time">
                <div style={{ height: 240 }}>
                    <TrendLineChart expenses={expenses} />
                </div>
            </Card>
        </div>
    );
};

export default BudgetSection;
