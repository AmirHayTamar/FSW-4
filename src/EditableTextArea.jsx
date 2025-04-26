import React, { useState } from 'react';
import { setRange, clearRange } from './CursorService';

const EditableTextArea = ({ editorId, content, onChange, onClick, isActive, style = {} }) => {
  
  const [localContent, setLocalContent] = useState(content);

  const saveCursor = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setRange(editorId, selection.getRangeAt(0));
    }
  };
  
  return (
    <div
      className={`editable-box ${isActive ? 'active' : ''}`}
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
         fontFamily: style.fontFamily,
         fontSize: style.fontSize,
         color: style.color,
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
