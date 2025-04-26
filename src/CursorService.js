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
