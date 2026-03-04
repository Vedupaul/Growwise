import React, { useState } from 'react';
import Card from './Card';
import { DonutChart, SpendingBarChart, TrendLineChart } from './Charts';
import {
    Wallet, TrendingUp, TrendingDown, Target, ArrowUpRight,
    ArrowDownRight, MoreHorizontal, Filter, ChevronDown, CreditCard, Edit2, Check, X
} from 'lucide-react';
import { formatCurrency, formatCurrencyFull, formatDate } from '../utils/helpers';

const StatCard = ({ title, amount, change, changeType, icon: Icon, iconBg, onEdit, editable }) => {
    const [editing, setEditing] = useState(false);
    const [val, setVal] = useState(amount);

    const handleSave = () => {
        onEdit(parseFloat(val) || 0);
        setEditing(false);
    };

    return (
        <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: iconBg || 'rgba(168,85,247,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon size={20} style={{ color: 'var(--purple-400)' }} />
                </div>
                {editable && !editing && (
                    <button className="btn-ghost" style={{ padding: 4 }} onClick={() => { setVal(amount); setEditing(true); }}>
                        <Edit2 size={14} />
                    </button>
                )}
                {!editable && (
                    <button className="btn-ghost" style={{ padding: 4 }}>
                        <MoreHorizontal size={16} />
                    </button>
                )}
            </div>
            <div style={{ marginTop: '1.25rem' }}>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {title}
                </p>
                {editing ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>₹</span>
                        <input
                            className="input-field"
                            type="number"
                            value={val}
                            onChange={(e) => setVal(e.target.value)}
                            style={{ fontSize: '1rem', padding: '0.25rem 0.5rem', width: 140 }}
                            autoFocus
                        />
                        <button className="btn-ghost" style={{ padding: 4, color: 'var(--green)' }} onClick={handleSave}><Check size={14} /></button>
                        <button className="btn-ghost" style={{ padding: 4, color: 'var(--red)' }} onClick={() => setEditing(false)}><X size={14} /></button>
                    </div>
                ) : (
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 4, letterSpacing: '-0.02em' }}>
                        {formatCurrencyFull(amount)}
                    </h2>
                )}
            </div>
            {change !== undefined && !editing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: '0.75rem' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 2,
                        padding: '2px 6px', borderRadius: 6,
                        background: changeType === 'up' ? 'var(--green-bg)' : 'var(--red-bg)',
                        color: changeType === 'up' ? 'var(--green)' : 'var(--red)',
                        fontSize: '0.6875rem', fontWeight: 600,
                    }}>
                        {changeType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {change}%
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>vs last month</span>
                </div>
            )}
        </div>
    );
};

const Dashboard = ({ expenses, income, wishlist, onUpdateBudget, budget }) => {
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const balance = income - totalExpenses;
    const wishlistTotal = wishlist.reduce((acc, w) => acc + w.price, 0);
    const totalSavings = Math.max(0, balance - wishlistTotal);

    const recentExpenses = [...expenses].slice(0, 5);

    const categoryTotals = expenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
    }, {});
    const categoryLabels = Object.keys(categoryTotals);
    const categoryData = Object.values(categoryTotals);

    const handleIncomeEdit = async (newIncome) => {
        try {
            await onUpdateBudget({ income: newIncome });
        } catch (err) { console.error(err); }
    };

    // Filter subscription expenses for the bills section
    const subscriptions = expenses.filter(e => e.category === 'Subscription' || e.category === 'Utilities');

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Stat Cards */}
            <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                <StatCard
                    title="Account Balance"
                    amount={balance}
                    icon={Wallet}
                    editable={true}
                    onEdit={handleIncomeEdit}
                />
                <StatCard title="Monthly Expenses" amount={totalExpenses} icon={TrendingDown} iconBg="var(--red-bg)" />
                <StatCard title="Total Savings" amount={totalSavings} icon={TrendingUp} iconBg="var(--green-bg)" />
                <StatCard title="Wishlist Goal" amount={wishlistTotal} icon={Target} iconBg="var(--amber-bg)" />
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
                <Card title="Monthly Expenses"
                    subtitle={totalExpenses > 0 ? `₹${totalExpenses.toLocaleString('en-IN')} total spent` : 'No expenses yet'}
                    action={<button className="btn-ghost"><Filter size={14} /> Recent <ChevronDown size={12} /></button>}
                >
                    <div style={{ height: 280 }}>
                        <SpendingBarChart expenses={expenses} />
                    </div>
                </Card>

                <Card title="Top Category"
                    action={<button className="btn-ghost">Recent <ChevronDown size={12} /></button>}
                >
                    <div style={{ height: 280 }}>
                        {categoryData.length > 0 ? (
                            <DonutChart data={categoryData} labels={categoryLabels} />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                                Add expenses to see category breakdown
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Recent Expenses + Bills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '1.5rem' }}>
                <Card title="Recent Expenses" noPad
                    action={
                        <div style={{ display: 'flex', gap: 8, paddingRight: 24 }}>
                            <button className="btn-ghost"><Filter size={14} /> Filter</button>
                            <button className="btn-ghost">Recent <ChevronDown size={12} /></button>
                        </div>
                    }
                >
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>S.N</th><th>Amount</th><th>Category</th><th>Date</th><th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentExpenses.length > 0 ? recentExpenses.map((exp, i) => (
                                <tr key={exp.id}>
                                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}.</td>
                                    <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatCurrency(exp.amount)}</td>
                                    <td>{exp.category}</td>
                                    <td>{formatDate(exp.dueDate)}</td>
                                    <td><span className={`badge badge-${exp.status.toLowerCase()}`}>{exp.status}</span></td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No expenses added yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </Card>

                <Card title="Bill & Subscription">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {subscriptions.length > 0 ? subscriptions.slice(0, 4).map((bill) => (
                            <div key={bill.id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 8,
                                        background: 'rgba(168,85,247,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <CreditCard size={16} style={{ color: 'var(--purple-400)' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{bill.title}</p>
                                        <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{formatDate(bill.dueDate)}</p>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {formatCurrency(bill.amount)}
                                </span>
                            </div>
                        )) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', textAlign: 'center', padding: '2rem 0' }}>
                                No subscriptions yet
                            </p>
                        )}
                    </div>
                </Card>
            </div>

            {/* Trend Line */}
            <Card title="Savings Trend" subtitle="Your savings growth over time">
                <div style={{ height: 240 }}>
                    <TrendLineChart expenses={expenses} />
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
