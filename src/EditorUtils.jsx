import { saveFile } from './StorageUtils';

export const updateEditorUtils = (editors, id, newData, autoSave, fileName) => {
  return editors.map(editor => {
    if (editor.id !== id) return editor;
    const updated = { ...editor, ...newData };
    if (autoSave && fileName.trim()) {
      saveFile(fileName, updated);
    }
    return updated;
  });
};

export const createEditor = (nextId) => ({
  id: nextId,
  content: '',
  font: 'Arial',
  fontSize: 16,
  color: '#000000'
});

export const removeEditorById = (editors, idToRemove) => {
  return editors.filter(e => e.id !== idToRemove);
};
