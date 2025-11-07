/**
 * REQUESTS.JS - Страница списка запросов
 */

document.addEventListener('DOMContentLoaded', () => {
  prefillSearchFromQuery();
});

function prefillSearchFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');
  if (!query) return;

  const searchInput = document.querySelector('.search__input');
  if (searchInput) {
    searchInput.value = query;
    searchInput.dispatchEvent(new Event('input'));
  }
}
