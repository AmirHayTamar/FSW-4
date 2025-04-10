import React, { useState } from 'react';
import Keyboard from './Keyboard';

const Editor = ({
  text,
  setText,
  font,
  setFont,
  fontSize,
  setFontSize,
  textColor,
  setTextColor
}) => {
  const [currentText, setCurrentText] = useState(text);

  const handleKeyPress = (char) => {
    setCurrentText((prev) => prev + char);
  };

  const handleChange = (e) => {
    setCurrentText(e.target.value);
  };

  const downloadAsFile = () => {
    const element = document.createElement("a");
    const file = new Blob([currentText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "text-editor-output.txt"; // אפשר לשנות שם הקובץ
    document.body.appendChild(element);
    element.click();
  };
  
  return (
    <div className="Editor">
      <textarea
        value={currentText}
        onChange={handleChange}
        placeholder="Type here or use keyboard"
        style={{
          fontFamily: font,
          fontSize: `${fontSize}px`,
          color: textColor,
        }}
      />
      <Keyboard onKeyPress={handleKeyPress} />

      <div>
        <button onClick={() => setText(currentText)}>💾 save</button>
        <button onClick={() => setCurrentText('')}>🧹 clean</button>
        <button onClick={downloadAsFile}>📄 Download as a file .txt</button>
      </div>

      <div>
        <label>size:</label>
        <input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} />

        <label>font:</label>
        <select onChange={(e) => setFont(e.target.value)}>
          <option value="Arial">Arial</option>
          <option value="Courier">Courier</option>
          <option value="Verdana">Verdana</option>
        </select>

        <label>color:</label>
        <input type="color" onChange={(e) => setTextColor(e.target.value)} />
      </div>
    </div>
  );
};

export default Editor;
