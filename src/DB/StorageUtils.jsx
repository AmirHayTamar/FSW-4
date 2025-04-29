import { showConfirm, hideConfirm } from '../Logic/ConfirmService';

export const getAllFiles = (currentUser) => {
  if(currentUser === undefined){
    return
  }
  if(currentUser === "all"){
    return JSON.parse(localStorage.getItem('virtualFiles') || '{}');
  }
  const allFiles = JSON.parse(localStorage.getItem('virtualFiles') || '{}');
  const userFiles = {};

  for (const [fileName, fileData] of Object.entries(allFiles)) {
    if (fileData.userName === currentUser) {
      userFiles[fileName] = fileData;
    }
  }

  return userFiles;
};


export const loadFile = (name,currentUser) => {
  const files = getAllFiles(currentUser);

  return files[name] || null;
};

export const saveFile = (name, editorData,autoSave) => {
  const files = getAllFiles("all");

  files[name] = {
    html: editorData.content || '',  
    font: editorData.font || 'Arial',
    fontSize: editorData.fontSize || 16,
    color: editorData.color || '#000000',
    userName: editorData.userName 
  };

  localStorage.setItem('virtualFiles', JSON.stringify(files));

  if(!autoSave){
      showConfirm({
      message: '.הקובץ נשמר בהצלחה',
      onConfirm: hideConfirm,
      onCancel: null,
    });
  }
};

export const registerUser = (username, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[username]) {
    return { success: false, message: 'המשתמש כבר קיים.' };
  } else {
    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
    showConfirm({
      message: 'נרשמת בהצלחה!',
      onConfirm: hideConfirm,
      onCancel: null,
    });
    return { success: true, message: 'נרשמת בהצלחה!' };
  }
};

export const loginUser = (username, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[username] && users[username] === password) {
    return { success: true };
  } else {
    return { success: false, message: 'שם משתמש או סיסמה שגויים.' };
  }
};

export const getcurrentUser = () => {
  return localStorage.getItem('currentUser') || ''
};

export const setCurrentUserUtils = (username) => {
  localStorage.setItem('currentUser', username);
};

