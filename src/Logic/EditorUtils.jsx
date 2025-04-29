import { saveFile } from '../DB/StorageUtils';

export const updateEditorUtils = (editors, id, newData, autoSave, fileName) => {
  return editors.map(editor => {
    if (editor.id !== id) return editor;
    const updated = { ...editor, ...newData };
    if (autoSave && fileName.trim()) {
      saveFile(fileName, updated,autoSave);
    }
    return updated;
  });
};

export const createEditor = (nextId,currentUser) => ({
  id: nextId,
  content: '',
  font: 'Arial',
  fontSize: 16,
  color: '#000000',
  userName: currentUser
});

export const removeEditorById = (editors, idToRemove) => {
  return editors.filter(e => e.id !== idToRemove);
};
