import React from 'react';

const TextDisplay = ({ text, font, fontSize, textColor }) => {
  return (
    <div className="TextDisplay" style={{ fontFamily: font, fontSize: `${fontSize}px`, color: textColor }}>
      <h3>Text Display Area:</h3>
      <p>{text}</p>
    </div>
  );
};

export default TextDisplay;
