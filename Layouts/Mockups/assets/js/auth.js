/**
 * AUTH.JS - Скрипты для страниц авторизации/регистрации
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.App) return;
  App.initAuth && App.initAuth();
});
