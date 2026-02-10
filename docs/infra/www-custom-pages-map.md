# Кастомные страницы: мокапы → фактические реализации (каталог `www`)

Исходные мокапы (`Layouts/Mockups/README.md`, `index.html`):
- Публичные: `landing.html`, `requests.html`, `request-detail.html`, `idea-detail.html`.
- Формы/авторизация: `login.html`, `register-form.html`, `request-form.html`, `join-team-form.html`, `idea-form.html`, `privacy-policy.html`.
- Кабинеты/прочее: `participant-*`, `stakeholder-*`, `participant-ideas/teams/notifications`, `team-requests.html`, `stake-holder-dashboard.html`, `ui-kit.html` и навигационная `index.html`.

## Обнаруженные реализации в бэкапе `www`

### Сайт `innovatika-mosoblgaz.ru` (витрина/ЛК)
Корень содержит кастомные PHP-страницы, по именам и назначению перекрывающие ключевые мокапы:
- `index.php` — главная/лендинг (аналог `landing.html`).
- `auth.php`, `register.php` — авторизация/регистрация (аналог `login.html`, `register-form.html`).
- `form.php` — форма подачи запроса (аналог `request-form.html`).
- `join-team-form.php` — заявка в команду (аналог `join-team-form.html`).
- `idea_detail.php` — детальная идея/оценка (аналог `idea-detail.html`).
- `detail.php` — деталь запроса/карточка (аналог `request-detail.html`).
- `privacy-policy.php` — политика конфиденциальности (аналог `privacy-policy.html`).
- Разделы-каталоги: `ideas/`, `innovations/`, `projects/`, `mediacenter/`.
- Личный кабинет: `lk/` с подпапками `ajax/`, `applications/`, `idea/`, `includes/`, `logs/`, `stakeholder/`, `cron/` — кастомный ЛК вместо мокапов `participant-*`/`stakeholder-*`.
- Общие include/стили: `include/`, `style.css`, лог `join_team.log`.
- `.htaccess` — вырезает авторизацию Bitrix24 на `/bitrix|/upload|/local` и переписывает несуществующие пути на `/index.php`.

### Сайт `crm.innovatika-mosoblgaz.ru` (Bitrix24/CRM)
Полноценный Bitrix24 с ядром:
- `bitrix/` — ядро Bitrix24; `local/` — проектные доработки (шаблоны/модули).
- Типовые разделы Bitrix24: `crm/`, `tasks/`, `telephony/`, `mobile/`, `bizproc/`, `rpa/`, `services/`, `marketplace/`, `apconnect/`, `biconnector/`, `bi/`, `sign/`, `conference/`, `kb/`, `spaces/` и др.
- Корневые файлы: `index.php`, `index.html`, `index_old.php`, `urlrewrite.php`, `robots.txt`, `404.php`, `500.html`, `storage.php`, `webhook-handler.php`, `auth.php`, `blank.php`, `desktop.php`, `ustat.php`, меню `.top.*.php`, `.bottom.menu.php`, `.section.php`, `.access.php`.
- Временные/кеш каталоги (`bitrix/cache`, `managed_cache`, `stack_cache`, `tmp`, `upload/tmp`, `upload/resize_cache`, `local/tmp`) очищены после распаковки.
- `.htaccess` — типовой Bitrix rewrite на `/bitrix/urlrewrite.php`, кеш статики, отключение `session.use_trans_sid`.

## Итоги
- Все ключевые мокапы фронта присутствуют как PHP-страницы в `innovatika-mosoblgaz.ru`; ЛК реализован в каталоге `lk/` вместо набора отдельных HTML-мокапов.
- CRM-инстанс — стандартный Bitrix24 с кастомными доработками в `local/`; соответствий мокапам фронта нет (другая область — внутренняя CRM).
- Для .gitignore нового репозитория: исключать кеш/временные каталоги Bitrix (`bitrix/cache`, `managed_cache`, `stack_cache`, `tmp`, `local/tmp`, `upload/tmp`, `upload/resize_cache`) и сам каталог `www/`, если архив распакован локально для анализа.

## Несоответствия и доработки по кастомным страницам
- Покрытие мокапов функционалом:
  - Есть: лендинг (`index.php`), форма запроса (`form.php`), заявка в команду (`join-team-form.php`), детальная идея (`idea_detail.php`), политика (`privacy-policy.php`), деталка запроса (`detail.php`), разделы `innovations/` (список идей из CRM) и `ideas/detail.php`.
  - Нет явных реализаций: отдельный список `requests` из мокапов, `idea-form` (подача идеи), `team-requests`, `stake-holder-dashboard`, UI Kit/навигация внутри сайта, странички `participant-*`/`stakeholder-*` из мокапов (ЛК реализован иначе через `lk/`).
- Личный кабинет (`lk/`) — собственный набор страниц (`applications`, `idea`, `stakeholder/*.php`, `notifications`, `profile` и т.д.), не совпадает со структурой мокапов `participant-*`/`stakeholder-*`; требуется сверка экранов/контента с макетами и выравнивание маршрутов/шаблонов.
- Бэкап не содержит шаблона и статики: все страницы тянут CSS/JS из `/local/templates/in_studio_landing/assets/...` (`base.css`, `layout.css`, `components.css`, page CSS, `vendor.js`, `app.js`), но каталога `local/templates` и файлов `assets` в дампе нет. Без подключения реального шаблона/статических файлов страницы будут без стилей/скриптов — нужно добавить шаблон или поправить пути на доступные ассеты.
- Бэкап также не содержит ядро `/bitrix`/`/local` для витрины, хотя страницы требуют `require('/bitrix/header.php')` и обращаются к CRM (`innovations/index.php` использует `\Bitrix\Crm\Service\Container`). Для поднятия локально нужны симлинки/копия ядра и модулей, иначе функционал не работает.
- Рекомендуется добавить внутренний UI Kit/страницу навигации (аналог `Layouts/Mockups/index.html`) и проверить наличие CSS/JS на каждом роуте при развернутом шаблоне.

### Сверка личного кабинета (факт vs мокапы)
- Факт (участник): в `lk/` есть `index.php` (мои идеи), `applications.php`/`application_detail.php` (заявки в команду), `notifications.php` (уведомления), `profile.php` (профиль), `idea/add.php` и `idea/edit.php` (работа с идеями), `login.php`/`register.php`/`logout.php` (аутентификация), AJAX (`ajax/mark-read*.php`), крон (`cron/check-notifications.php`), общие `header.php`/`footer.php`, инклюды `includes/db.php`, `bitrix_api.php`. Это частично покрывает мокапы `participant-profile`, `participant-ideas`, `participant-notifications`, но подача идеи/форма участия и маршруты не совпадают с макетами (нет отдельных страниц `participant-idea-edit.html`, `participant-team-detail.html`, `participant-team.html` в явном виде).
- Факт (стейкхолдер): в `lk/stakeholder/` есть `index.php` (мои запросы), `portfolio.php` (портфель идей), `notifications.php`, `profile.php`, карточки `request.php`/`request-detail.php`, `idea.php`/`idea-edit.php`, `create-request.php`/`edit-request.php`, `admin-board.php` (панель), вспомогательные `mark-notification-read.php`, `stakeholder-show-all.php`, шапка/футер. Это покрывает часть мокапов `stakeholder-requests`, `stakeholder-portfolio`, `stakeholder-notifications`, `stakeholder-profile`, `stakeholder-tools` (admin-board), но нет явных страниц под `stakeholder-request-edit.html`/`stakeholder-request` в макетной структуре — маршруты и наполнение нужно сверить по контенту/блокам.
- Стили/скрипты ЛК подключают те же недостающие ассеты `/local/templates/in_studio_landing/assets/...` (`base.css`, `layout.css`, `components.css`, `pages/profile.css`, `pages/participant-cabinet.css` и т.п., vendor/app.js). Пока их нет в дампе, ни участник, ни стейкхолдер ЛК не соответствуют макетам визуально и функционально (нет JS).

### Отсутствующие ассеты `/local/templates/in_studio_landing/assets/...`
По ссылкам в страницах витрины/ЛК ожидаются, но отсутствуют в дампе:
- CSS базовые: `css/base.css`, `css/layout.css`, `css/components.css`.
- CSS страничные: `css/pages/landing.css`, `css/pages/request-form.css`, `css/pages/auth.css`, `css/pages/profile.css`, `css/pages/participant-cabinet.css`, `css/pages/request-detail.css` (стейкхолдер). Возможны и другие page-стили, если есть в шаблоне.
- JS: `js/vendor.js`, `js/app.js`, `js/forms.js` (форма идеи), `js/auth.js` (login/register).
- Картинки: логотип `assets/img/logo-Inn.svg`, placeholder `assets/img/user-default.svg`, иллюстрации баннеров `assets/img/land-01.png`, `assets/img/2002-*.webp` и др.
Все эти файлы нужно подтянуть из реального шаблона `/local/templates/in_studio_landing` или перенастроить пути на доступные ассеты; без них страницы рендерятся без стилей/JS/картинок.

### Таблица соответствий мокапов и реализации

| Макет (Layouts/Mockups) | Реализация в `www` | Недостающие стили/скрипты | Комментарий (сверка) |
|---|---|---|---|
| landing.html | `innovatika-mosoblgaz.ru/index.php` | base/layout/components.css; `pages/landing.css`; `js/app.js`; баннеры `assets/img/2002-*.webp`, `land-01.png`, logo | Блоки хиро/статистика/преимущества/CTA соответствуют; внешний вид не проверить без ассетов |
| requests.html (список) | `innovations/index.php` (список идей из CRM) | Базовые CSS/JS | Функционал списка есть (пагинация, фильтры по статусу/категории, поиск). Сверить UI/фильтры/карточки с макетом |
| request-detail.html | `detail.php` | Базовые CSS/JS | Детальная карточка есть; сверить структуру блоков (описание, команда, CTA) и верстку с макетом |
| idea-detail.html | `idea_detail.php` | Базовые CSS/JS | Страница оценки идеи есть; сверить наличие рейтинга, комментариев, боковой панели |
| login.html | `auth.php`, `lk/login.php` | base/layout/components.css; `pages/auth.css`; `js/vendor.js`, `js/app.js`, `js/auth.js` | Форма входа/регистрации присутствует; сверить табы/валидацию/сообщения об ошибках |
| register-form.html | `register.php`, `lk/register.php` | base/layout/components.css; `pages/auth.css`; `js/vendor.js`, `js/app.js`, `js/auth.js` | Есть этапы регистрации; сверить шаги, обязательные поля, подсказки |
| request-form.html | `form.php` | base/layout/components.css; `pages/request-form.css`; `js/vendor.js`, `js/app.js` | Многошаговая форма подачи запроса реализована; проверить drag&drop загрузку, прогресс, валидацию шагов |
| join-team-form.html | `join-team-form.php` | base/layout/components.css; `pages/request-form.css` | Заявка в команду есть; сверить выбор ролей, уровни компетенций, загрузку портфолио |
| idea-form.html | — | — | Нет реализации подачи идеи (кроме `lk/idea/add.php`) |
| privacy-policy.html | `privacy-policy.php` | Базовые CSS/JS | Статическая политика; сверить содержание текста с макетом |
| participant-profile.html | `lk/profile.php` | base/layout/components.css; `pages/profile.css`, `pages/participant-cabinet.css`; `js/vendor.js`, `js/app.js` | Профиль участника: проверить соответствие полей, аватар, смену пароля/уведомлений |
| participant-ideas.html | `lk/index.php` | base/layout/components.css; `pages/participant-cabinet.css`; `js/vendor.js`, `js/app.js` | Список идей: есть фильтры/статусы? сверить с макетными бейджами/счётчиками |
| participant-idea-edit.html | `lk/idea/edit.php` | base/layout/components.css; `pages/request-form.css`; `js/vendor.js`, `js/app.js`, `js/forms.js` | Редактирование идеи: сверить структуру формы, подсказки, валидаторы |
| participant-team.html | `lk/applications.php` | base/layout/components.css; `pages/participant-cabinet.css`; `js/vendor.js`, `js/app.js` | Заявки в команду: проверить табы входящие/отправленные, статусы, действия |
| participant-team-detail.html | `lk/application_detail.php` | Базовые CSS/JS | Карточка заявки: сверить данные, историю, доступные действия |
| participant-notifications.html | `lk/notifications.php` | base/layout/components.css; `pages/participant-cabinet.css`; `js/vendor.js`, `js/app.js` | Уведомления: сверить фильтры, бейджи +N, формат карточек |
| team-requests.html | — | — | Нет реализации |
| stake-holder-dashboard.html | — | — | Нет реализации |
| stakeholder-requests.html | `lk/stakeholder/index.php` | base/layout/components.css; `pages/participant-cabinet.css`; `js/vendor.js`, `js/app.js` | Таблица запросов стейкхолдера: сверить колонки, статусы, дедлайны, действия |
| stakeholder-request-edit.html | `lk/stakeholder/edit-request.php` | base/layout/components.css; `pages/request-form.css`; `js/vendor.js`, `js/app.js` | Редактирование запроса: сверить поля/прикрепы/валидацию |
| stakeholder-portfolio.html | `lk/stakeholder/portfolio.php` | base/layout/components.css; `pages/participant-cabinet.css`; `js/vendor.js`, `js/app.js` | Портфель идей: сверить метрики, статусы, фильтры |
| stakeholder-notifications.html | `lk/stakeholder/notifications.php` | base/layout/components.css; `pages/participant-cabinet.css`; `js/vendor.js`, `js/app.js` | Уведомления: сверить фильтры/бейджи/состояния прочитано |
| stakeholder-profile.html | `lk/stakeholder/profile.php` | base/layout/components.css; `pages/profile.css`; `js/vendor.js`, `js/app.js` | Профиль: проверить поля, настройки уведомлений/ролей |
| stakeholder-tools.html | `lk/stakeholder/admin-board.php` | base/layout/components.css; `pages/participant-cabinet.css`; `js/vendor.js`, `js/app.js` | Админ‑панель: сверить виджеты, таблицы задач/статусов |
| stakeholder-request.html | `lk/stakeholder/request.php` / `request-detail.php` | base/layout/components.css; `pages/request-detail.css`; `js/vendor.js`, `js/app.js` | Карточка запроса: сверить блоки (стадии, команда, действия) |
| UI Kit / index навигация | — | — | Нет страницы ui-kit или навигации как в макетах |
