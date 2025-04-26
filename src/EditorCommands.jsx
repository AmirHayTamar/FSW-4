// פונקציה כללית למקד את הסמן בעורך המתאים לפי editorId
const focusEditor = (editorId) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
  if (box) {
    box.focus();
  }
  else{
    console.warn(`❌ applyGlobalStyle: לא נמצא עורך עם id editor-${editorId}`);
    return;
  }
};

export const applyGlobalStyle = (style, editorId) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
  if (!box) {
    console.warn(`❌ applyGlobalStyle: לא נמצא עורך עם id editor-${editorId}`);
    return;
  }

  const plainText = box.innerText;

  const span = document.createElement('span');
  span.innerText = plainText;
  if (style.font) span.style.fontFamily = style.font;
  if (style.fontSize) span.style.fontSize = `${style.fontSize}px`;
  if (style.color) span.style.color = style.color;

  box.innerHTML = '';
  box.appendChild(span);

  const inputEvent = new Event('input', { bubbles: true });
  box.dispatchEvent(inputEvent);
};

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

export const highlightChar = (editorId, char) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
  if (!box || !char) return;

  const html = box.innerText.split('').map(c => {
    if (c === char) {
      return `<span style="background-color: yellow;">${c}</span>`;
    }
    return c;
  }).join('');

  box.innerHTML = html;

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(box);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};

export const replaceChar = (editorId, fromChar, toChar) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
  if (!box || !fromChar || !toChar) return;

  const newHtml = box.innerText.split('').map(c => {
    if (c === fromChar) return toChar;
    return c;
  }).join('');

  box.innerText = newHtml;

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(box);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};

const undoStack = {};

export const saveState = (editorId) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
  if (!box) return;
  if (!undoStack[editorId]) undoStack[editorId] = [];
  undoStack[editorId].push(box.innerHTML);
};

export const undo = (editorId) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
  if (!box || !undoStack[editorId] || undoStack[editorId].length === 0) return;

  const last = undoStack[editorId].pop();
  if (last) {
    box.innerHTML = last;

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(box);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};




export const deleteChar = (editorId) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
  if (!box) return;

  box.focus();

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  // אם הסמן אחרי תו כלשהו – נבחר תו אחד אחורה
  if (range.collapsed && range.startOffset > 0) {
    range.setStart(range.startContainer, range.startOffset - 1);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // מחיקה של הבחירה (תו אחד) – כאילו לחצת Backspace
  document.execCommand('delete');
};







export const deleteWord = (editorId) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
  if (!box) return;

  box.focus();

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const node = range.startContainer;

  if (node.nodeType === Node.TEXT_NODE) {
    const offset = range.startOffset;
    const text = node.textContent;
    const subText = text.slice(0, offset);
    const lastSpace = subText.lastIndexOf(' ');
    const start = lastSpace === -1 ? 0 : lastSpace + 1;

    const newText = text.slice(0, start) + text.slice(offset);
    node.textContent = newText;

    const newRange = document.createRange();
    newRange.setStart(node, start);
    newRange.setEnd(node, start);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
};


// 💣 מחיקת כל הטקסט בעורך
export const clearAll = (editorId) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
  if (box) {
    box.innerHTML = '';
    const inputEvent = new Event('input', { bubbles: true });
    box.dispatchEvent(inputEvent);
  }
};


