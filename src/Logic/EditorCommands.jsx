export const insertStyledChar = (char, style, editorId, isGlobal = false) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
  if (!box) return;
  box.focus();
  saveState(editorId);
  if (!isGlobal || char === ' ') {
    const span = document.createElement('span');
    span.setAttribute('dir', 'rtl'); 
    span.textContent = char;

    if (style.font) span.style.fontFamily = style.font;
    if (style.fontSize) span.style.fontSize = `${style.fontSize}px`;
    if (style.color) span.style.color = style.color;

    box.appendChild(span);

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
    const plainText = box.textContent + char;
     box.innerHTML = '';
    for (const char of plainText) {
      const span = document.createElement('span');
      span.setAttribute('dir', 'rtl');
      span.textContent = char;
    
      if (style.font) span.style.fontFamily = style.font;
      if (style.fontSize) span.style.fontSize = `${style.fontSize}px`;
      if (style.color) span.style.color = style.color;
    
      box.appendChild(span);
    }

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
  saveState(editorId);
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

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(box);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};

export const replace = (editorId) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${editorId}"]`);
  if (!box) return;
  saveState(editorId);

  const fromStr = prompt('הזן את המילה או המחרוזת שברצונך להחליף:');
  if (!fromStr) return;

  const toStr = prompt(`הזן את המילה או המחרוזת שתחליף את "${fromStr}":`);
  if (toStr === null) return;

  box.focus();

  const spans = Array.from(box.children);
  const charList = []; 

  spans.forEach(span => {
    const text = span.innerText;
    for (const char of text) {
      charList.push({ char, span });
    }
  });

  const fullText = charList.map(c => c.char).join('');

  const indexesToReplace = [];
  let searchIndex = 0;
  while (searchIndex <= fullText.length - fromStr.length) {
    if (fullText.slice(searchIndex, searchIndex + fromStr.length) === fromStr) {
      indexesToReplace.push(searchIndex);
      searchIndex += fromStr.length;
    } else {
      searchIndex += 1;
    }
  }

  const fragment = document.createDocumentFragment();
  let i = 0;
  while (i < charList.length) {
    if (indexesToReplace.includes(i)) {
      const sourceSpan = charList[i].span;
      const newSpan = sourceSpan.cloneNode();
      newSpan.innerText = toStr;
      fragment.appendChild(newSpan);
      i += fromStr.length; 
    } else {
      const originalSpan = charList[i].span.cloneNode();
      originalSpan.innerText = charList[i].char;
      fragment.appendChild(originalSpan);
      i += 1;
    }
  }

  box.innerHTML = '';
  box.appendChild(fragment);

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
  saveState(editorId);
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
  saveState(editorId);
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
    saveState(editorId);
    box.innerHTML = '';
    const inputEvent = new Event('input', { bubbles: true });
    box.dispatchEvent(inputEvent);
  }
};


