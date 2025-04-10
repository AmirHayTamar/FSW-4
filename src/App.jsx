import React, { useState } from 'react';
import Editor from './Editor';
import Storage from './Storage';
import './App.css';

const App = () => {
  const [text, setText] = useState('');
  const [font, setFont] = useState('Arial');
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState('#000000');

  return (
    <div className="App">
      <Editor
        text={text}
        setText={setText}
        font={font}
        setFont={setFont}
        fontSize={fontSize}
        setFontSize={setFontSize}
        textColor={textColor}
        setTextColor={setTextColor}
      />
      <Storage text={text} />
    </div>
  );
};

export default App;
