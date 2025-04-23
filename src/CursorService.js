const rangeMap = {};

export const setRange = (editorId, range) => {
  rangeMap[editorId] = range;
};

export const getRange = (editorId) => {
  return rangeMap[editorId] || null;
};

export const clearRange = (editorId) => {
  rangeMap[editorId] = null;
};

// export const insertStyledChar = (char, style, editorId) => {
//   const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
//   if (!box) return;

//   box.focus();

//   const span = document.createElement('span');
//   span.textContent = char;
//   if (style.font) span.style.fontFamily = style.font;
//   if (style.fontSize) span.style.fontSize = `${style.fontSize}px`;
//   if (style.color) span.style.color = style.color;

//   // ❗ נכניס את הסמן לסוף בכל פעם
//   const range = document.createRange();
//   range.selectNodeContents(box);
//   range.collapse(false);

//   const selection = window.getSelection();
//   selection.removeAllRanges();
//   selection.addRange(range);

//   range.insertNode(span);

//   // נעדכן את הסמן אחרי ה־span החדש
//   const newRange = document.createRange();
//   newRange.setStartAfter(span);
//   newRange.setEndAfter(span);
//   selection.removeAllRanges();
//   selection.addRange(newRange);
// };

// export const insertStyledChar = (char, style, editorId, isGlobal = false) => {
//   const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
//   if (!box) return;
//   box.focus();

//   if (!isGlobal) {
//     const span = document.createElement('span');
//     span.setAttribute('dir', 'rtl'); // ✅ קריטי!
//     span.textContent = char;
  
//     if (style.font) span.style.fontFamily = style.font;
//     if (style.fontSize) span.style.fontSize = `${style.fontSize}px`;
//     if (style.color) span.style.color = style.color;
  
//     box.appendChild(span);
  
//     const range = document.createRange();
//     range.selectNodeContents(box);
//     range.collapse(false);
//     const selection = window.getSelection();
//     selection.removeAllRanges();
//     selection.addRange(range);
//   }
//    else {
//     // 🖍️ שינוי כללי – לוקח את כל הטקסט, מוסיף את התו, ועוטף מחדש
//     const plainText = box.innerText + char;
//     const span = document.createElement('span');
//     span.setAttribute('dir', 'rtl'); 
//     span.innerText = plainText;
//     if (style.font) span.style.fontFamily = style.font;
//     if (style.fontSize) span.style.fontSize = `${style.fontSize}px`;
//     if (style.color) span.style.color = style.color;

//     box.innerHTML = '';
//     box.appendChild(span);
//   }
// };
export const insertStyledChar = (char, style, editorId, isGlobal = false) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
  if (!box) return;
  box.focus();

  if (!isGlobal) {
    // ✍️ שינוי מקומי – מוסיף תו בעיצוב לתוך span
    const span = document.createElement('span');
    span.setAttribute('dir', 'rtl'); // 👈 חובה כדי לשמור כיוון
    span.textContent = char;

    if (style.font) span.style.fontFamily = style.font;
    if (style.fontSize) span.style.fontSize = `${style.fontSize}px`;
    if (style.color) span.style.color = style.color;

    box.appendChild(span);

    // ✅ נכניס placeholder זמני כדי למקם את הסמן אחרי התו
    const placeholder = document.createTextNode('');
    box.appendChild(placeholder);

    const range = document.createRange();
    range.setStartAfter(placeholder);
    range.setEndAfter(placeholder);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    placeholder.remove();

  } else {
    // 🖍️ שינוי כללי – מחליף את כל התוכן עם עיצוב כולל
    const plainText = box.innerText + char;
    const span = document.createElement('span');
    span.setAttribute('dir', 'rtl'); // 👈 גם כאן
    span.innerText = plainText;

    if (style.font) span.style.fontFamily = style.font;
    if (style.fontSize) span.style.fontSize = `${style.fontSize}px`;
    if (style.color) span.style.color = style.color;

    box.innerHTML = '';
    box.appendChild(span);

    // ✅ החזרת הסמן לסוף
    const range = document.createRange();
    range.selectNodeContents(box);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
};
