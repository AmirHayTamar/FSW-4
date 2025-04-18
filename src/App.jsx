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
    setEditors(editors.filter(e => e.id !== activeId));
    const remaining = editors.filter(e => e.id !== activeId);
    if (remaining.length > 0) {
      setActiveId(remaining[0].id);
      const existingName = fileMap[remaining[0].id] || '';
      setFileName(existingName);
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
