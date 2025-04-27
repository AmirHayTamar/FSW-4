let confirmHandler = null;

export const setConfirmHandler = (handler) => {
  confirmHandler = handler;
};

export const showConfirm = ({ message, onConfirm, onCancel, confirmText = 'אישור', cancelText = 'ביטול' }) => {
  if (confirmHandler) {
    confirmHandler({
      isOpen: true,
      message,
      onConfirm,
      onCancel,
      confirmText,
      cancelText
    });
  }
};

export const hideConfirm = () => {
  if (confirmHandler) {
    confirmHandler({
      isOpen: false,
      message: '',
      onConfirm: null,
      onCancel: null
    });
  }
};
