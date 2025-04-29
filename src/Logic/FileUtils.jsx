import { saveFile, loadFile } from '../DB/StorageUtils';
import { hideConfirm } from '../Logic/ConfirmService';

export const saveEditorToStorage = (name, activeId, editorData) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${activeId}"]`);
  if (!box) return;

  const htmlContent = box.innerHTML;

  saveFile(name, {
    content: htmlContent,
    font: editorData.font,
    fontSize: editorData.fontSize,
    color: editorData.color,
    userName : editorData.userName
  });
};

export const loadEditorFromStorage = (name, activeId, updateEditorCallback,currentUser) => {
  const loaded = loadFile(name,currentUser);
  if (!loaded) return;

  updateEditorCallback(activeId, {
    content: loaded.html,
    font: loaded.font,
    fontSize: loaded.fontSize,
    color: loaded.color,
    userName : loaded.userName
  });

  const box = document.querySelector(`.editable-box[data-id="editor-${activeId}"]`);
  if (box && loaded.html) {
    box.innerHTML = loaded.html;

    const range = document.createRange();
    range.selectNodeContents(box);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
};


export const hasEditorChanged = (editor, savedName) => {
  const savedFile = loadFile(savedName,editor.userName);
  if (!savedFile) return true;

  const box = document.querySelector(`.editable-box[data-id="editor-${editor.id}"]`);

  return (
    box.innerHTML !== savedFile.html 
  );
};

export const handleEditorRemoval = ({
  editor,
  editorId,
  fileMap,
  onDeleteConfirmed,
  setConfirmData,
}) => {
  const savedName = fileMap[editorId];

  if (savedName) {
    const changed = hasEditorChanged(editor, savedName);

    if (changed) {
      setConfirmData({
        isOpen: true,
        message: '?יש שינויים שלא נשמרו. האם לשמור לפני המחיקה',
        onConfirm: () => {
          saveFile(savedName, editor);
          hideConfirm();
        },
        onCancel: () => {
          hideConfirm();
          onDeleteConfirmed();
        }
      });
      return;
    }
  } else {
    setConfirmData({
      isOpen: true,
      message: '?לא שמרת את הקובץ , תרצה למחוק בכל זאת',
      onConfirm: () => {
        hideConfirm();
        onDeleteConfirmed();
      },
      onCancel: () => {
        hideConfirm();
      }
    });
    return;
  }

  onDeleteConfirmed();
};
