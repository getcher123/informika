# Чеклист: динамический рендер календаря событий (prod‑вариант)

Цель: создать отдельный макет страницы с единым источником данных (список `<li>`), из которого JS строит календарь и ленты.

## Шаги и статус

- [x] 1. Ознакомиться с гайдами (`new-mockup-guide.md`, `UNIFICATION_GUIDE.md`, `ui-kit.html`).
- [ ] 2. Сделать рендер текущего макета `events.html` (320/768/1024/1440) — **блокер: отсутствует `node`/`playwright-core`**.
- [x] 3. Подготовить новый HTML‑файл (копия `events.html`) под динамический рендер.
- [x] 4. Создать страницу‑стили `events-dynamic.css`.
- [x] 5. Создать JS‑рендер `events-dynamic.js` (раскладка календаря/лент).
- [x] 6. Подключить новый HTML в `index.html`.
- [ ] 7. Сделать рендер нового макета и сравнить с текущим — **блокер: отсутствует `node`/`playwright-core`**.
- [x] 8. Провести анализ соответствия `UNIFICATION_GUIDE.md`.

## Примечания по выполнению

- Рендеры выполняются через `scripts/render-mockups.js`.
- Скриншоты сохраняются в `Layouts/Mockups/renders/<page>`.

## Анализ соответствия UNIFICATION_GUIDE

- Каркас страницы публичный: `header` + `mobile-menu` + `main layout__main` + `.container` — соблюдено.
- Компоненты: `tabs`, `filter-pills`, `search`, `card`, `calendar-grid` используются в тех же классах, что и в `events.html`.
- Структура блоков: `events-hero` → `search` → `tabs` → `filters` → `tabs-panels` сохранена.
- Стили: только в `events-dynamic.css`, базовые переменные и классы из `base.css`/`components.css`.
- JS вынесен в `assets/js/events-dynamic.js`, инициализация на `DOMContentLoaded`.
- Новые элементы: скрытый список `.events-data` и служебное сообщение `.events-empty` — локальные для страницы, не требуют переноса в UI‑kit.
