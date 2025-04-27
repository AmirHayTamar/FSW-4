import React from 'react';
import '../Style/App.css';

const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel, confirmText = "אישור", cancelText = "ביטול" }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p>{message}</p>
        <div className="confirm-actions">
          {onConfirm && (<button onClick={onConfirm}>{confirmText}</button>)}
          {onCancel && (<button onClick={onCancel}>{cancelText}</button>)}
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
