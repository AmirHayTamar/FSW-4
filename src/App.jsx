import React, { useState } from 'react';
import './App.css';
import ControlPanel from './ControlPanel';
import EditableTextArea from './EditableTextArea';
import { saveFile, getAllFiles, loadFile } from './StorageUtils';
import ConfirmDialog from './ConfirmDialog';
import { setConfirmHandler, hideConfirm } from './ConfirmService';
import { updateEditorUtils, createEditor, removeEditorById} from './EditorUtils';
import { saveEditorToStorage, loadEditorFromStorage, handleEditorRemoval} from './FileUtils';


const App = () => {
  const [editors, setEditors] = useState([
    { id: 1, content: '', font: 'Arial', fontSize: 16, color: '#000000' }
  ]);

  const [activeId, setActiveId] = useState(1);
  const [nextId, setNextId] = useState(2);
  const [applyToAll, setApplyToAll] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileMap, setFileMap] = useState({});
  const [fileList, setFileList] = useState(() => Object.keys(getAllFiles()));
  const [autoSave, setAutoSave] = useState(false);


  const [confirmData, setConfirmData] = useState({
    isOpen: false,
    message: '',
    onConfirm: null,
    onCancel: null
  });

  if (!confirmData._handlerInitialized) {
    setConfirmHandler(setConfirmData);
    setConfirmData((prev) => ({ ...prev, _handlerInitialized: true }));
  }

  const activeEditor = editors.find(e => e.id === activeId);

  const updateEditor = (id, newData) => {
    setEditors(prev => updateEditorUtils(prev, id, newData, autoSave, fileName));
  };
  
const addEditor = () => {
  const newEditor = createEditor(nextId);
  setEditors([...editors, newEditor]);
  setActiveId(nextId);
  setFileName('');
  setNextId(nextId + 1);
  setFileList(Object.keys(getAllFiles()));
};
 
  const removeEditor = () => {
    const editorToRemove = editors.find(e => e.id === activeId);
    handleEditorRemoval({
      editor: editorToRemove,
      editorId: activeId,
      fileMap,
      setFileMap,
      setFileList,
      setFileName,
      onDeleteConfirmed: reallyRemoveEditor,
      setConfirmData
    });
  };
  
  const reallyRemoveEditor = () => {
    const updated = removeEditorById(editors, activeId);
    setEditors(updated);
    if (updated.length > 0) {
      const next = updated[0];
      setActiveId(next.id);
      setFileName(fileMap[next.id] || '');
    } else {
      setFileName('');
    }
  };

  const handleSetActiveId = (id) => {
    setActiveId(id);
    const existing = fileMap[id] || '';
    setFileName(existing);
  };

  const saveWithName = (name, editorData) => {
    saveEditorToStorage(name, activeId, editorData);
    if (!fileList.includes(name)) {
      setFileList(Object.keys(getAllFiles()));
    }
    setFileMap(prev => ({ ...prev, [activeId]: name }));
    setFileName(name);
  };

  const loadFromName = (name) => {
    loadEditorFromStorage(name, activeId, updateEditor);
    setFileMap(prev => ({ ...prev, [activeId]: name }));
    setFileName(name);
  };  

  return (
    <div className="App">
      <h2>Multi-file text editor</h2>

      <div className="editor-grid">
        {editors.map(editor => (
          <EditableTextArea
            key={editor.id}
            editorId={editor.id}
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
        onSave={saveWithName }
        onDelete={removeEditor}
        onLoad={loadFromName }
        onAdd={addEditor}
        fileName={fileName}
        setFileName={setFileName}
        fileList={fileList}
        applyToAll={applyToAll}
        setApplyToAll={setApplyToAll}
        autoSave={autoSave}
        setAutoSave={setAutoSave}
      />

      <ConfirmDialog
        isOpen={confirmData.isOpen}
        message={confirmData.message}
        onConfirm={confirmData.onConfirm}
        onCancel={confirmData.onCancel}
      />
    </div>
  );
};

export default App;
