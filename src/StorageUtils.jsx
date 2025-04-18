export const getAllFiles = () => {
  return JSON.parse(localStorage.getItem('virtualFiles') || '{}');
};

export const loadFile = (name) => {
  const files = getAllFiles();
  return files[name] || null;
};

export const saveFile = (name, editorData) => {
  const files = getAllFiles();
  files[name] = {
    content: editorData.content,
    font: editorData.font,
    fontSize: editorData.fontSize,
    color: editorData.color
  };
  localStorage.setItem('virtualFiles', JSON.stringify(files));
};
