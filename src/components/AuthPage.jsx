import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

const AuthPage = () => {
    const { login, register, loading } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        let result;
        if (isLogin) {
            result = await login(form.email, form.password);
        } else {
            if (!form.name) { setError('Name is required'); return; }
            result = await register(form.name, form.email, form.password);
        }
        if (!result.success) setError(result.error);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background gradient orbs */}
            <div style={{
                position: 'absolute', top: '-20%', left: '-10%',
                width: 600, height: 600, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
                filter: 'blur(60px)',
            }} />
            <div style={{
                position: 'absolute', bottom: '-20%', right: '-10%',
                width: 500, height: 500, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
                filter: 'blur(60px)',
            }} />

            <div className="animate-scale-in" style={{
                width: '100%', maxWidth: 420,
                background: 'var(--bg-card)',
                backdropFilter: 'var(--glass-blur)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem',
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', justifyContent: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 14,
                        background: 'linear-gradient(135deg, var(--purple-600), var(--purple-400))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(168,85,247,0.3)',
                    }}>
                        <TrendingUp size={24} color="white" />
                    </div>
                    <span style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                        <span style={{ color: 'var(--purple-400)' }}>Grow</span>
                        <span style={{ color: 'var(--text-primary)' }}>Wise</span>
                    </span>
                </div>

                {/* Title */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 }}>
                        {isLogin ? 'Welcome back' : 'Create your account'}
                    </h1>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        {isLogin ? 'Sign in to manage your finances' : 'Start tracking your expenses today'}
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: 'var(--red-bg)', color: 'var(--red)',
                        padding: '0.75rem', borderRadius: 'var(--radius-md)',
                        fontSize: '0.8125rem', fontWeight: 500, marginBottom: '1rem',
                        textAlign: 'center',
                    }}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {!isLogin && (
                        <div style={{ position: 'relative' }}>
                            <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="Full Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                    )}

                    <div style={{ position: 'relative' }}>
                        <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            className="input-field"
                            style={{ paddingLeft: '2.5rem' }}
                            type="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            className="input-field"
                            style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                            }}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{
                            width: '100%', justifyContent: 'center',
                            padding: '0.875rem', fontSize: '0.875rem',
                            marginTop: '0.5rem',
                        }}
                    >
                        {loading ? (
                            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                            <>
                                {isLogin ? 'Sign In' : 'Create Account'}
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                {/* Toggle */}
                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        style={{
                            background: 'none', border: 'none', color: 'var(--purple-400)',
                            fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit',
                        }}
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
