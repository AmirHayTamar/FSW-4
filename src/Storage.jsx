import React, { useEffect } from 'react';

const Storage = ({ text }) => {
  useEffect(() => {
    if (text) {
      localStorage.setItem('savedText', text);
    }
  }, [text]);

  const loadText = () => {
    const savedText = localStorage.getItem('savedText');
    if (savedText) {
      alert('Text Loaded: ' + savedText);
    } else {
      alert('No saved text found!');
    }
  };

  return (
    <div className="Storage">
      <button onClick={loadText}>Load Saved Text</button>
    </div>
  );
};

export default Storage;
