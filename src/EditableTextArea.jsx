import React, { useState } from 'react';
import { insertStyledChar, setRange, clearRange } from './CursorService';

const EditableTextArea = ({
  editorId,
  content,
  onChange,
  onClick,
  isActive,
  style = {}
}) => {
  const [localContent, setLocalContent] = useState(content);

  const saveCursor = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setRange(editorId, selection.getRangeAt(0));
    }
  };
  
  window.applyGlobalStyle = (style, targetId) => {
    const box = document.querySelector(`.editable-box[data-id="editor-${targetId}"]`);
    if (!box) {
      console.warn(`❌ applyGlobalStyle: לא נמצא עורך עם id editor-${targetId}`);
      return;
    }
  
    const plainText = box.innerText;
  
    const span = document.createElement('span');
    span.innerText = plainText;
    if (style.font) span.style.fontFamily = style.font;
    if (style.fontSize) span.style.fontSize = `${style.fontSize}px`;
    if (style.color) span.style.color = style.color;
  
    box.innerHTML = '';
    box.appendChild(span);
  
    const inputEvent = new Event('input', { bubbles: true });
    box.dispatchEvent(inputEvent);
  };

  return (
    <div
      className="editable-box"
      data-id={`editor-${editorId}`}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => {
        setLocalContent(e.currentTarget.innerHTML);
        onChange(e.currentTarget.innerHTML);
      }}
      onClick={() => {
        onClick();
        saveCursor();
      }}
      onKeyUp={saveCursor}
      style={{
        border: isActive ? '2px solid #00a8ff' : '1px solid #ccc',
        width: '300px',
        height: '150px',
        borderRadius: '8px',
        padding: '10px',
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        color: style.color,
        backgroundColor: '#fff',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}
      dangerouslySetInnerHTML={{ __html: localContent }}
      onBlur={(e) => {
        const updated = e.currentTarget.innerHTML;
        setLocalContent(updated);
        onChange(updated);
      }}
      
    ></div>
  );
};

export default EditableTextArea;
