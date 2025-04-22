
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

export const insertStyledChar = (char, style, editorId) => {
  const range = getRange(editorId);
  if (!range) return;

  const span = document.createElement('span');
  span.textContent = char;
  if (style.font) span.style.fontFamily = style.font;
  if (style.fontSize) span.style.fontSize = `${style.fontSize}px`;
  if (style.color) span.style.color = style.color;

  const placeholder = document.createTextNode('');
  const frag = document.createDocumentFragment();
  frag.appendChild(span);
  frag.appendChild(placeholder);

  range.deleteContents();
  range.insertNode(frag);

  const newRange = document.createRange();
  newRange.setStartAfter(placeholder);
  newRange.setEndAfter(placeholder);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(newRange);

  placeholder.remove();
  setRange(editorId, newRange);
};
