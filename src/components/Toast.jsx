import React, { useEffect } from 'react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const style = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    background: type === 'success' ? 'var(--green)' : 'var(--red)',
    color: type === 'success' ? '#0a1a12' : '#fff',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.82rem',
    fontWeight: 700,
    padding: '12px 20px',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow)',
    animation: 'fadeUp 0.3s ease',
    maxWidth: '300px',
  };

  return (
    <div id="cp-toast" style={style}>
      {message}
    </div>
  );
}
