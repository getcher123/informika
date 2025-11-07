/**
 * FORMS.JS - Страница подачи запроса
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.App) return;
  initFileUploadLabel();
});

function initFileUploadLabel() {
  const fileInput = document.querySelector('.file-upload__input');
  const fileLabel = document.querySelector('.file-upload__label span');
  if (!fileInput || !fileLabel) return;

  fileInput.addEventListener('change', () => {
    if (!fileInput.files || fileInput.files.length === 0) {
      fileLabel.textContent = 'Выберите файлы или перетащите их сюда';
      return;
    }
    const names = Array.from(fileInput.files).map(file => file.name);
    fileLabel.textContent = names.join(', ');
  });
}
