# Структура каталога www (после разархивации бэкапа)

Две инсталляции в `www/`:
- `crm.innovatika-mosoblgaz.ru` — полноценный Bitrix24/CRM‑портал с ядром и пользовательскими доработками.
- `innovatika-mosoblgaz.ru` — витрина/кастомный сайт с PHP‑страницами и ЛК.

## crm.innovatika-mosoblgaz.ru (Bitrix24/CRM)
- `bitrix/` — ядро Bitrix, стандартные модули, служебные скрипты.
- `local/` — кастомные модули/шаблоны/компоненты (основные доработки проекта).
- `upload/` — загружаемые файлы, медиаконтент.
- `auth/`, `crm/`, `tasks/`, `telephony/`, `mobile/`, `bizproc/`, `rpa/`, `marketplace/`, `services/` и т.п. — типовые разделы/приложения Bitrix24.
- `index.php`, `index.html`, `urlrewrite.php`, `robots.txt`, `404.php`, `500.html` — точки входа и стандартные служебные страницы/правила.
- Меню/настройки: `.htaccess` (rewrite на `bitrix/urlrewrite.php`, кеш статики), `.top.menu*.php`, `.bottom.menu.php`, `.section.php`, `.access.php`.
- Временные/кеш‑каталоги Bitrix (cache/managed_cache/stack_cache/tmp, upload/tmp, upload/resize_cache) были очищены после распаковки.

## innovatika-mosoblgaz.ru (витрина/ЛК)
- Корень: `index.php`, `auth.php`, `detail.php`, `form.php`, `idea_detail.php`, `register.php`, `privacy-policy.php`, `404.php`, `style.css`, `urlrewrite.php` — основные страницы витрины и форм.
- `include/` — подключаемые части шаблона/блоки.
- `ideas/`, `innovations/`, `projects/` — страницы каталога/карточек.
- `lk/` — личный кабинет, подпапки `ajax/`, `applications/`, `idea/`, `includes/`, `logs/`, `stakeholder/`, `cron/`.
- `mediacenter/` — медиа/новости.
- Логи: `join_team.log`.
- `.htaccess` — отключение авторизации Bitrix24 для `/bitrix`, `/upload`, `/local` и rewrite несуществующих путей на `/index.php`.
