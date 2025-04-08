import React, { useState } from 'react';

const Editor = ({ text, setText, setFont, setFontSize, setTextColor }) => {
  const [currentText, setCurrentText] = useState(text);

  const handleChange = (e) => setCurrentText(e.target.value);

  return (
    <div className="Editor">
      <textarea
        value={currentText}
        onChange={handleChange}
        style={{
          fontFamily: setFont,
          fontSize: `${setFontSize}px`,
          color: setTextColor,
        }}
      />
      <button onClick={() => setText(currentText)}>Save Text</button>
      <button onClick={() => setText('')}>Clear Text</button>

      {/* Font and Style Controls */}
      <div>
        <label>Font Size:</label>
        <input
          type="number"
          value={setFontSize}
          onChange={(e) => setFontSize(e.target.value)}
        />
      </div>
      <div>
        <label>Font Family:</label>
        <select onChange={(e) => setFont(e.target.value)} value={setFont}>
          <option value="Arial">Arial</option>
          <option value="Courier">Courier</option>
          <option value="Verdana">Verdana</option>
        </select>
      </div>
      <div>
        <label>Text Color:</label>
        <input
          type="color"
          onChange={(e) => setTextColor(e.target.value)}
          value={setTextColor}
        />
      </div>
    </div>
  );
};

export default Editor;
