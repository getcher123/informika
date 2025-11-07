/**
 * APP.JS - Основная логика приложения
 */

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  initModals();
  initDropdowns();
  initForms();
  initTabs();
  initFilters();
  initFavorites();
});

/**
 * Модальные окна
 */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloses = document.querySelectorAll('[data-modal-close]');
  const modals = document.querySelectorAll('.modal');

  // Открытие модального окна
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const modal = document.getElementById(targetId);
      if (modal) {
        openModal(modal);
      }
    });
  });

  // Закрытие модального окна
  modalCloses.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const modal = closeBtn.closest('.modal');
      if (modal) {
        closeModal(modal);
      }
    });
  });

  // Закрытие по клику на backdrop
  modals.forEach(modal => {
    const backdrop = modal.querySelector('.modal__backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        closeModal(modal);
      });
    }
  });

  // Закрытие по ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal.is-open');
      if (openModal) {
        closeModal(openModal);
      }
    }
  });
}

function openModal(modal) {
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}

/**
 * Выпадающие списки
 */
function initDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown__toggle');
    const menu = dropdown.querySelector('.dropdown__menu');

    if (toggle && menu) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Закрыть другие открытые dropdown
        document.querySelectorAll('.dropdown.is-open').forEach(openDropdown => {
          if (openDropdown !== dropdown) {
            openDropdown.classList.remove('is-open');
          }
        });

        dropdown.classList.toggle('is-open');
      });
    }
  });

  // Закрытие при клике вне dropdown
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.is-open').forEach(dropdown => {
      dropdown.classList.remove('is-open');
    });
  });
}

/**
 * Формы
 */
function initForms() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (validateForm(form)) {
        // Имитация отправки формы
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Отправка...';
          
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить';
            alert('Форма успешно отправлена (имитация)');
            form.reset();
          }, 1500);
        }
      }
    });

    // Валидация в реальном времени
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        validateField(input);
      });

      input.addEventListener('input', () => {
        if (input.classList.contains('form-input--error')) {
          validateField(input);
        }
      });
    });
  });

  // Показ/скрытие пароля
  const passwordToggles = document.querySelectorAll('[data-password-toggle]');
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.previousElementSibling;
      if (input && input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🙈';
      } else if (input) {
        input.type = 'password';
        toggle.textContent = '👁';
      }
    });
  });
}

function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';

  // Проверка обязательности
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'Это поле обязательно для заполнения';
  }

  // Проверка email
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Введите корректный email';
    }
  }

  // Проверка телефона
  if (field.type === 'tel' && value) {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(value)) {
      isValid = false;
      errorMessage = 'Введите корректный номер телефона';
    }
  }

  // Проверка минимальной длины
  if (field.hasAttribute('minlength')) {
    const minLength = parseInt(field.getAttribute('minlength'));
    if (value.length < minLength) {
      isValid = false;
      errorMessage = `Минимум ${minLength} символов`;
    }
  }

  // Отображение ошибки
  if (!isValid) {
    field.classList.add('form-input--error');
    showFieldError(field, errorMessage);
  } else {
    field.classList.remove('form-input--error');
    hideFieldError(field);
  }

  return isValid;
}

function showFieldError(field, message) {
  let errorElement = field.parentElement.querySelector('.form-error');
  
  if (!errorElement) {
    errorElement = document.createElement('span');
    errorElement.className = 'form-error';
    field.parentElement.appendChild(errorElement);
  }
  
  errorElement.textContent = message;
}

function hideFieldError(field) {
  const errorElement = field.parentElement.querySelector('.form-error');
  if (errorElement) {
    errorElement.remove();
  }
}

/**
 * Табы
 */
function initTabs() {
  const tabContainers = document.querySelectorAll('[data-tabs]');

  tabContainers.forEach(container => {
    const tabs = container.querySelectorAll('.tabs__item');
    const panels = container.querySelectorAll('[data-tab-panel]');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-tab');

        // Деактивировать все табы
        tabs.forEach(t => t.classList.remove('tabs__item--active'));
        panels.forEach(p => p.style.display = 'none');

        // Активировать выбранный таб
        tab.classList.add('tabs__item--active');
        const targetPanel = container.querySelector(`[data-tab-panel="${targetId}"]`);
        if (targetPanel) {
          targetPanel.style.display = 'block';
        }
      });
    });
  });
}

/**
 * Фильтры
 */
function initFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const clearFiltersBtn = document.querySelector('[data-clear-filters]');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('filter-pill--active');
      // Здесь можно добавить логику фильтрации контента
      applyFilters();
    });
  });

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      filterPills.forEach(pill => {
        pill.classList.remove('filter-pill--active');
      });
      applyFilters();
    });
  }
}

function applyFilters() {
  // Имитация фильтрации
  const activeFilters = document.querySelectorAll('.filter-pill--active');
  console.log('Активные фильтры:', Array.from(activeFilters).map(f => f.textContent));
}

/**
 * Избранное
 */
function initFavorites() {
  const favoriteBtns = document.querySelectorAll('[data-favorite]');

  favoriteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const icon = btn.querySelector('svg') || btn;
      btn.classList.toggle('icon-btn--active');
      
      // Анимация
      icon.style.transform = 'scale(1.3)';
      setTimeout(() => {
        icon.style.transform = 'scale(1)';
      }, 200);
    });
  });
}

/**
 * Поиск
 */
function initSearch() {
  const searchInputs = document.querySelectorAll('.search__input');

  searchInputs.forEach(input => {
    let searchTimeout;

    input.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      
      searchTimeout = setTimeout(() => {
        const query = e.target.value.trim();
        if (query.length >= 2) {
          performSearch(query);
        }
      }, 300);
    });
  });
}

function performSearch(query) {
  console.log('Поиск:', query);
  // Здесь будет логика поиска
}

/**
 * Утилиты
 */

// Debounce функция
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Форматирование даты
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('ru-RU', options);
}

// Экспорт функций для использования в других модулях
window.App = {
  openModal,
  closeModal,
  validateForm,
  formatDate,
  debounce
};
