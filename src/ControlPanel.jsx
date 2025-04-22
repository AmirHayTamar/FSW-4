import React from 'react';
import Keyboard from './Keyboard';
import { showConfirm } from './ConfirmService';

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
  setAutoSave
}) => {
  const handleStyleChange = (prop, value) => {
    const updatedStyle = { ...activeEditor, [prop]: value };
    onUpdate({ [prop]: value });
  
    if (applyToAll && typeof window.applyGlobalStyle === 'function') {
      window.applyGlobalStyle({
        font: prop === 'font' ? value : activeEditor.font,
        fontSize: prop === 'fontSize' ? value : activeEditor.fontSize,
        color: prop === 'color' ? value : activeEditor.color
      }, activeEditor.id); 
    }
  };
  

  const handleSave = () => {
    if (!fileName.trim()) {
      showConfirm({
        message: 'יש להזין שם קובץ לפני השמירה.',
        onConfirm: () => {},
        onCancel: null,
        confirmText: 'הבנתי'
      });
      return;
    }
    onSave(fileName, activeEditor);
  };

  const handleLoad = (name) => {
    const loaded = onLoad(name);
    if (loaded) {
      onUpdateContent(loaded.content);
      onUpdate({
        font: loaded.font,
        fontSize: loaded.fontSize,
        color: loaded.color
      });
      setFileName(name);
    }
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
        activeEditorId={activeEditor.id} 
      />

      <div>
        <button onClick={onAdd}>➕ הוסף קובץ חדש</button>
        <button onClick={onDelete}>🗑️ מחק קובץ</button>
      </div>
    </div>
  );
};

export default ControlPanel;
