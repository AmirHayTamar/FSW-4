import React from 'react';
import Keyboard from './Keyboard';

const ControlPanel = ({ activeEditor, onUpdate, onDelete, onAdd, applyToAll, setApplyToAll }) => {

  const handleStyleChange = (prop, value) => {
    if (applyToAll) {
      onUpdate({ [prop]: value }); // עדכון גם בעיצוב וגם רינדור מיידי
    } else {
      // נשמר רק לעתיד, לא נעדכן תוכן קיים
      onUpdate({ [prop]: value }); // העיצוב כבר ישפיע על הטקסט החדש דרך style של textarea
    }
  };

  const downloadAsFile = () => {
    const blob = new Blob([activeEditor.content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `file-${activeEditor.id}.txt`;
    a.click();
  };

  const handleKeyPress = (char) => {
    onUpdate({ content: activeEditor.content + char });
  };

  return (
    <div className="ControlPanel">
      <div>
      <button onClick={() => setApplyToAll(!applyToAll)}>
        {applyToAll ? '🖍️ עיצוב ישפיע על כל הטקסט' : '✍️ עיצוב רק על טקסט חדש'}
      </button>
        <label>font: </label>
        <select value={activeEditor.font} onChange={(e) => handleStyleChange('font', e.target.value)}>
          <option value="Arial">Arial</option>
          <option value="Courier">Courier</option>
          <option value="Verdana">Verdana</option>
        </select>

        <label>size: </label>
        <input type="number" value={activeEditor.fontSize} onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
 />

        <label>color :</label>
        <input type="color" value={activeEditor.color} onChange={(e) => handleStyleChange('color', e.target.value)} />
      </div>

      <Keyboard onKeyPress={handleKeyPress} />

      <div>
        <button onClick={downloadAsFile}>⬇️ save file</button>
        <button onClick={() => onUpdate({ content: '' })}>🧹 cline text</button>
        <button onClick={onDelete}>🗑️ delete file</button>
        <button onClick={onAdd}>➕ add file</button>
      </div>
    </div>
  );
};

export default ControlPanel;
