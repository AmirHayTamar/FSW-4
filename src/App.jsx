// import React, { useState } from 'react';
// import './App.css';
// import ControlPanel from './ControlPanel';
// import EditableTextArea from './EditableTextArea';
// import { saveFile, getAllFiles, loadFile } from './StorageUtils';
// import ConfirmDialog from './ConfirmDialog';


// const App = () => {
//   const [editors, setEditors] = useState([
//     { id: 1, content: '', font: 'Arial', fontSize: 16, color: '#000000' }
//   ]);
//   const [activeId, setActiveId] = useState(1);
//   const [nextId, setNextId] = useState(2);

//   const [applyToAll, setApplyToAll] = useState(false);
//   const [fileName, setFileName] = useState('');
//   const [fileMap, setFileMap] = useState({}); // { editorId: fileName }
//   const [fileList, setFileList] = useState(() => Object.keys(getAllFiles()));
//   const [autoSave, setAutoSave] = useState(false);

//   const activeEditor = editors.find(e => e.id === activeId);

//   const updateEditor = (id, newData) => {
//     setEditors((prev) =>
//       prev.map((editor) => {
//         if (editor.id !== id) return editor;
//         const updated = { ...editor, ...newData };

//         if (autoSave && fileName.trim()) {
//           saveFile(fileName, updated); 
//         }

//         return updated;
//       })
//     );
//   };

//   const addEditor = () => {
//     const newEditor = {
//       id: nextId,
//       content: '',
//       font: 'Arial',
//       fontSize: 16,
//       color: '#000000'
//     };
//     setEditors([...editors, newEditor]);
//     setActiveId(nextId);
//     setFileName('');
//     setNextId(nextId + 1);
//     setFileList(Object.keys(getAllFiles()));
//   };

//   const [confirmData, setConfirmData] = useState({
//     isOpen: false,
//     message: '',
//     onConfirm: null
//   });

//   // setConfirmData({
//   //   isOpen: true,
//   //   message: 'האם לשמור את הקובץ לפני המחיקה?',
//   //   onConfirm: () => {
//   //     saveFile(name, editorToRemove);
//   //     closeConfirm();
//   //   },
//   //   onCancel: closeConfirm
//   // });

//   const closeConfirm = () => {
//     setConfirmData({ isOpen: false, message: '', onConfirm: null, onCancel: null });
//   };

//   const removeEditor = () => {
//     const editorToRemove = editors.find(e => e.id === activeId);
//     const savedName = fileMap[activeId];
  
//     if (savedName) {
//       const savedFile = loadFile(savedName);
//       const hasChanged = (
//         editorToRemove.content !== savedFile.content ||
//         editorToRemove.font !== savedFile.font ||
//         editorToRemove.fontSize !== savedFile.fontSize ||
//         editorToRemove.color !== savedFile.color
//       );
  
//       if (hasChanged) {
//         setConfirmData({
//           isOpen: true,
//           message: 'יש שינויים שלא נשמרו. האם לשמור לפני מחיקה?',
//           onConfirm: () => {
//             saveFile(savedName, editorToRemove);
//             closeConfirm();
//           },
//           onCancel: () => {
//             closeConfirm();
//             reallyRemoveEditor();
//           }
//         });
//         return;
//       }
//     } else {
//       setConfirmData({
//         isOpen: true,
//         message: 'האם לשמור את הקובץ לפני המחיקה?',
//         onConfirm: () => {
//           const name = prompt('הזן שם לקובץ:');
//           if (name && name.trim()) {
//             saveFile(name.trim(), editorToRemove);
//             setFileMap(prev => ({ ...prev, [activeId]: name.trim() }));
//             setFileList(Object.keys(getAllFiles()));
//             setFileName(name.trim());
//           }
//           closeConfirm();
//         },
//         onCancel: () => {
//           closeConfirm();
//           reallyRemoveEditor();
//         }
//       });
//       return;
//     }
  
//     reallyRemoveEditor();
//   };

//   const reallyRemoveEditor = () => {
//     const updated = editors.filter(e => e.id !== activeId);
//     setEditors(updated);
  
//     if (updated.length > 0) {
//       const next = updated[0];
//       setActiveId(next.id);
//       setFileName(fileMap[next.id] || '');
//     } else {
//       setFileName('');
//     }
//   };
  
  

//   const saveWithName = (name, editorData) => {
//     saveFile(name, editorData);
//     if (!fileList.includes(name)) {
//       setFileList(Object.keys(getAllFiles()));
//     }
//     setFileMap((prev) => ({ ...prev, [activeId]: name }));
//     setFileName(name);
//   };

//   const loadFromName = (name) => {
//     const loaded = loadFile(name);
//     if (loaded) {
//       updateEditor(activeId, {
//         content: loaded.content,
//         font: loaded.font,
//         fontSize: loaded.fontSize,
//         color: loaded.color
//       });
//       setFileMap((prev) => ({ ...prev, [activeId]: name }));
//       setFileName(name);
//     }
//   };

//   const handleSetActiveId = (id) => {
//     setActiveId(id);
//     const existing = fileMap[id] || '';
//     setFileName(existing);
//   };

//   return (
//     <div className="App">
//       <h2>Multi-file text editor</h2>

//       <div className="editor-grid">
//         {editors.map(editor => (
//           <EditableTextArea
//             key={editor.id}
//             content={editor.content}
//             onChange={(newValue) => updateEditor(editor.id, { content: newValue })}
//             onClick={() => handleSetActiveId(editor.id)}
//             isActive={editor.id === activeId}
//             style={{
//               fontFamily: editor.font,
//               fontSize: `${editor.fontSize}px`,
//               color: editor.color
//             }}
//           />
//         ))}
//       </div>
//       <ConfirmDialog
//         isOpen={confirmData.isOpen}
//         message={confirmData.message}
//         onConfirm={confirmData.onConfirm}
//         onCancel={confirmData.onCancel}
//       />
//       <ControlPanel
//         activeEditor={activeEditor}
//         onUpdate={(data) => updateEditor(activeId, data)}
//         onUpdateContent={(value) => updateEditor(activeId, { content: value })}
//         onSave={saveWithName}
//         onDelete={removeEditor}
//         onLoad={loadFromName}
//         onAdd={addEditor}
//         fileName={fileName}
//         setFileName={setFileName}
//         fileList={fileList}
//         applyToAll={applyToAll}
//         setApplyToAll={setApplyToAll}
//         autoSave={autoSave}
//         setAutoSave={setAutoSave}
//       />
//     </div>
//   );
// };

// export default App;
import React, { useState } from 'react';
import './App.css';
import ControlPanel from './ControlPanel';
import EditableTextArea from './EditableTextArea';
import ConfirmDialog from './ConfirmDialog';
import { setConfirmHandler, hideConfirm } from './ConfirmService';
import { saveFile, getAllFiles, loadFile } from './StorageUtils';

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

  // רישום ה-handling פעם אחת כשהקומפוננטה נטענת
  if (!confirmData._handlerInitialized) {
    setConfirmHandler(setConfirmData);
    setConfirmData((prev) => ({ ...prev, _handlerInitialized: true }));
  }

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

  const reallyRemoveEditor = () => {
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

  const removeEditor = () => {
    const editorToRemove = editors.find(e => e.id === activeId);
    const savedName = fileMap[activeId];

    if (savedName) {
      const savedFile = loadFile(savedName);
      const hasChanged =
        editorToRemove.content !== savedFile.content ||
        editorToRemove.font !== savedFile.font ||
        editorToRemove.fontSize !== savedFile.fontSize ||
        editorToRemove.color !== savedFile.color;

      if (hasChanged) {
        setConfirmData({
          isOpen: true,
          message: 'יש שינויים שלא נשמרו. האם לשמור לפני מחיקה?',
          onConfirm: () => {
            saveFile(savedName, editorToRemove);
            hideConfirm();
          },
          onCancel: () => {
            hideConfirm();
            reallyRemoveEditor();
          }
        });
        return;
      }
    } else {
      setConfirmData({
        isOpen: true,
        message: 'האם לשמור את הקובץ לפני המחיקה?',
        onConfirm: () => {
          // const name = prompt('הזן שם לקובץ:');
          // if (name && name.trim()) {
          //   saveFile(name.trim(), editorToRemove);
          //   setFileMap(prev => ({ ...prev, [activeId]: name.trim() }));
          //   setFileList(Object.keys(getAllFiles()));
          //   setFileName(name.trim());
          // }
          saveFile(fileName, editorToRemove);
          hideConfirm();
        },
        onCancel: () => {
          hideConfirm();
          reallyRemoveEditor();
        }
      });
      return;
    }

    reallyRemoveEditor();
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
