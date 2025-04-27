const EditableTextArea = ({ editorId, onChange, onClick, isActive, style = {} }) => {
  
  return (
    <div
      className={`editable-box ${isActive ? 'active' : ''}`}
      data-id={`editor-${editorId}`}
      contentEditable
      suppressContentEditableWarning
      onClick={() => {
        onClick();
      }}
       style={{
         fontFamily: style.fontFamily,
         fontSize: style.fontSize,
         color: style.color,
       }}
      onBlur={(e) => {
        const updated = e.currentTarget.innerHTML;
        onChange(updated);
      }}
      
    ></div>
  );
};

export default EditableTextArea;
