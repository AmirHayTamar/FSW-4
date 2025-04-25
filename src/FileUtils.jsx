// import { saveFile, loadFile, getAllFiles } from './StorageUtils';

// export const saveEditorToStorage = (name, activeId, editorData) => {
//   const box = document.querySelector(`.editable-box[data-id="editor-${activeId}"]`);
//   if (!box) return;

//   saveFile(name, {
//     content: box.innerHTML,
//     font: editorData.font,
//     fontSize: editorData.fontSize,
//     color: editorData.color
//   });

// //   if (!fileList.includes(name)) {
// //     setFileList(Object.keys(getAllFiles()));
// //   }

// //   setFileMap(prev => ({ ...prev, [activeId]: name }));
// //   setFileName(name);
// };


// export const loadEditorFromStorage = (name, activeId, updateEditorCallback) => {
//   const loaded = loadFile(name);
//   if (!loaded) return;

//   const box = document.querySelector(`.editable-box[data-id="editor-${activeId}"]`);
//   if (box && loaded.html) {
//     box.innerHTML = loaded.html;

//     // ⬅️ גם שומרים את אותו תוכן ב־state כדי למנוע override
//     //updateEditor(activeId, { content: loaded.html });

//     const range = document.createRange();
//     range.selectNodeContents(box);
//     range.collapse(false);
//     const selection = window.getSelection();
//     selection.removeAllRanges();
//     selection.addRange(range);
//   }

//   updateEditorCallback(activeId, {
//     content: loaded.html,
//     font: loaded.font,
//     fontSize: loaded.fontSize,
//     color: loaded.color
//   });

// //   setFileMap(prev => ({ ...prev, [activeId]: name }));
// //   setFileName(name);
// };
import { saveFile, loadFile, getAllFiles } from './StorageUtils';
import { hideConfirm, showConfirm } from './ConfirmService';

/**
 * שומר קובץ עורך לפי שם, כולל innerHTML
 */
export const saveEditorToStorage = (name, activeId, editorData) => {
  const box = document.querySelector(`.editable-box[data-id="editor-${activeId}"]`);
  if (!box) return;

  const htmlContent = box.innerHTML;

  saveFile(name, {
    content: htmlContent,
    font: editorData.font,
    fontSize: editorData.fontSize,
    color: editorData.color
  });
};

/**
 * טוען קובץ ל־DOM ולעורך
 */
export const loadEditorFromStorage = (name, activeId, updateEditorCallback) => {
  const loaded = loadFile(name);
  if (!loaded) return;

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

  updateEditorCallback(activeId, {
    content: loaded.html,
    font: loaded.font,
    fontSize: loaded.fontSize,
    color: loaded.color
  });
};

/**
 * בודק אם העורך השתנה ביחס למה שיש ב־LocalStorage
 */
export const hasEditorChanged = (editor, savedName) => {
  const savedFile = loadFile(savedName);
  if (!savedFile) return true;

  return (
    editor.content !== savedFile.content ||
    editor.font !== savedFile.font ||
    editor.fontSize !== savedFile.fontSize ||
    editor.color !== savedFile.color
  );
};

/**
 * תהליך הסרה של עורך עם בדיקה – האם לשמור לפני מחיקה?
 */
export const handleEditorRemoval = ({
  editor,
  editorId,
  fileMap,
  onDeleteConfirmed,
  setConfirmData,
  setFileMap,
  setFileList,
  setFileName
}) => {
  const savedName = fileMap[editorId];

  if (savedName) {
    const changed = hasEditorChanged(editor, savedName);

    if (changed) {
      setConfirmData({
        isOpen: true,
        message: 'יש שינויים שלא נשמרו. האם לשמור לפני מחיקה?',
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
      message: 'האם לשמור את הקובץ לפני המחיקה?',
      onConfirm: () => {
        const name = prompt('הזן שם לקובץ:');
        if (name && name.trim()) {
          saveFile(name.trim(), editor);
          setFileMap(prev => ({ ...prev, [editorId]: name.trim() }));
          setFileList(Object.keys(getAllFiles()));
          setFileName(name.trim());
        }
        hideConfirm();
      },
      onCancel: () => {
        hideConfirm();
        onDeleteConfirmed();
      }
    });
    return;
  }

  // אם לא שונה – פשוט מוחקים
  onDeleteConfirmed();
};
