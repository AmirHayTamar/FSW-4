// import React from 'react';
// import Keyboard from './Keyboard';

// const ControlPanel = ({ activeEditor, onUpdate, onDelete, onAdd, applyToAll, setApplyToAll }) => {

//   const handleStyleChange = (prop, value) => {
//     if (applyToAll) {
//       onUpdate({ [prop]: value }); // עדכון גם בעיצוב וגם רינדור מיידי
//     } else {
//       // נשמר רק לעתיד, לא נעדכן תוכן קיים
//       onUpdate({ [prop]: value }); // העיצוב כבר ישפיע על הטקסט החדש דרך style של textarea
//     }
//   };

//   const downloadAsFile = () => {
//     const blob = new Blob([activeEditor.content], { type: 'text/plain' });
//     const a = document.createElement('a');
//     a.href = URL.createObjectURL(blob);
//     a.download = `file-${activeEditor.id}.txt`;
//     a.click();
//   };

//   const handleKeyPress = (char) => {
//     onUpdate({ content: activeEditor.content + char });
//   };

//   return (
//     <div className="ControlPanel">
//       <div>
//       <button onClick={() => setApplyToAll(!applyToAll)}>
//         {applyToAll ? '🖍️ עיצוב ישפיע על כל הטקסט' : '✍️ עיצוב רק על טקסט חדש'}
//       </button>
//         <label>font: </label>
//         <select value={activeEditor.font} onChange={(e) => handleStyleChange('font', e.target.value)}>
//           <option value="Arial">Arial</option>
//           <option value="Courier">Courier</option>
//           <option value="Verdana">Verdana</option>
//         </select>

//         <label>size: </label>
//         <input type="number" value={activeEditor.fontSize} onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
//  />

//         <label>color :</label>
//         <input type="color" value={activeEditor.color} onChange={(e) => handleStyleChange('color', e.target.value)} />
//       </div>

//       <Keyboard onKeyPress={handleKeyPress} />

//       <div>
//         <button onClick={downloadAsFile}>⬇️ save file</button>
//         <button onClick={() => onUpdate({ content: '' })}>🧹 cline text</button>
//         <button onClick={onDelete}>🗑️ delete file</button>
//         <button onClick={onAdd}>➕ add file</button>
//       </div>
//     </div>
//   );
// };

// export default ControlPanel;

import React from 'react';
import Keyboard from './Keyboard';

const ControlPanel = ({
  activeEditor,
  onUpdate,
  onAdd,
  onUpdateContent,
  onSave,
  onDelete,
  onLoad,
  fileName,
  setFileName,
  fileList,
  applyToAll,
  setApplyToAll,
  autoSave,
  setAutoSave,
  editorRef
}) => {
  const handleStyleChange = (prop, value) => {
    onUpdate({ [prop]: value });
  };

  const handleSave = () => {
    if (!fileName.trim()) {
      alert('יש להזין שם קובץ');
      return;
    }
    onSave(fileName, activeEditor.content);
  };

  const handleLoad = (name) => {
    const content = onLoad(name);
    onUpdateContent(content);
    setFileName(name);
  };

  return (
    <div className="ControlPanel">
      <div>
        <label>שם קובץ:</label>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <button onClick={handleSave}>💾 שמור</button>
        <label>
          <input
            type="checkbox"
            checked={autoSave}
            onChange={() => setAutoSave(!autoSave)}
          />
          שמירה אוטומטית
        </label>
      </div>

      <div>
        <label>טען קובץ קיים:</label>
        <select onChange={(e) => handleLoad(e.target.value)} defaultValue="">
          <option value="" disabled>בחר קובץ</option>
          {fileList.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button onClick={() => setApplyToAll(!applyToAll)}>
          {applyToAll ? '🖍️ שינוי כללי' : '✍️ שינוי מקומי'}
        </button>

        <label>גופן:</label>
        <select
          value={activeEditor.font}
          onChange={(e) => handleStyleChange('font', e.target.value)}
        >
          <option value="Arial">Arial</option>
          <option value="Courier">Courier</option>
          <option value="Verdana">Verdana</option>
        </select>

        <label>גודל:</label>
        <input
          type="number"
          value={activeEditor.fontSize}
          onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
        />

        <label>צבע:</label>
        <input
          type="color"
          value={activeEditor.color}
          onChange={(e) => handleStyleChange('color', e.target.value)}
        />
      </div>

      <Keyboard
        onKeyPress={(char) => document.execCommand('insertText', false, char)}
        applyToAll={applyToAll}
        activeEditorStyles={{
          font: activeEditor.font,
          fontSize: activeEditor.fontSize,
          color: activeEditor.color
        }}
        editorRef={editorRef}
      />

      <div>
        <button onClick={onAdd}>➕ הוסף קובץ חדש</button>
        <button onClick={onDelete}>🗑️ delete file</button>
      </div>
    </div>
  );
};

export default ControlPanel;
