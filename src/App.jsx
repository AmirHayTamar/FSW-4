import React, { useState } from 'react';
import './App.css';
import ControlPanel from './ControlPanel';
import EditableTextArea from './EditableTextArea';

const App = () => {
  const [editors, setEditors] = useState([
    { id: 1, content: '', font: 'Arial', fontSize: 16, color: '#000000' }
  ]);
  const [activeId, setActiveId] = useState(1);
  const [nextId, setNextId] = useState(2);

  const updateEditor = (id, newData) => {
    setEditors(editors.map(e => e.id === id ? { ...e, ...newData } : e));
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
    setNextId(nextId + 1);
  };

  const removeEditor = () => {
    setEditors(editors.filter(e => e.id !== activeId));
    const remaining = editors.filter(e => e.id !== activeId);
    if (remaining.length > 0) setActiveId(remaining[0].id);
  };

  const activeEditor = editors.find(e => e.id === activeId);

  const [applyToAll, setApplyToAll] = useState(false);

  return (
    <div className="App">
      <h2>Multi-file text editor</h2>
      <div className="editor-grid">
        {editors.map(editor => (
         <EditableTextArea
         content={editor.content}
         onChange={(newValue) => updateEditor(editor.id, { content: newValue })}
         onClick={() => setActiveId(editor.id)}
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
        onDelete={removeEditor}
        onAdd={addEditor}
        applyToAll={applyToAll}
        setApplyToAll={setApplyToAll}
      />
    </div>
  );
};

export default App;
