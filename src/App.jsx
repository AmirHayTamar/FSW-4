import React, { useState } from 'react';
import './App.css';
import ControlPanel from './ControlPanel';
import EditableTextArea from './EditableTextArea';
import { saveFile, getAllFiles, loadFile } from './StorageUtils';

const App = () => {
  const [editors, setEditors] = useState([
    { id: 1, content: '', font: 'Arial', fontSize: 16, color: '#000000' }
  ]);
  const [activeId, setActiveId] = useState(1);
  const [nextId, setNextId] = useState(2);

  const [applyToAll, setApplyToAll] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileMap, setFileMap] = useState({}); // { editorId: fileName }
  const [fileList, setFileList] = useState(() => Object.keys(getAllFiles()));
  const [autoSave, setAutoSave] = useState(false);

  const activeEditor = editors.find(e => e.id === activeId);

  const updateEditor = (id, newData) => {
    setEditors((prev) =>
      prev.map((editor) => {
        if (editor.id !== id) return editor;
        const updated = { ...editor, ...newData };

        if (autoSave && fileName.trim()) {
          saveFile(fileName, updated); 
        }

        return updated;
      })
    );
  };

  const addEditor = () => {
    const newEditor = {
      id: nextId,
      content: '',
      font: 'Arial',
      fontSize: 16,
      color: '#000000'
    };
    setEditors([...editors, newEditor]);
    setActiveId(nextId);
    setFileName('');
    setNextId(nextId + 1);
    setFileList(Object.keys(getAllFiles()));
  };

  const removeEditor = () => {
    const editorToRemove = editors.find(e => e.id === activeId);
    const savedName = fileMap[activeId];
  
    if (savedName) {
      const savedFile = loadFile(savedName);
      const hasChanged = (
        editorToRemove.content !== savedFile.content ||
        editorToRemove.font !== savedFile.font ||
        editorToRemove.fontSize !== savedFile.fontSize ||
        editorToRemove.color !== savedFile.color
      );
  
      if (hasChanged) {
        const confirmSave = window.confirm('יש שינויים שלא נשמרו. האם ברצונך לשמור לפני המחיקה?');
        if (confirmSave) {
          saveFile(savedName, editorToRemove);
          return; // לא נמחק אחרי שמירה
        }
      }
    } else {
      const shouldSave = window.confirm('האם ברצונך לשמור את הקובץ לפני המחיקה?');
      if (shouldSave) {
        const name = prompt('הזן שם לקובץ:');
        if (name && name.trim()) {
          saveFile(name.trim(), editorToRemove);
          setFileMap(prev => ({ ...prev, [activeId]: name.trim() }));
          setFileList(Object.keys(getAllFiles()));
          setFileName(name.trim());
          return;
        }
      }
    }
  
    // מחיקה רגילה
    const updated = editors.filter(e => e.id !== activeId);
    setEditors(updated);
  
    if (updated.length > 0) {
      const next = updated[0];
      setActiveId(next.id);
      setFileName(fileMap[next.id] || '');
    } else {
      setFileName('');
    }
  };
  

  const saveWithName = (name, editorData) => {
    saveFile(name, editorData);
    if (!fileList.includes(name)) {
      setFileList(Object.keys(getAllFiles()));
    }
    setFileMap((prev) => ({ ...prev, [activeId]: name }));
    setFileName(name);
  };

  const loadFromName = (name) => {
    const loaded = loadFile(name);
    if (loaded) {
      updateEditor(activeId, {
        content: loaded.content,
        font: loaded.font,
        fontSize: loaded.fontSize,
        color: loaded.color
      });
      setFileMap((prev) => ({ ...prev, [activeId]: name }));
      setFileName(name);
    }
  };

  const handleSetActiveId = (id) => {
    setActiveId(id);
    const existing = fileMap[id] || '';
    setFileName(existing);
  };

  return (
    <div className="App">
      <h2>Multi-file text editor</h2>

      <div className="editor-grid">
        {editors.map(editor => (
          <EditableTextArea
            key={editor.id}
            content={editor.content}
            onChange={(newValue) => updateEditor(editor.id, { content: newValue })}
            onClick={() => handleSetActiveId(editor.id)}
            isActive={editor.id === activeId}
            style={{
              fontFamily: editor.font,
              fontSize: `${editor.fontSize}px`,
              color: editor.color
            }}
          />
        ))}
      </div>

      <ControlPanel
        activeEditor={activeEditor}
        onUpdate={(data) => updateEditor(activeId, data)}
        onUpdateContent={(value) => updateEditor(activeId, { content: value })}
        onSave={saveWithName}
        onDelete={removeEditor}
        onLoad={loadFromName}
        onAdd={addEditor}
        fileName={fileName}
        setFileName={setFileName}
        fileList={fileList}
        applyToAll={applyToAll}
        setApplyToAll={setApplyToAll}
        autoSave={autoSave}
        setAutoSave={setAutoSave}
      />
    </div>
  );
};

export default App;
