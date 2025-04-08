import React, { useState } from 'react';
import Editor from './Editor';
import TextDisplay from './TextDisplay';
import Storage from './Storage';
import './App.css';

const App = () => {
  const [text, setText] = useState('');
  const [font, setFont] = useState('Arial');
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState('#000000');

  return (
    <div className="App">
      <h1>Text Editor</h1>
      <TextDisplay text={text} font={font} fontSize={fontSize} textColor={textColor} />
      <Editor
        text={text}
        setText={setText}
        setFont={setFont}
        setFontSize={setFontSize}
        setTextColor={setTextColor}
      />
      <Storage text={text} />
    </div>
  );
};

export default App;
