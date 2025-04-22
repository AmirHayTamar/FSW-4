import React, { useState } from 'react';
import { insertStyledChar } from './CursorService';

const baseLayouts = {
  en: [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m',' ']
  ],
  he: [
    ['ק','ר','א','ט','ו','ן','ם','פ'],
    ['ש','ד','ג','כ','ע','י','ח','ל','ך'],
    ['ז','ס','ב','ה','נ','מ','צ','ת','ץ',' ']
  ],
  numbersAndOther: [
    ['1','2','3','4','5','6','7','8','9','0'],
    ['.',',','!','?','@',' ']
  ],
  emoji: [
    ['😀','😂','😍','😎','😭','😡','😴','👍','👎','👏'],
    ['🔥','💥','🎉','❤️','💡','✅','❌','🤔','🥳','💻']
  ]
};

const layoutLabels = {
  en: 'English',
  he: 'עברית',
  emoji: 'אימוג\'ים',
  numbersAndOther: 'מספרים וסימנים'
};

const Keyboard = ({ onKeyPress, applyToAll, activeEditorStyles, activeEditorId }) => {
  const [layout, setLayout] = useState('en');
  const [shift, setShift] = useState(false);

  const cycleLayout = () => {
    const keys = Object.keys(baseLayouts);
    const nextIndex = (keys.indexOf(layout) + 1) % keys.length;
    setLayout(keys[nextIndex]);
    setShift(false);
  };

  const handleKeyPress = (key) => {
    if (key === '⇧') {
      setShift(!shift);
    } else {
      if (applyToAll) {
        onKeyPress(key); 
      } else {
        insertStyledChar(key, activeEditorStyles, activeEditorId); 
      }

      if (shift) setShift(false);
    }
  };

  const getProcessedLayout = () => {
    const layoutData = baseLayouts[layout];
    if (layout === 'en' && shift) {
      return layoutData.map(row => row.map(char => char.toUpperCase()));
    }
    return layoutData;
  };

  return (
    <div className="Keyboard">
      <div className="keyboard-area">
        <div className="keyboard-row keyboard-top-row">
          <div className="keyboard-lang">
            {layout === 'en' && (
              <button onClick={() => setShift(!shift)} className={`keyboard-key ${shift ? 'active' : ''}`}>
                ⇧
              </button>
            )}
            <div className="tooltip-wrapper">
              <button onClick={cycleLayout} className="keyboard-key">
                {layoutLabels[layout]}
              </button>
              <span className="tooltip-text">
                {layout === 'en' ? 'To switch to Hebrew, click' :
                 layout === 'he' ? 'To switch to numbers and signs' :
                 layout === 'numbersAndOther' ? 'To switch to emojis' :
                 'To switch to English'}
              </span>
            </div>
          </div>
        </div>

        {getProcessedLayout().map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key, i) => (
              <button
                key={i}
                className="keyboard-key"
                onClick={() => handleKeyPress(key)}
              >
                {key === ' ' ? '␣' : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard;
