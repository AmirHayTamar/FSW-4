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
    span.setAttribute('dir', 'rtl'); 
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
export const highlightChar = (editorId) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
  if (!box) return;

  const searchTerm = prompt('הזן תו או מילה לחיפוש:');
  if (!searchTerm) return;

  box.focus();

  const fullText = Array.from(box.children).map(span => span.innerText).join('');

  box.innerHTML = '';

  let i = 0;
  while (i < fullText.length) {
    if (fullText.slice(i, i + searchTerm.length) === searchTerm) {
      const highlightSpan = document.createElement('span');
      highlightSpan.innerText = searchTerm;
      highlightSpan.style.backgroundColor = 'yellow';
      highlightSpan.setAttribute('dir', 'rtl');
      box.appendChild(highlightSpan);
      i += searchTerm.length;
    } else {
      const normalSpan = document.createElement('span');
      normalSpan.innerText = fullText[i];
      normalSpan.setAttribute('dir', 'rtl');
      box.appendChild(normalSpan);
      i += 1;
    }
  }

  // מוסיפים האזנה כדי לנקות הדגשה ב-input
  function handleInput() {
    clearHighlights(editorId);
    box.removeEventListener('input', handleInput);
  }

  box.addEventListener('input', handleInput);

  // מחזירים את הסמן לסוף
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(box);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};


export const clearHighlights = (editorId) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
  if (!box) return;

  const fullText = box.innerText;

  box.innerHTML = '';

  for (const char of fullText) {
    const span = document.createElement('span');
    span.setAttribute('dir', 'rtl');
    span.innerText = char;
    box.appendChild(span);
  }
};


export const replaceChar = (editorId) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
  if (!box) return;

  const fromStr = prompt('הזן את המילה או המחרוזת שברצונך להחליף:');
  if (!fromStr) return;

  const toStr = prompt(`הזן את המילה או המחרוזת שתחליף את "${fromStr}":`);
  if (toStr === null) return; 

  box.focus();

  const fullText = Array.from(box.children).map(span => span.innerText).join('');

  const replacedText = fullText.split(fromStr).join(toStr);

  box.innerHTML = '';

  for (const char of replacedText) {
    const span = document.createElement('span');
    span.setAttribute('dir', 'rtl'); 
    span.innerText = char;
    box.appendChild(span);
  }

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

  if (box.children.length > 0) {
    const lastChild = box.children[box.children.length - 1];
    lastChild.remove();
  }

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(box);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};


export const deleteWord = (editorId) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
  if (!box) return;

  box.focus();

  while (box.children.length > 0) {
    const lastChild = box.children[box.children.length - 1];
    const char = lastChild.innerText || lastChild.textContent;

    lastChild.remove();

    if (char === ' ') {
      break;
    }
  }

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(box);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};


export const clearAll = (editorId) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
  if (box) {
    box.innerHTML = '';
    const inputEvent = new Event('input', { bubbles: true });
    box.dispatchEvent(inputEvent);
  }
};


