import { showConfirm, hideConfirm } from '../Logic/ConfirmService';

export const getAllFiles = () => {
  return JSON.parse(localStorage.getItem('virtualFiles') || '{}');
};

export const loadFile = (name) => {
  const files = getAllFiles();
  return files[name] || null;
};

export const saveFile = (name, editorData,autoSave) => {
  const files = getAllFiles();

  files[name] = {
    html: editorData.content || '',  
    font: editorData.font || 'Arial',
    fontSize: editorData.fontSize || 16,
    color: editorData.color || '#000000'
  };

  localStorage.setItem('virtualFiles', JSON.stringify(files));

  if(!autoSave){
      showConfirm({
      message: '.הקובץ נשמר בהצלחה',
      onConfirm: hideConfirm,
      onCancel: null,
    });
  }
};
