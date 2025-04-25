import { showConfirm, hideConfirm } from './ConfirmService';

// טוען את כל הקבצים מה־localStorage
export const getAllFiles = () => {
  return JSON.parse(localStorage.getItem('virtualFiles') || '{}');
};

// טוען קובץ לפי שם
export const loadFile = (name) => {
  const files = getAllFiles();
  return files[name] || null;
};

// שומר קובץ כולל תוכן HTML מלא + סגנונות
export const saveFile = (name, editorData) => {
  const files = getAllFiles();

  // נניח ש-editorData.content הוא innerHTML ולא plainText
  files[name] = {
    html: editorData.content || '',  // ⬅️ שים לב – שמירה של HTML!
    font: editorData.font || 'Arial',
    fontSize: editorData.fontSize || 16,
    color: editorData.color || '#000000'
  };

  localStorage.setItem('virtualFiles', JSON.stringify(files));

  showConfirm({
    message: '.הקובץ נשמר בהצלחה',
    onConfirm: hideConfirm,
    onCancel: null,
    confirmText: 'הבנתי'
  });
};
