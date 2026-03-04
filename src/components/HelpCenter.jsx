import React from 'react';
import Card from './Card';
import { HelpCircle, Mail, MessageCircle, FileText, ChevronRight, Search } from 'lucide-react';

const HelpCenter = () => {
    const faqs = [
        { q: "How do I add a new expense?", a: "Navigate to the 'All Expenses' tab and click the '+ Add New' button. Fill in the title, amount, and category, then save." },
        { q: "Can I connect my bank account?", a: "Bank account syncing is a premium feature currently in beta. You can manually enter expenses or import CSV files." },
        { q: "How does the Budget Planner work?", a: "Set your monthly income and budget limits in the Budget Planner section. You can also create custom categories with specific limits to track where your money goes." },
        { q: "Is my financial data secure?", a: "Yes, we use industry-standard encryption for all data. Your information is never sold to third parties." }
    ];

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 800 }}>
            <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Help Center</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: 4 }}>Find answers, tutorials, and support</p>
            </div>

            <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    placeholder="Search for help articles..."
                    style={{
                        width: '100%', padding: '1rem 1rem 1rem 3rem',
                        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-lg)', color: 'var(--text-primary)',
                        fontSize: '0.875rem', outline: 'none', transition: 'var(--transition)'
                    }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                    { title: 'Knowledge Base', icon: FileText, desc: 'Detailed guides & tutorials' },
                    { title: 'Chat Support', icon: MessageCircle, desc: 'Talk to our team (Pro)' },
                    { title: 'Email Us', icon: Mail, desc: 'Typically replies in 24h' },
                ].map((item, i) => (
                    <div key={i} style={{
                        padding: '1.25rem', borderRadius: 'var(--radius-lg)',
                        background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
                        cursor: 'pointer', transition: 'var(--transition)',
                        display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start'
                    }} className="hover-card">
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <item.icon size={18} color="var(--purple-400)" />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.title}</p>
                            <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Card title="Frequently Asked Questions">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    {faqs.map((faq, i) => (
                        <div key={i} style={{
                            padding: '1rem', borderRadius: 'var(--radius-md)',
                            background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{faq.q}</p>
                                <ChevronRight size={16} color="var(--text-muted)" />
                            </div>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: 1.5 }}>
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default HelpCenter;
