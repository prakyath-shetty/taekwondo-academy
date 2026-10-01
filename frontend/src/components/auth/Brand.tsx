import React from 'react';

const Brand: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#008000',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,128,0,0.3)',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        </div>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#008000', letterSpacing: '-0.02em' }}>
          {title}
        </span>
      </div>
      <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: 0 }}>{subtitle}</p>
    </div>
  );
};

export default Brand;
