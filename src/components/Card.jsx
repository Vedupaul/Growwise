import React from 'react';

const Card = ({ children, title, subtitle, action, className = '', noPad = false }) => (
    <div className={`glass-card ${noPad ? '' : 'p-6'} ${className}`}>
        {(title || subtitle || action) && (
            <div className={`flex items-center justify-between ${noPad ? 'px-6 pt-6' : ''} mb-5`}>
                <div>
                    {title && <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>}
                    {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</p>}
                </div>
                {action && action}
            </div>
        )}
        {children}
    </div>
);

export default Card;
