# Руководство по унификации компонентов

## Навигация по документации

- Этот документ описывает **единые правила** компонентов и каркасов.
- Процесс создания новых макетов и чек‑лист — `docs/new-mockup-guide.md`.
- Визуальные примеры компонентов — `ui-kit.html`.
- Шаблон требований для новых функций/интеграций (опционально) — `../Templates/bitrix/requirements-template.md`.

## Общие классы для всех страниц

### 1. Header (Верхнее меню)

*Шаблон полностью описан в `ui-kit.html` (раздел «каркасы страниц»). Используйте существующую разметку, меняя только навигационные ссылки.*

```html
<header class="header layout__header">
  <div class="container">
    <div class="header__container">
      <a href="./index.html" class="header__logo">
        <img src="./assets/img/logo-Inn.svg" alt="Инноватика Мособлгаз" class="header__logo-img">
      </a>

      <nav class="header__nav">
        <ul class="nav__list">
          <li><a href="#" class="nav__link">МЕДИАЦЕНТР</a></li>
          <li><a href="./requests.html" class="nav__link">БАНК ИННОВАЦИЙ</a></li>
          <li><a href="./events.html" class="nav__link">КАЛЕНДАРЬ МЕРОПРИЯТИЙ</a></li>
          <li><a href="#" class="nav__link">КОНКУРС</a></li>
          <li><a href="#" class="nav__link">ОБУЧЕНИЕ</a></li>
        </ul>
      </nav>

      <div class="header__actions">
        <a href="./login.html" class="btn btn--ghost header__user-btn">
          <svg class="header__user-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="header__user-text">ВОЙТИ</span>
        </a>

        <a href="./participant-profile.html" class="btn btn--ghost header__user-btn header__user-btn--logged">
          <span class="header__user-initials">ОЧ</span>
          <svg class="header__user-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
- `.header__logo-img` - изображение логотипа (ширина задаётся через `--logo-width-header`, высота `auto`)
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

#### Мобильное меню

На всех страницах с публичным хедером используется единая разметка мобильного меню. Добавляем кнопку‑бургер сразу после блока `<nav>` и блок меню сразу после `</header>`.

```html
<button class="header__burger" type="button" aria-label="Открыть меню" data-mobile-menu-toggle>
  <span></span>
  <span></span>
  <span></span>
</button>
```

```html
<div class="mobile-menu" data-mobile-menu>
  <div class="mobile-menu__backdrop" data-mobile-menu-close></div>
  <div class="mobile-menu__panel">
    <button class="mobile-menu__close" type="button" aria-label="Закрыть меню" data-mobile-menu-close>
      <span></span>
      <span></span>
    </button>
    <nav class="mobile-menu__nav">
      <a href="#" class="mobile-menu__link">МЕДИАЦЕНТР</a>
      <a href="./requests.html" class="mobile-menu__link">БАНК ИННОВАЦИЙ</a>
      <a href="./events.html" class="mobile-menu__link">КАЛЕНДАРЬ МЕРОПРИЯТИЙ</a>
      <a href="#" class="mobile-menu__link">КОНКУРС</a>
      <a href="#" class="mobile-menu__link">ОБУЧЕНИЕ</a>
    </nav>
    <div class="mobile-menu__actions">
      <a href="./login.html" class="btn btn--primary btn--block" data-mobile-menu-action>Войти</a>
    </div>
  </div>
</div>
```

- Кнопка содержит `data-mobile-menu-toggle`.
- Блок меню содержит `data-mobile-menu`, backdrop с `data-mobile-menu-close` и крестик‑кнопку с тем же атрибутом.
- Кнопка действия имеет `data-mobile-menu-action`, чтобы скрипт мог заменить текст на «Профиль» на кабинетных страницах.
- JS‑функция `initMobileMenu()` уже подключена в `assets/js/app.js` и автоматически вешает обработчики.

---

### 2. Sidebar (Боковая панель кабинета)

*Схема боковой панели находится в `ui-kit.html` (раздел «Личный кабинет»). Применяйте каркас `sidebar-layout` + `sidebar` + `content-card`.*

```html
<aside class="sidebar sidebar-layout__sidebar">
  <nav class="sidebar__nav">
    <a href="./participant-profile.html" class="sidebar__link">
      <svg class="sidebar__icon" width="24" height="24">...</svg>
      <span class="sidebar__text">Профиль</span>
    </a>
    
    <a href="./participant-ideas.html" class="sidebar__link">
      <svg class="sidebar__icon" width="24" height="24">...</svg>
      <span class="sidebar__text">Мои идеи</span>
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

*Смотрите раздел «Кнопки» в `ui-kit.html` — там показаны все размеры и состояния (включая «Кнопки авторизации»).*

- `.btn--primary` — основной CTA. Всегда с фирменным градиентом (`Button Gradient` / `Button Gradient 2`), чтобы отличаться от фильтров и вспомогательных действий.
- `.btn--secondary`, `.btn--outline`, `.btn--ghost` — вспомогательные варианты.
- `.btn--reset`, `.filter-reset` — кнопка сброса фильтров (иконка слева, текст справа).
- `.filter-pill` / `.filter-pill--active` — пилл-фильтры, всегда плоские.
- `.btn--primary btn--lg`, `.btn--gradient-secondary btn--lg` — примеры больших CTA (см. «Large Button» и «Large Button Gradient 2» в UI Kit).
- `.header__user-btn` / `.header__user-btn--logged` — кнопки авторизации (приведены в том же блоке «Кнопки» сразу под спец-вариантами).

---

### 4. Footer (унифицированный)

*Шаблон и визуал описаны в `ui-kit.html` → «Верхнее меню и футер». Используем только логотип `logo-Inn.svg` + ссылочные колонки.*

```html
<footer class="footer">
  <div class="container">
    <div class="footer__content">
      <div class="footer__column footer__column--brand">
        <div class="footer__brand">
          <img src="./assets/img/logo-Inn.svg" alt="Инноватика Мособлгаз" class="footer__logo">
        </div>
        <p class="footer__description text-muted">
          Инновационные решения для развития компании и поддержки талантов.
        </p>
      </div>
      <div class="footer__column">
        <h4 class="footer__title heading-subtitle">Платформа</h4>
        <ul class="footer__list">
          <li><a href="./requests.html" class="footer__link">Банк инноваций</a></li>
          <li><a href="./events.html" class="footer__link">Календарь мероприятий</a></li>
          <li><a href="#" class="footer__link">Конкурсы</a></li>
        </ul>
      </div>
      <div class="footer__column">
        <h4 class="footer__title heading-subtitle">Связаться</h4>
        <ul class="footer__list">
          <li><a href="./contacts.html" class="footer__link">Контакты</a></li>
          <li><a href="./support-form.html" class="footer__link">Поддержка</a></li>
        </ul>
      </div>
    </div>
  </div>
</footer>
```

**Важно:** текстового логотипа рядом быть не должно. Размеры управляются переменной `--logo-width-footer`, высота всегда `auto`, нижний отступ минимальный (см. `components.css`).

---

### 5. Градиентный фон кабинета

**Применение:**
Все страницы личного кабинета должны иметь класс `body--gradient` на элементе `<body>`:

```html
<body class="body--gradient">
  <!-- Контент -->
</body>
```

**Страницы с градиентом:**
- Все внутренние экраны (ЛК участника/стейкхолдера) и страницы авторизации используют `body--gradient`.
- Для контента поверх градиента используйте `main--with-gradient`.

**CSS:**
```css
.body--gradient {
  background: var(--gradient-bg); /* linear-gradient(135deg, #00A8CC 0%, #8B5CF6 100%) */
  min-height: 100vh;
}
```

---

### 6. Адаптивные блоки авторизации

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

### 7. Отступы и вертикальный ритм

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

### 8. Каркасы «Личный кабинет» и «Детальные страницы»

В `Layouts/Mockups/ui-kit.html` присутствуют отдельные демонстрации этих каркасов:

- **Личный кабинет** — `sidebar-layout` + `.sidebar` + `.content-card`. Порядок блоков фиксированный: вкладки → заголовок → поиск → фильтры → карточки. Используйте классы `.ui-kit-flow-step` как подсказку по последовательности.
- **Детальные страницы (`request-detail`, `idea-detail`)** — `detail-layout` с основной колонкой и `.detail-sidebar`. В основной колонке идут хлебные крошки → герой-блок (`.idea-header`) → карточки контента → таблица оценок → блок комментария. В сайдбаре — статус, действия и карточки документов.

Перед версткой новых экранов сверяйтесь с этими двумя примерами: они показывают актуальные отступы, последовательность и используемые компоненты.

---

### 9. Компоненты статистики

- **Сетка статистики**: `.stat-cards` + `.stat-card` (карточки‑счётчики).
  - Значение: `.stat-card__value`, подпись: `.stat-card__text`.
  - Цветовые модификаторы: `.stat-card--primary / --accent / --warning / --success / --deadline`.
  - Компактное значение: `.stat-card__value--compact`.
- **Еженедельный блок**: `.weekly-stats` + `.weekly-stat`.
  - Значение: `.weekly-stat__value`, подпись: `.weekly-stat__text`.
  - Цвета: `.weekly-stat--primary / --secondary / --success / --warning`.
  - Подпись периода: `.weekly-stats__note` (с линиями слева/справа).
- Все стили уже в `components.css`; дополнительные переопределения — только в page‑CSS при необходимости.

---

## Справочник страниц

- Актуальный список макетов и назначений страниц смотрите в `Layouts/Mockups/README.md`.
- Типы страниц и их каркасы:
  - **Публичные**: обычный `layout`, без сайдбара.
  - **Авторизация**: `auth-main` → `auth-container` → `auth-card`.
  - **Личный кабинет**: `body--gradient` + `main--with-gradient`, каркас `sidebar-layout`.
  - **Детальные**: `detail-layout` + `detail-sidebar`.
- Нейминг кабинетов: `participant-*` (участник) и `stakeholder-*` (стейкхолдер).

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
- [ ] Все внутренние экраны ЛК используют `body--gradient`.
- [ ] Для внутренних экранов задан `main--with-gradient`.

### Auth Pages
- [ ] Все страницы авторизации используют `.auth-main`
- [ ] Контейнеры используют `.auth-container`
- [ ] Карточки используют `.auth-card`
- [ ] Блоки адаптивны к ширине экрана

---

## Верстка заголовков и текстов

Используем комбинации тегов и утилитарных классов из UI Kit.

### Заголовки

- Hero/промо (лендинги): `H1.heading-display`.
- Основной заголовок страниц (кабинет, детали): `H1.heading-page`.
- Заголовок секций: `H2.heading-section`.
- Подразделы внутри секций: `H3.heading-subsection`.
- Заголовки карточек/малых блоков: `H4.heading-subtitle` или `H3.heading-subtitle` по иерархии.

### Абзацы и подписи

- Вводный текст/лид: `p.text-lead` сразу под заголовком.
- Основной текст: обычный `p` без утилит или с `.text-body`.
- Подписи/значения: `p.text-strong`, `p.text-meta`.
- Метки, названия колонок, роли: `p.text-caption` (часто с `text-muted`).

### Примеры

- Детальная страница: `H1.heading-page.detail-heading-row` + `span.badge`, далее `p.text-lead`.
- Карточка команды: `H3.heading-section` → `p.text-caption`, `p.text-strong`.
- Таблицы/списки: заголовок таблицы `H4.heading-subtitle`, строки используют `text-meta`.

### Таблицы и сортировка

- Используем базовый класс `table` с модификаторами `table--compact` (уменьшенные отступы) и `table--sortable` (подсветка при наведении и клике, стрелка направления).
- Для сортируемых колонок ставим `data-sort-type` (`string` / `number` / `date`). Для дат и чисел внутри ячеек задаём `data-sort-value` (ISO-дата или число) на элементе с текстом.
- Несортируемые колонки (действия и т.п.) помечаем `data-sortable="false"` на `th`, чтобы клик/стрелка не появлялись.
- Оборачиваем таблицу в `.table-wrapper`, чтобы на узких экранах появился горизонтальный скролл без расползания контейнера.
- Если нужно центрировать заголовки, используем `table--centered-headers`.
- Для двухстрочных ячеек применяем `.task-title` (строка 1) и `.task-meta` (строка 2).
- Логика — в `assets/js/app.js` (`initSortableTables`, вызывается на DOMContentLoaded), стили — в `assets/css/components.css` (`.table--sortable`).
- Визуальный пример и разметка — раздел «Таблицы» в `ui-kit.html`.

Соблюдайте иерархию: не пропускайте уровни `H1 → H2 → H3`, не используйте `div` для текста. Новые паттерны обязательно демонстрируйте в `ui-kit.html` (раздел «Типографика» или «Общие требования»).
