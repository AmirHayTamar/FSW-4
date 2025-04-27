import React from 'react';
import Keyboard from '../Components/Keyboard';
import { insertStyledChar, deleteChar, deleteWord, clearAll, highlightChar ,replace, undo } from '../Logic/EditorCommands';

const ControlPanel = ({
  activeEditor,
  onUpdate,
  onAdd,
  onSave,
  onDelete,
  onLoad,
  fileName,
  setFileName,
  fileList,
  applyToAll,
  setApplyToAll,
  autoSave,
  setAutoSave
}) => {

  if (!activeEditor) {
    return <div 
              className="ControlPanel">⛔ אין עורך פעיל כרגע
              <button onClick={onAdd}>➕ הוסף קובץ חדש</button>
            </div>;
  }

  const handleStyleChange = (prop, value) => {
    const updatedStyle = { ...activeEditor, [prop]: value };
    onUpdate({ [prop]: value });
    
    if (applyToAll) {
      insertStyledChar('',{
        font: prop === 'font' ? value : activeEditor.font,
        fontSize: prop === 'fontSize' ? value : activeEditor.fontSize,
        color: prop === 'color' ? value : activeEditor.color
      }, activeEditor.id,applyToAll);
    }
  };

  const handleSave = () => {
    onSave(fileName, activeEditor);
  };

  const handleLoad = (name) => {
    onLoad(name);
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
      {/* לראות אולי לעדכן את 3 הדיבים מתחת לקומפוננטות */}
        <select
          onChange={(e) => {
            const value = e.target.value;
            if (value) {
              handleLoad(value);
              e.target.value = ""; // מאפס מיידית אחרי טעינה
            }}}defaultValue=""
        >
          <option value="" disabled>בחר קובץ קיים</option>
          {fileList.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      {/* לראות אולי לעדכן את 3 הדיבים מתחת לקומפוננטות */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <button onClick={() => setApplyToAll(!applyToAll)}>
            {applyToAll ? '🖍️ שינוי כללי' : '✍️ שינוי מקומי'}
          </button>

          <label>גופן:</label>
          <select
            value={activeEditor.font || ''}
            onChange={(e) => handleStyleChange('font', e.target.value)}
          >
            <option value="Arial">Arial</option>
            <option value="Courier">Courier</option>
            <option value="Verdana">Verdana</option>
          </select>

          <label>גודל:</label>
          <input
            type="number"
            value={activeEditor.fontSize || 16}
            onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
          />

          <label>צבע:</label>
          <input
            type="color"
            value={activeEditor.color || '#000000'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={() => clearAll(activeEditor.id)}>💣 מחק הכל</button>
          <button onClick={() => deleteChar(activeEditor.id)}>❌ מחק תו</button>
          <button onClick={() => deleteWord(activeEditor.id)}>🧹 מחק מילה</button>
          <button onClick={() => replace(activeEditor.id)}>🔁 החלפה</button>
          <button onClick={() => undo(activeEditor.id)}>🔙 undo</button>
          <button onClick={() => highlightChar(activeEditor.id)}>🔎 חיפוש</button> 
          <button onClick={() => undo(activeEditor.id)}>❌🔎 הורדת החיפוש</button> 
        </div>
      </div>

      <Keyboard
        onKeyPress={(char) =>
          insertStyledChar(char, 
            {font: activeEditor.font,
            fontSize: activeEditor.fontSize,
            color: activeEditor.color},
            activeEditor.id, applyToAll)
        }
      />

      <div>
        <button onClick={onAdd}>➕ הוסף קובץ חדש</button>
        <button onClick={onDelete}>🗑️ מחק קובץ</button>
      </div>
    </div>
  );
};

export default ControlPanel;
