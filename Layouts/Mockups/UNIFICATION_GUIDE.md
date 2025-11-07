# Руководство по унификации компонентов

## Общие классы для всех страниц

### 1. Header (Верхнее меню)

**Структура:**
```html
<header class="header layout__header">
  <div class="container">
    <div class="header__container">
      <!-- Logo -->
      <a href="./index.html" class="header__logo">
        <img src="./assets/img/826-1724.svg" alt="Инноватика Мособлгаз" class="header__logo-img">
        <div class="header__logo-text">
          ИННОВАТИКА<br>
          <strong>МОСОБЛГАЗ</strong>
        </div>
      </a>

      <!-- Navigation -->
      <nav class="header__nav">
        <ul class="nav__list">
          <li><a href="#" class="nav__link">МЕДИАЦЕНТР</a></li>
          <li><a href="./requests.html" class="nav__link">БАНК ИННОВАЦИЙ</a></li>
          <li><a href="#" class="nav__link">КОНКУРС</a></li>
          <li><a href="#" class="nav__link">ОБУЧЕНИЕ</a></li>
        </ul>
      </nav>

      <!-- Actions -->
      <div class="header__actions">
        <!-- Для неавторизованных пользователей -->
        <a href="./login.html" class="btn btn--ghost header__user-btn">
          <svg class="header__user-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="header__user-text">ВОЙТИ</span>
        </a>

        <!-- Для авторизованных пользователей -->
        <a href="./profile.html" class="btn btn--ghost header__user-btn header__user-btn--logged">
          <span class="header__user-initials">ОЧ</span>
          <svg class="header__user-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</header>
```

**Общие классы:**
- `.header` - основной контейнер
- `.header__container` - внутренний контейнер с flexbox
- `.header__logo` - логотип (ссылка)
- `.header__logo-img` - изображение логотипа
- `.header__logo-text` - текст логотипа
- `.header__nav` - навигация
- `.nav__list` - список навигации
- `.nav__link` - ссылка навигации
- `.nav__link--active` - активная ссылка
- `.header__actions` - правая часть с действиями
- `.header__user-btn` - кнопка пользователя (общая)
- `.header__user-btn--logged` - модификатор для авторизованного пользователя
- `.header__user-initials` - инициалы пользователя
- `.header__user-icon` - иконка пользователя
- `.header__user-text` - текст "ВОЙТИ"

---

### 2. Sidebar (Боковая панель кабинета)

**Структура:**
```html
<aside class="sidebar sidebar-layout__sidebar">
  <nav class="sidebar__nav">
    <a href="./profile.html" class="sidebar__link">
      <svg class="sidebar__icon" width="24" height="24">...</svg>
      <span class="sidebar__text">Профиль</span>
    </a>
    
    <a href="./my-requests.html" class="sidebar__link">
      <svg class="sidebar__icon" width="24" height="24">...</svg>
      <span class="sidebar__text">Заявки</span>
      <span class="sidebar__badge">2</span>
    </a>
    
    <!-- Другие пункты меню -->
  </nav>
</aside>
```

**Общие классы:**
- `.sidebar` - основной контейнер боковой панели
- `.sidebar-layout__sidebar` - позиционирование в layout
- `.sidebar__nav` - навигация
- `.sidebar__link` - ссылка меню
- `.sidebar__link--active` - активная ссылка
- `.sidebar__icon` - иконка пункта меню
- `.sidebar__text` - текст пункта меню
- `.sidebar__badge` - бейдж с количеством

---

### 3. Buttons (Кнопки)

**Типы кнопок:**

```html
<!-- Основная кнопка -->
<button class="btn btn--primary">Подать заявку</button>

<!-- Вторичная кнопка -->
<button class="btn btn--secondary">Оценить идеи</button>

<!-- Outline кнопка -->
<button class="btn btn--outline">Добавить в архив</button>

<!-- Ghost кнопка -->
<button class="btn btn--ghost">Отмена</button>

<!-- Кнопка сброса фильтров -->
<button class="btn btn--reset filter-reset">
  <svg class="btn__icon">...</svg>
  <span class="btn__text">Сбросить фильтры</span>
</button>

<!-- Кнопка фильтра (pill) -->
<button class="filter-pill">Все</button>
<button class="filter-pill filter-pill--active">На рассмотрении</button>
```

**Общие классы:**
- `.btn` - базовый класс кнопки
- `.btn--primary` - основная кнопка (градиент)
- `.btn--secondary` - вторичная кнопка (обводка)
- `.btn--outline` - кнопка с обводкой
- `.btn--ghost` - прозрачная кнопка
- `.btn--reset` - кнопка сброса
- `.btn__icon` - иконка в кнопке
- `.btn__text` - текст в кнопке
- `.filter-pill` - кнопка-фильтр
- `.filter-pill--active` - активный фильтр
- `.filter-reset` - специфичный класс для кнопки сброса фильтров

---

### 4. Градиентный фон кабинета

**Применение:**
Все страницы личного кабинета должны иметь класс `body--gradient` на элементе `<body>`:

```html
<body class="body--gradient">
  <!-- Контент -->
</body>
```

**Страницы с градиентом:**
- `profile.html`
- `my-requests.html`
- `my-applications.html`

**CSS:**
```css
.body--gradient {
  background: linear-gradient(135deg, #00A8CC 0%, #8B5CF6 100%);
  min-height: 100vh;
}
```

---

### 5. Адаптивные блоки авторизации

**Структура:**
```html
<main class="auth-main">
  <div class="auth-container">
    <div class="auth-card">
      <!-- Контент формы -->
    </div>
  </div>
</main>
```

**Общие классы:**
- `.auth-main` - основной контейнер страницы авторизации
- `.auth-container` - адаптивный контейнер
- `.auth-card` - карточка с формой
- `.auth-card__header` - заголовок карточки
- `.auth-card__body` - тело карточки
- `.auth-card__footer` - подвал карточки

**CSS для адаптивности:**
```css
.auth-container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

@media (max-width: 768px) {
  .auth-container {
    max-width: 100%;
    padding: var(--spacing-md);
  }
}
```

---

### 6. Отступы и вертикальный ритм

Чтобы страницы выглядели цельно, основные блоки используют единые классы для отступов:

```html
<a href="./requests.html" class="back-link">← Назад</a>

<div class="search">
  <svg class="search__icon" ...></svg>
  <input type="text" class="form-input search__input" placeholder="Поиск">
</div>

<div class="filters filters-section">
  <button class="filter-pill filter-pill--active">Все</button>
  <button class="btn btn--reset filter-reset">Сбросить фильтры</button>
</div>

<section class="section">
  <div class="card">...</div>
</section>

<section class="section">
  <div class="card">...</div>
</section>
```

**Правила отступов:**
- `.back-link` всегда оставляет `var(--spacing-lg)` до контента.
- `.search` → `var(--spacing-lg)`; `.filters` и `.filters-section` → `var(--spacing-xl)` — между фильтрами и карточками.
- Соседние `.section` получают автоматический разрыв `var(--spacing-2xl)`.
- Внутри карточек (`.card`) используются стандартные паддинги (`var(--spacing-xl)`), а заголовки/подзаголовки имеют сокращённые `var(--spacing-md/sm)`.

Используя эти классы, любые новые страницы автоматически наследуют единую сетку вертикальных отступов без локальных значений `margin-bottom`.

---

## Страницы и их классы

### Публичные страницы
- `requests.html` - `.header__user-btn` с текстом "ВОЙТИ"
- `request-form.html` - `.header__user-btn` с текстом "ВОЙТИ"
- `request-detail.html` - `.header__user-btn` с текстом "ВОЙТИ"
- `idea-detail.html` - `.header__user-btn` с текстом "ВОЙТИ"

### Страницы авторизации
- `login.html` - `.auth-main`, `.auth-container`, `.auth-card`
- `register-step1.html` - `.auth-main`, `.auth-container`, `.auth-card`
- `register-step2.html` - `.auth-main`, `.auth-container`, `.auth-card`

### Страницы кабинета
- `profile.html` - `body--gradient`, `.sidebar`, `.header__user-btn--logged`
- `my-requests.html` - `body--gradient`, `.sidebar`, `.header__user-btn--logged`
- `my-applications.html` - `body--gradient`, `.sidebar`, `.header__user-btn--logged`

---

## Чек-лист унификации

### Header
- [ ] Все страницы используют `.header` и `.header__container`
- [ ] Логотип имеет класс `.header__logo` и ведет на `index.html`
- [ ] Навигация использует `.header__nav` и `.nav__list`
- [ ] Кнопка пользователя имеет класс `.header__user-btn`
- [ ] Авторизованные страницы используют `.header__user-btn--logged`

### Sidebar
- [ ] Все страницы кабинета используют `.sidebar` и `.sidebar-layout__sidebar`
- [ ] Ссылки меню используют `.sidebar__link`
- [ ] Активная ссылка имеет класс `.sidebar__link--active`
- [ ] Бейджи используют класс `.sidebar__badge`

### Buttons
- [ ] Все кнопки используют базовый класс `.btn`
- [ ] Модификаторы применены правильно (--primary, --secondary, --outline, --ghost)
- [ ] Кнопка сброса фильтров имеет класс `.filter-reset`
- [ ] Фильтры используют `.filter-pill` и `.filter-pill--active`

### Gradient Background
- [ ] `profile.html` имеет `body--gradient`
- [ ] `my-requests.html` имеет `body--gradient`
- [ ] `my-applications.html` имеет `body--gradient`

### Auth Pages
- [ ] Все страницы авторизации используют `.auth-main`
- [ ] Контейнеры используют `.auth-container`
- [ ] Карточки используют `.auth-card`
- [ ] Блоки адаптивны к ширине экрана

---

## UI Kit

Создана отдельная страница `ui-kit.html` с демонстрацией всех компонентов:

- Типографика
- Цвета
- Кнопки (все варианты)
- Формы (input, textarea, select, checkbox, radio)
- Бейджи
- Карточки
- Модальные окна
- Табы
- Фильтры
- Иконки
- Sidebar
- Header

Страница доступна по адресу: `/ui-kit.html`
