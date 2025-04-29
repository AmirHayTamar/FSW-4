import React, { useState } from 'react';
import '../Style/App.css';
import ControlPanel from './ControlPanel';
import EditableTextArea from './EditableTextArea';
import { getAllFiles ,getcurrentUser ,setCurrentUserUtils} from '../DB/StorageUtils';
import ConfirmDialog from './ConfirmDialog';
import { setConfirmHandler, hideConfirm } from '../Logic/ConfirmService';
import { updateEditorUtils, createEditor, removeEditorById} from '../Logic/EditorUtils';
import { saveEditorToStorage, loadEditorFromStorage, handleEditorRemoval} from '../Logic/FileUtils';
import LoginPage from './LoginPage'; 


const App = ({currentUser}) => {
  // const [currentUser, setCurrentUser] = useState(getcurrentUser());
  console.log('App loaded with currentUser:', currentUser);

  const [editors, setEditors] = useState([
    { id: 1, content: '', font: 'Arial', fontSize: 16, color: '#000000',userName: currentUser }
  ]);

  const [activeId, setActiveId] = useState(1);
  const [nextId, setNextId] = useState(2);
  const [applyToAll, setApplyToAll] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileMap, setFileMap] = useState({});
  const [fileList, setFileList] = useState(() => Object.keys(getAllFiles(currentUser)));
  const [autoSave, setAutoSave] = useState(false);
  const [connected, setConnected] = useState(true);


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
  const newEditor = createEditor(nextId,currentUser);
  setEditors([...editors, newEditor]);
  setActiveId(nextId);
  setFileName('');
  setNextId(nextId + 1);
  setFileList(Object.keys(getAllFiles(currentUser)));
};

  const removeEditor = () => {
    const editorToRemove = editors.find(e => e.id === activeId);
    handleEditorRemoval({
      editor: editorToRemove,
      editorId: activeId,
      fileMap,
      onDeleteConfirmed: reallyRemoveEditor,
      setConfirmData,
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
    if(name === '')
    {
      setConfirmData({
        isOpen: true,
        message: 'על מנת לשמור נדרש להזין שם לקובץ',
        onConfirm: () => {
          hideConfirm();
        },
      });   

    }else
    {
      saveEditorToStorage(name, activeId, editorData);
      if (!fileList.includes(name)) {
        setFileList(Object.keys(getAllFiles(currentUser)));
      }
      setFileMap(prev => ({ ...prev, [activeId]: name }));
      setFileName(name);
    }
  };

  const loadFromName = (name) => {
    loadEditorFromStorage(name, activeId, updateEditor,currentUser);
    setFileMap(prev => ({ ...prev, [activeId]: name }));
    setFileName(name);
  };  

  const handleLogout = () => {
    setCurrentUserUtils('')
    setConnected(false);
    return <LoginPage/>;
    };

    if(!connected){
      return <LoginPage/>;

    }

  return (
    <div className="App">
      <div className="app-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="user-greeting">Hello, {currentUser}</span>
          <button onClick={handleLogout}>התנתק</button>
        </div>

        <h2>Multi-file text editor</h2>

        <div style={{ width: '200px' }}></div> {/* לאיזון */}
      </div>


        <div className="editor-grid">
          {editors.map(editor => (
            <EditableTextArea
              key={editor.id}
              editorId={editor.id}
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
        setConfirmData={setConfirmData}
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
