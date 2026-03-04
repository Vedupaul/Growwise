import React, { useState } from 'react';
import Card from './Card';
import { Plus, ExternalLink, Trash2, ShoppingBag, ArrowUpDown, Check } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const WishlistSection = ({ items, balance, onAdd, onUpdate, onDelete }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [sortBy, setSortBy] = useState('priority');
    const [form, setForm] = useState({ name: '', price: '', link: '', priority: 'Medium' });
    const [saving, setSaving] = useState(false);

    const totalCost = items.reduce((acc, i) => acc + i.price, 0);

    const handleAdd = async () => {
        if (!form.name || !form.price) return;
        setSaving(true);
        try {
            await onAdd({ ...form, price: parseFloat(form.price) });
            setForm({ name: '', price: '', link: '', priority: 'Medium' });
            setIsAdding(false);
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const togglePurchased = async (item) => {
        try { await onUpdate(item.id, { purchased: !item.purchased }); } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        try { await onDelete(id); } catch (err) { console.error(err); }
    };

    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    const sorted = [...items].sort((a, b) => {
        if (sortBy === 'price') return b.price - a.price;
        return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
    });

    const getPriorityClass = (p) => p === 'High' ? 'badge-high' : p === 'Medium' ? 'badge-medium' : 'badge-low';

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Wishlist</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: 4 }}>Track the products you're saving for</p>
                </div>
                <button className="btn-primary" onClick={() => setIsAdding(true)}><Plus size={16} /> Add Item</button>
            </div>

            <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="stat-card">
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Wishlist Cost</p>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: 6 }}>{formatCurrency(totalCost)}</h3>
                </div>
                <div className="stat-card">
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available Balance</p>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: 6, color: balance > 0 ? 'var(--green)' : 'var(--red)' }}>{formatCurrency(balance)}</h3>
                </div>
                <div className="stat-card">
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Items</p>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: 6 }}>{items.filter(i => i.purchased).length}/{items.length} purchased</h3>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className={sortBy === 'priority' ? 'btn-primary' : 'btn-secondary'} onClick={() => setSortBy('priority')} style={{ fontSize: '0.75rem' }}>
                    <ArrowUpDown size={14} /> Priority
                </button>
                <button className={sortBy === 'price' ? 'btn-primary' : 'btn-secondary'} onClick={() => setSortBy('price')} style={{ fontSize: '0.75rem' }}>
                    <ArrowUpDown size={14} /> Price
                </button>
            </div>

            <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {sorted.map((item) => {
                    const progress = Math.min((balance / item.price) * 100, 100);
                    return (
                        <Card key={item.id} className={item.purchased ? 'opacity-60' : ''}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ShoppingBag size={20} style={{ color: 'var(--purple-400)' }} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', textDecoration: item.purchased ? 'line-through' : 'none' }}>{item.name}</h4>
                                        <span className={`badge ${getPriorityClass(item.priority)}`} style={{ marginTop: 4 }}>{item.priority}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formatCurrency(item.price)}</p>
                                    {item.link && (
                                        <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.6875rem', color: 'var(--purple-400)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 4, textDecoration: 'none' }}>
                                            View <ExternalLink size={10} />
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div style={{ marginTop: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Savings Progress</span>
                                    <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: progress >= 100 ? 'var(--green)' : 'var(--purple-400)' }}>{Math.round(progress)}%</span>
                                </div>
                                <div className="progress-track">
                                    <div className={`progress-fill ${progress >= 100 ? 'progress-green' : 'progress-purple'}`} style={{ width: `${progress}%` }} />
                                </div>
                                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 6 }}>
                                    {progress >= 100 ? '✅ Ready to purchase!' : `${formatCurrency(Math.max(0, item.price - balance))} more needed`}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                <button className={item.purchased ? 'btn-secondary' : 'btn-primary'} style={{ flex: 1, fontSize: '0.75rem' }} onClick={() => togglePurchased(item)}>
                                    <Check size={14} /> {item.purchased ? 'Undo' : 'Purchased'}
                                </button>
                                <button className="btn-ghost" style={{ color: 'var(--red)', padding: '0.5rem 0.75rem' }} onClick={() => handleDelete(item.id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {isAdding && (
                <div className="modal-overlay" onClick={() => setIsAdding(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Add Wishlist Item</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Product Name</label>
                                <input className="input-field" placeholder="e.g. MacBook Pro, Sony XM5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Price (₹)</label>
                                    <input className="input-field" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Priority</label>
                                    <select className="input-field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Product Link (Optional)</label>
                                <input className="input-field" placeholder="https://..." value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsAdding(false)}>Cancel</button>
                                <button className="btn-primary" style={{ flex: 1 }} onClick={handleAdd} disabled={saving}>{saving ? 'Saving...' : 'Save Item'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WishlistSection;
