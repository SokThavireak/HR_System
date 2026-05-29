import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
    <div style={{ textAlign: 'center', color: '#718096' }}>
      <div className="spinner" style={{
        width: 36, height: 36, border: '3px solid #E2E8F0',
        borderTopColor: '#4ECDC4', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite', margin: '0 auto 12px'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span>{text}</span>
    </div>
  </div>
);

export default LoadingSpinner;
