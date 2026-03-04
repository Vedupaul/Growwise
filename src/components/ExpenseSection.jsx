import React, { useState } from 'react';
import Card from './Card';
import { Plus, Trash2, Edit2, Search, Tag, Download } from 'lucide-react';
import { formatCurrency, formatDate, downloadCSV } from '../utils/helpers';

const ExpenseSection = ({ expenses, income, onAdd, onUpdate, onDelete }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [form, setForm] = useState({ title: '', amount: '', category: '', dueDate: '', status: 'Pending' });
    const [saving, setSaving] = useState(false);

    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const remaining = income - totalExpenses;

    const filteredExpenses = expenses.filter((e) => {
        const matchSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = !filterCategory || e.category === filterCategory;
        return matchSearch && matchCategory;
    });

    const categories = [...new Set(expenses.map(e => e.category))];

    const handleSave = async () => {
        if (!form.title || !form.amount) return;
        setSaving(true);
        try {
            if (editingId) {
                await onUpdate(editingId, { ...form, amount: parseFloat(form.amount) });
                setEditingId(null);
            } else {
                await onAdd({ ...form, amount: parseFloat(form.amount) });
            }
            setForm({ title: '', amount: '', category: '', dueDate: '', status: 'Pending' });
            setIsAdding(false);
        } catch (err) {
            console.error('Save error:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (exp) => {
        setForm({ title: exp.title, amount: exp.amount.toString(), category: exp.category, dueDate: exp.dueDate || '', status: exp.status });
        setEditingId(exp.id);
        setIsAdding(true);
    };

    const handleDelete = async (id) => {
        try { await onDelete(id); } catch (err) { console.error(err); }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>All Expenses</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: 4 }}>
                        Manage your mandatory and optional expenses
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button className="btn-secondary" onClick={() => downloadCSV(expenses, 'growwise_expenses.csv')}>
                        <Download size={16} /> Export
                    </button>
                    <button className="btn-primary" onClick={() => { setEditingId(null); setForm({ title: '', amount: '', category: '', dueDate: '', status: 'Pending' }); setIsAdding(true); }}>
                        <Plus size={16} /> Add Expense
                    </button>
                </div>
            </div>

            <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="stat-card">
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Expenses</p>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: 6 }}>{formatCurrency(totalExpenses)}</h3>
                </div>
                <div className="stat-card">
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Remaining Balance</p>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: 6, color: remaining >= 0 ? 'var(--green)' : 'var(--red)' }}>{formatCurrency(remaining)}</h3>
                </div>
                <div className="stat-card">
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Bills</p>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: 6 }}>{expenses.length}</h3>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="input-field" style={{ paddingLeft: '2.25rem' }} placeholder="Search expenses..."
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="input-field" style={{ width: 180 }} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <Card noPad>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>S.N</th><th>Title</th><th>Amount</th><th>Category</th><th>Due Date</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map((exp, i) => (
                            <tr key={exp.id}>
                                <td style={{ color: 'var(--text-muted)' }}>{i + 1}.</td>
                                <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{exp.title}</td>
                                <td style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{formatCurrency(exp.amount)}</td>
                                <td>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, background: 'rgba(168,85,247,0.08)', color: 'var(--purple-400)', fontSize: '0.75rem', fontWeight: 500 }}>
                                        <Tag size={12} /> {exp.category}
                                    </span>
                                </td>
                                <td>{formatDate(exp.dueDate)}</td>
                                <td><span className={`badge badge-${exp.status.toLowerCase()}`}><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />{exp.status}</span></td>
                                <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                                        <button className="btn-ghost" onClick={() => handleEdit(exp)} style={{ padding: 6 }}><Edit2 size={14} /></button>
                                        <button className="btn-ghost" onClick={() => handleDelete(exp.id)} style={{ padding: 6, color: 'var(--red)' }}><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredExpenses.length === 0 && (
                            <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No expenses found</td></tr>
                        )}
                    </tbody>
                </table>
            </Card>

            {isAdding && (
                <div className="modal-overlay" onClick={() => setIsAdding(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                            {editingId ? 'Edit Expense' : 'Add New Expense'}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Title</label>
                                <input className="input-field" placeholder="e.g. Rent, Netflix" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Amount (₹)</label>
                                    <input className="input-field" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Category</label>
                                    <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                        <option value="">Select</option>
                                        <option value="Housing">Housing</option>
                                        <option value="Utilities">Utilities</option>
                                        <option value="Subscription">Subscription</option>
                                        <option value="Debt">Debt</option>
                                        <option value="Food">Food</option>
                                        <option value="Transport">Transport</option>
                                        <option value="Shopping">Shopping</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Due Date</label>
                                    <input className="input-field" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Status</label>
                                    <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                        <option value="Pending">Pending</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Overdue">Overdue</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setIsAdding(false); setEditingId(null); }}>Cancel</button>
                                <button className="btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
                                    {saving ? 'Saving...' : editingId ? 'Update' : 'Add Expense'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseSection;
