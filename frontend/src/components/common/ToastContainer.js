import React from 'react';

const ToastContainer = ({ toasts, onRemove }) => (
  <div className="toast-container">
    {toasts.map((t) => (
      <div key={t.id} className={`toast ${t.type}`} onClick={() => onRemove(t.id)}>
        {t.message}
      </div>
    ))}
  </div>
);

export default ToastContainer;
