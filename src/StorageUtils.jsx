export const getAllFiles = () => {
  return JSON.parse(localStorage.getItem('virtualFiles') || '{}');
};

export const saveFile = (fileName, content) => {
  const files = getAllFiles();
  files[fileName] = content;
  localStorage.setItem('virtualFiles', JSON.stringify(files));
};

export const loadFile = (fileName) => {
  const files = getAllFiles();
  return files[fileName] || '';
};
