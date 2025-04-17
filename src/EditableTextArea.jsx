import React from 'react';

const EditableTextArea = ({
  content,
  onChange,
  onClick,
  isActive,
  style = {}
}) => {
  return (
    <textarea
      className="editable-textarea"
      value={content}
      onChange={(e) => onChange(e.target.value)}
      onClick={onClick}
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
        boxSizing: 'border-box'
      }}
    />
  );
};

export default EditableTextArea;
