import React, { useState, useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return { background: 'rgba(16, 185, 129, 0.9)' };
      case 'error':
        return { background: 'rgba(239, 68, 68, 0.9)' };
      case 'warning':
        return { background: 'rgba(245, 158, 11, 0.9)' };
      default:
        return { background: 'rgba(59, 130, 246, 0.9)' };
    }
  };

  return (
    <div style={{
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '300px',
      animation: 'slideIn 0.3s ease',
      ...getToastStyles()
    }}>
      <div style={{flex: 1, color: 'white'}}>
        {message}
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          fontSize: '20px',
          padding: '0',
          opacity: 0.8
        }}
      >
        ×
      </button>
    </div>
  );
}