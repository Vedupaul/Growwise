import React, { useState } from 'react';
import Card from './Card';
import { User, Bell, Shield, Key, Moon, Globe, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 800 }}>
            <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Settings</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: 4 }}>Manage your account preferences and settings</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
                {/* Settings Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {[
                        { id: 'profile', label: 'Profile Settings', icon: User },
                        { id: 'preferences', label: 'Preferences', icon: Globe },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'security', label: 'Security', icon: Shield },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                background: activeTab === tab.id ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                                color: activeTab === tab.id ? 'var(--purple-400)' : 'var(--text-secondary)',
                                border: 'none', cursor: 'pointer', textAlign: 'left',
                                fontWeight: activeTab === tab.id ? 600 : 500,
                                fontSize: '0.8125rem', transition: 'var(--transition)',
                            }}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Settings Content */}
                <div>
                    {activeTab === 'profile' && (
                        <Card title="Profile Information">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple-500), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>Change Avatar</button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Full Name</label>
                                        <input className="input-field" defaultValue={user?.name || ''} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Email Address</label>
                                        <input className="input-field" defaultValue={user?.email || ''} readOnly style={{ opacity: 0.7 }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Phone Number</label>
                                        <input className="input-field" placeholder="+91 00000 00000" />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                                <button className="btn-primary" onClick={handleSave}>
                                    {saved ? <><Check size={16} /> Saved</> : 'Save Changes'}
                                </button>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'preferences' && (
                        <Card title="App Preferences">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Currency</label>
                                    <select className="input-field" defaultValue="INR">
                                        <option value="INR">₹ Indian Rupee (INR)</option>
                                        <option value="USD">$ US Dollar (USD)</option>
                                        <option value="EUR">€ Euro (EUR)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: 6 }}>Language</label>
                                    <select className="input-field" defaultValue="en">
                                        <option value="en">English</option>
                                        <option value="hi">Hindi</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                    <div>
                                        <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Dark Theme</p>
                                        <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>Use the sleek dark interface</p>
                                    </div>
                                    <div style={{ width: 44, height: 24, borderRadius: 12, background: 'var(--purple-500)', position: 'relative', cursor: 'pointer' }}>
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, right: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Moon size={12} color="var(--purple-600)" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {(activeTab === 'notifications' || activeTab === 'security') && (
                        <Card>
                            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                                <p style={{ fontSize: '0.875rem' }}>This section is currently under development.</p>
                                <p style={{ fontSize: '0.75rem', marginTop: 4 }}>Check back later in future updates!</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
